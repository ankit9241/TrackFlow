import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Habit from '../models/Habit.js';
import HabitCompletion from '../models/HabitCompletion.js';

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file in the backend directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('Current MONGODB_URI:', process.env.MONGODB_URI ? '***URI is set***' : 'URI is not set');
    process.exit(1);
  }
};

// Migration to update existing data
const migrateDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Starting database migration...');
    
    // 1. Update all habits with default values for new fields
    const habitsUpdate = await Habit.updateMany(
      {},
      {
        $set: {
          description: '',
          category: 'personal',
          frequency: [],
          target: 1,
          targetUnit: 'times',
          currentStreak: 0,
          bestStreak: 0,
          tags: []
        }
      }
    );
    
    console.log(`Updated ${habitsUpdate.nModified} habits with new fields`);
    
    // 2. Update all habit completions with default values for new fields
    const completionsUpdate = await HabitCompletion.updateMany(
      {},
      {
        $set: {
          quantity: 1,
          notes: '',
          duration: 0,
          isMakeup: false,
          metadata: {}
        }
      }
    );
    
    console.log(`Updated ${completionsUpdate.nModified} habit completions with new fields`);
    
    console.log('\nMigration completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run the migration
migrateDatabase();
