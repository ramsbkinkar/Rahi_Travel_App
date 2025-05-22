import { dbAsync } from '../config/db';
import bcrypt from 'bcryptjs';
import initializeDatabase from './init';

const seedDatabase = async () => {
  try {
    // Initialize the database first
    await initializeDatabase();
    console.log('Database initialized');
    
    // Check if users table already has data
    const usersCount = await dbAsync.get('SELECT COUNT(*) as count FROM users');
    if (usersCount.count > 0) {
      console.log('Database already has data, skipping seed');
      return;
    }
    
    // Create test users
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);
    
    await dbAsync.run(
      'INSERT INTO users (name, email, password_hash, avatar_url) VALUES (?, ?, ?, ?)',
      ['Mountain Lover', 'mountain@example.com', password, 'https://i.pravatar.cc/150?img=1']
    );
    
    await dbAsync.run(
      'INSERT INTO users (name, email, password_hash, avatar_url) VALUES (?, ?, ?, ?)',
      ['Beach Bum', 'beach@example.com', password, 'https://i.pravatar.cc/150?img=2']
    );
    
    await dbAsync.run(
      'INSERT INTO users (name, email, password_hash, avatar_url) VALUES (?, ?, ?, ?)',
      ['Culture Vulture', 'culture@example.com', password, 'https://i.pravatar.cc/150?img=3']
    );
    
    await dbAsync.run(
      'INSERT INTO users (name, email, password_hash, avatar_url) VALUES (?, ?, ?, ?)',
      ['Food Explorer', 'food@example.com', password, 'https://i.pravatar.cc/150?img=4']
    );
    
    // Create posts
    const posts = [
      {
        user_id: 1,
        caption: "Found paradise in the Himalayas! The views are absolutely breathtaking 😍 #mountains #himalayas #travel",
        location: "Manali, Himachal Pradesh",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        tags: ["mountains", "himalayas", "travel"]
      },
      {
        user_id: 2,
        caption: "Crystal clear waters and white sandy beaches. Goa never disappoints! 🏖️ #goa #beachlife #vacation",
        location: "Calangute Beach, Goa",
        image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        tags: ["goa", "beachlife", "vacation"]
      },
      {
        user_id: 3,
        caption: "Exploring the ancient temples of Hampi. The architecture is simply magnificent! 🏯 #hampi #heritage #explore",
        location: "Hampi, Karnataka",
        image_url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da",
        tags: ["hampi", "heritage", "explore"]
      },
      {
        user_id: 4,
        caption: "Trying the famous street food in Delhi. So many flavors! 🍽️ #streetfood #delhi #foodie",
        location: "Chandni Chowk, Delhi",
        image_url: "https://images.unsplash.com/photo-1567337710282-00832b415979",
        tags: ["streetfood", "delhi", "foodie"]
      }
    ];
    
    for (const post of posts) {
      // Create post
      const result = await dbAsync.run(
        'INSERT INTO posts (user_id, caption, location, image_url) VALUES (?, ?, ?, ?)',
        [post.user_id, post.caption, post.location, post.image_url]
      );
      
      const postId = result.lastID;
      
      // Create tags
      for (const tag of post.tags) {
        await dbAsync.run(
          'INSERT INTO post_tags (post_id, tag) VALUES (?, ?)',
          [postId, tag]
        );
      }
      
      // Add some likes
      for (let i = 1; i <= 4; i++) {
        if (i !== post.user_id) {
          await dbAsync.run(
            'INSERT INTO likes (post_id, user_id) VALUES (?, ?)',
            [postId, i]
          );
          
          // Update likes count
          await dbAsync.run(
            'UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?',
            [postId]
          );
        }
      }
      
      // Add some comments
      for (let i = 1; i <= 4; i++) {
        if (i !== post.user_id) {
          await dbAsync.run(
            'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
            [postId, i, `Great ${post.tags[0]} post! Would love to visit sometime.`]
          );
        }
      }
    }
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Run seeding if executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase; 