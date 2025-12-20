import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module alternative for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Get MongoDB connection
const db = mongoose.connection;

// MongoDB connection events
db.on('connecting', () => {
  console.log('Connecting to MongoDB...');
});

db.on('connected', () => {
  // This will be handled by the connect() promise below
});

db.on('error', (err) => {
  console.error('MongoDB connection error');
  process.exit(1);
});

db.on('disconnected', () => {
  // Only log disconnection if we were previously connected
  if (mongoose.connection.readyState === 0) {
    console.log('MongoDB disconnected');
  }
});

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection');
    process.exit(1);
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch(err => {
    console.error('MongoDB connection failed');
    process.exit(1);
  });

// Routes
import authRoutes from './routes/auth.js';
import habitRoutes from './routes/habits.js';
import trackerRoutes from './routes/tracker.js';
import analyticsRoutes from './routes/analytics.js';
import habitCompletionRoutes from './routes/habitCompletionRoutes.js';


app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/tracker', trackerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/habit-completions', habitCompletionRoutes);
// Basic route for testing
app.get('/', (req, res) => {
  res.send('TrackFlow API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  console.error('Error details:', {
    message: err.message,
    name: err.name,
    ...(err.errors && { errors: err.errors })
  });

  res.status(500).json({
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});