import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import uploadRoutes from './routes/uploads';
import userRoutes from './routes/users';
import initializeDatabase from './db/init';
import { createTestUsers } from './db/create-user';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  'http://localhost:8000',
  'http://localhost:8080',
  'http://localhost:3000',
  'http://192.168.31.185:8000',
  'http://192.168.31.185:8080'
];

// In production, allow all origins for Amplify
const corsOptions = process.env.NODE_ENV === 'production' 
  ? { origin: true, credentials: true }
  : {
      origin: function(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // For development, you can enable this to see which origin is being blocked
        console.log('Request from origin:', origin);
        
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    };

// Middleware
app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' })); // Increase payload limit for image uploads

// Enable pre-flight requests for all routes
app.options('*', cors());

// Serve static files from public directory
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React build
  app.use(express.static(path.join(__dirname, '../../dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist', 'index.html'));
  });
}

// Initialize the database before starting the server
initializeDatabase().then(async () => {
  // Create test users if they don't exist
  await createTestUsers();
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`CORS enabled for origins:`, allowedOrigins);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
}); 