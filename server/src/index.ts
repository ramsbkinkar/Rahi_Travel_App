import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import uploadRoutes from './routes/uploads';
import userRoutes from './routes/users';
import initializeDatabase from './db/init';
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

// Middleware
app.use(cors({
  origin: function(origin, callback) {
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
}));

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

// Initialize the database before starting the server
initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`CORS enabled for origins:`, allowedOrigins);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
}); 