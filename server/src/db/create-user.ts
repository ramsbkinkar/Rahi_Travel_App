import { dbAsync } from '../config/db';
import bcrypt from 'bcryptjs';

const createTestUsers = async () => {
  try {
    // First, check and add the 'bio' column if it doesn't exist
    try {
      // Try to fetch a user with bio field to see if it exists
      await dbAsync.get('SELECT bio FROM users LIMIT 1');
      console.log('Bio field already exists in users table');
    } catch (error) {
      // If error, add the bio column
      console.log('Adding bio column to users table...');
      await dbAsync.exec('ALTER TABLE users ADD COLUMN bio TEXT');
      console.log('Added bio column to users table');
    }
    
    const testUsers = [
      {
        name: 'John Traveller',
        email: 'john@example.com',
        password: 'password123',
        bio: 'Adventure seeker and mountain lover. Always looking for the next big thrill!'
      },
      {
        name: 'Beach Bum',
        email: 'beach@example.com',
        password: 'password123',
        bio: 'Beach lifestyle enthusiast. Sun, sand, and sea are all I need.'
      },
      {
        name: 'Culture Vulture',
        email: 'culture@example.com',
        password: 'password123',
        bio: 'History buff and museum explorer. I travel to understand different cultures.'
      },
      {
        name: 'Food Explorer',
        email: 'food@example.com',
        password: 'password123',
        bio: 'Traveling the world one dish at a time. Food is my passport to cultures.'
      },
      {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        bio: 'This is a test account for the Raahi travel social platform.'
      }
    ];
    
    // Create each test user if they don't already exist
    for (const user of testUsers) {
      // Check if user already exists
      const existingUser = await dbAsync.get(
        'SELECT id FROM users WHERE email = ?',
        [user.email]
      );
      
      if (existingUser) {
        console.log(`User ${user.email} already exists, updating bio...`);
        
        // Update the bio if user exists
        await dbAsync.run(
          'UPDATE users SET bio = ? WHERE email = ?',
          [user.bio, user.email]
        );
      } else {
        console.log(`Creating user ${user.email}...`);
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        
        // Create user
        await dbAsync.run(
          'INSERT INTO users (name, email, password_hash, bio) VALUES (?, ?, ?, ?)',
          [user.name, user.email, hashedPassword, user.bio]
        );
      }
    }
    
    console.log('Test users setup completed');
  } catch (error) {
    console.error('Error creating test users:', error);
  }
};

// Run the function
createTestUsers(); 