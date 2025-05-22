import { Router } from 'express';
import { z } from 'zod';
import { dbAsync } from '../config/db';
import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

// Validation schemas
const createPostSchema = z.object({
  caption: z.string().optional(),
  location: z.string().optional(),
  image_url: z.string(), // URL to image
  tags: z.array(z.string()).optional(),
  user_id: z.number() // TODO: Get from auth middleware
});

// Get all posts with pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    
    // Get posts with user info and comments count
    const posts = await dbAsync.all(`
      SELECT 
        p.id, p.caption, p.location, p.image_url, p.likes_count, p.created_at,
        u.id as user_id, u.name as username, u.avatar_url,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);
    
    // For each post, get its tags
    for (const post of posts) {
      // Get post tags
      const tags = await dbAsync.all(`
        SELECT tag FROM post_tags WHERE post_id = ?
      `, [post.id]);
      
      post.tags = tags.map(t => t.tag);
    }
    
    res.json({
      status: 'success',
      data: posts,
      pagination: {
        page,
        limit,
        total: await dbAsync.get('SELECT COUNT(*) as count FROM posts').then(r => r.count)
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Server error' 
    });
  }
});

// Get a single post by ID with comments
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    
    // Get post with user info
    const post = await dbAsync.get(`
      SELECT 
        p.id, p.caption, p.location, p.image_url, p.likes_count, p.created_at,
        u.id as user_id, u.name as username, u.avatar_url
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [postId]);
    
    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }
    
    // Get post tags
    const tags = await dbAsync.all(`
      SELECT tag FROM post_tags WHERE post_id = ?
    `, [postId]);
    
    post.tags = tags.map(t => t.tag);
    
    // Get post comments with user info
    const comments = await dbAsync.all(`
      SELECT 
        c.id, c.content, c.created_at,
        u.id as user_id, u.name as username, u.avatar_url
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at DESC
    `, [postId]);
    
    post.comments = comments;
    
    res.json({
      status: 'success',
      data: post
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Server error' 
    });
  }
});

// Create a new post
router.post('/', async (req: Request, res: Response) => {
  try {
    const { caption, location, image_url, tags, user_id } = createPostSchema.parse(req.body);
    
    // Create post
    const result = await dbAsync.run(
      'INSERT INTO posts (user_id, caption, location, image_url) VALUES (?, ?, ?, ?)',
      [user_id, caption || null, location || null, image_url]
    );
    
    const postId = result.lastID;
    
    // Add tags if provided
    if (tags && tags.length > 0) {
      // First, we need to create the post_tags table if it doesn't exist
      await dbAsync.exec(`
        CREATE TABLE IF NOT EXISTS post_tags (
          post_id INTEGER,
          tag TEXT,
          PRIMARY KEY (post_id, tag),
          FOREIGN KEY (post_id) REFERENCES posts(id)
        )
      `);
      
      // Insert tags
      for (const tag of tags) {
        await dbAsync.run(
          'INSERT INTO post_tags (post_id, tag) VALUES (?, ?)',
          [postId, tag.toLowerCase().trim()]
        );
      }
    }
    
    // Get the created post
    const newPost = await dbAsync.get(`
      SELECT 
        p.id, p.caption, p.location, p.image_url, p.likes_count, p.created_at,
        u.id as user_id, u.name as username, u.avatar_url
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [postId]);
    
    // Get post tags
    const postTags = await dbAsync.all(`
      SELECT tag FROM post_tags WHERE post_id = ?
    `, [postId]);
    
    newPost.tags = postTags.map(t => t.tag);
    
    res.status(201).json({
      status: 'success',
      data: newPost
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Invalid input',
        errors: error.errors 
      });
    }
    console.error('Error creating post:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Server error' 
    });
  }
});

// Like/unlike a post
router.post('/:id/like', async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    const { user_id } = req.body;
    
    if (!user_id) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID is required'
      });
    }
    
    // Check if post exists
    const post = await dbAsync.get('SELECT id FROM posts WHERE id = ?', [postId]);
    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }
    
    // Check if user already liked the post
    const existingLike = await dbAsync.get(
      'SELECT post_id FROM likes WHERE post_id = ? AND user_id = ?',
      [postId, user_id]
    );
    
    let action = 'liked';
    
    if (existingLike) {
      // Unlike the post
      await dbAsync.run(
        'DELETE FROM likes WHERE post_id = ? AND user_id = ?',
        [postId, user_id]
      );
      
      // Decrement likes count
      await dbAsync.run(
        'UPDATE posts SET likes_count = likes_count - 1 WHERE id = ?',
        [postId]
      );
      
      action = 'unliked';
    } else {
      // Like the post
      await dbAsync.run(
        'INSERT INTO likes (post_id, user_id) VALUES (?, ?)',
        [postId, user_id]
      );
      
      // Increment likes count
      await dbAsync.run(
        'UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?',
        [postId]
      );
    }
    
    // Get updated likes count
    const updatedPost = await dbAsync.get('SELECT likes_count FROM posts WHERE id = ?', [postId]);
    
    res.json({
      status: 'success',
      data: {
        action,
        likes_count: updatedPost.likes_count
      }
    });
  } catch (error) {
    console.error('Error liking/unliking post:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Server error' 
    });
  }
});

// Add a comment to a post
router.post('/:id/comment', async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    const { user_id, content } = req.body;
    
    if (!user_id || !content) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID and content are required'
      });
    }
    
    // Check if post exists
    const post = await dbAsync.get('SELECT id FROM posts WHERE id = ?', [postId]);
    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }
    
    // Add comment
    const result = await dbAsync.run(
      'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [postId, user_id, content]
    );
    
    // Get the created comment with user info
    const newComment = await dbAsync.get(`
      SELECT 
        c.id, c.content, c.created_at,
        u.id as user_id, u.name as username, u.avatar_url
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [result.lastID]);
    
    res.status(201).json({
      status: 'success',
      data: newComment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Server error' 
    });
  }
});

// Get comments for a post
router.get('/:id/comments', async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    
    // Check if post exists
    const post = await dbAsync.get('SELECT id FROM posts WHERE id = ?', [postId]);
    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }
    
    // Get post comments with user info
    const comments = await dbAsync.all(`
      SELECT 
        c.id, c.post_id, c.content, c.created_at,
        u.id as user_id, u.name as username, u.avatar_url
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at DESC
    `, [postId]);
    
    res.json({
      status: 'success',
      data: comments
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Server error' 
    });
  }
});

export default router; 