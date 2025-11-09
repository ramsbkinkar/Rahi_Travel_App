import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { dbAsync } from '../config/db';
import { Request, Response } from 'express';

const router = Router();

interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
}

// Validation schemas
const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// Sign up route
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = signupSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await dbAsync.get(
      'SELECT id FROM users WHERE email = ?',
      [email]
    ) as User | undefined;

    if (existingUser) {
      return res.status(400).json({ 
        status: 'error',
        message: 'User already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const result = await dbAsync.run(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const newUser = await dbAsync.get(
      'SELECT id, name, email FROM users WHERE email = ?',
      [email]
    ) as Omit<User, 'password_hash'>;

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Invalid input',
        errors: error.errors 
      });
    }
    console.error('Signup error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Server error' 
    });
  }
});

// Login route
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const user = await dbAsync.get(
      'SELECT id, name, email, password_hash FROM users WHERE email = ?',
      [email]
    ) as User | undefined;

    if (!user) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Invalid credentials' 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Invalid credentials' 
      });
    }

    // Return user data (excluding password)
    const { password_hash, ...userData } = user;
    res.json({
      status: 'success',
      data: {
        user: userData
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Invalid input',
        errors: error.errors 
      });
    }
    console.error('Login error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Server error' 
    });
  }
});

export default router; 