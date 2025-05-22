import { Router } from 'express';
import { z } from 'zod';
import { dbAsync } from '../config/db';
import { Request, Response } from 'express';

const router = Router();

// Validation schemas
const updateProfileSchema = z.object({
  bio: z.string().optional(),
  avatar_url: z.string().optional(),
  user_id: z.number()
});

// Get user profile by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Get user info
    const user = await dbAsync.get(`
      SELECT id, name, email, avatar_url, bio, created_at
      FROM users
      WHERE id = ?
    `, [userId]);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Get user's post count
    const postCount = await dbAsync.get(`
      SELECT COUNT(*) as count
      FROM posts
      WHERE user_id = ?
    `, [userId]);
    
    // Get user's latest posts
    const posts = await dbAsync.all(`
      SELECT 
        p.id, p.caption, p.location, p.image_url, p.likes_count, p.created_at,
        u.id as user_id, u.name as username, u.avatar_url,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
      LIMIT 10
    `, [userId]);
    
    // For each post, get its tags
    for (const post of posts) {
      const tags = await dbAsync.all(`
        SELECT tag FROM post_tags WHERE post_id = ?
      `, [post.id]);
      
      post.tags = tags.map(t => t.tag);
    }
    
    res.json({
      status: 'success',
      data: {
        user,
        postCount: postCount.count,
        posts
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Server error' 
    });
  }
});

// Update user profile
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const { bio, avatar_url, user_id } = updateProfileSchema.parse(req.body);
    
    // Validate that the requester is updating their own profile
    if (userId !== user_id) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only update your own profile'
      });
    }
    
    // Check if user exists
    const user = await dbAsync.get('SELECT id FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Build update query dynamically based on what fields are provided
    let updateFields = [];
    let params = [];
    
    if (bio !== undefined) {
      updateFields.push('bio = ?');
      params.push(bio);
    }
    
    if (avatar_url !== undefined) {
      updateFields.push('avatar_url = ?');
      params.push(avatar_url);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No fields to update'
      });
    }
    
    // Add updated_at timestamp
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    
    // Add user ID to params
    params.push(userId);
    
    // Update user
    await dbAsync.run(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    );
    
    // Get updated user
    const updatedUser = await dbAsync.get(`
      SELECT id, name, email, avatar_url, bio, created_at, updated_at
      FROM users
      WHERE id = ?
    `, [userId]);
    
    res.json({
      status: 'success',
      data: updatedUser
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Invalid input',
        errors: error.errors 
      });
    }
    console.error('Error updating user profile:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Server error' 
    });
  }
});

// Get user's posts
router.get('/:id/posts', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    
    // Check if user exists
    const user = await dbAsync.get('SELECT id FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Get user's posts with pagination
    const posts = await dbAsync.all(`
      SELECT 
        p.id, p.caption, p.location, p.image_url, p.likes_count, p.created_at,
        u.id as user_id, u.name as username, u.avatar_url,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `, [userId, limit, offset]);
    
    // For each post, get its tags
    for (const post of posts) {
      const tags = await dbAsync.all(`
        SELECT tag FROM post_tags WHERE post_id = ?
      `, [post.id]);
      
      post.tags = tags.map(t => t.tag);
    }
    
    // Get total post count
    const postCount = await dbAsync.get(`
      SELECT COUNT(*) as count
      FROM posts
      WHERE user_id = ?
    `, [userId]);
    
    res.json({
      status: 'success',
      data: posts,
      pagination: {
        page,
        limit,
        total: postCount.count
      }
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Server error' 
    });
  }
});

// Search users
router.get('/search/users', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query must be at least 2 characters'
      });
    }
    
    // Search users by name
    const users = await dbAsync.all(`
      SELECT id, name, avatar_url, bio
      FROM users
      WHERE name LIKE ?
      LIMIT 20
    `, [`%${query}%`]);
    
    res.json({
      status: 'success',
      data: users
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Server error' 
    });
  }
});

export default router; 