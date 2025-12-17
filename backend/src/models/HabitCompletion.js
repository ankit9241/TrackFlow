import mongoose from 'mongoose';

const habitCompletionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  // Track quantity if the habit is quantifiable (e.g., 30 minutes of exercise)
  quantity: {
    type: Number,
    min: 0,
    default: 1
  },
  // Notes about this specific completion
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  // Time spent on the activity (in minutes)
  duration: {
    type: Number,
    min: 0,
    default: 0
  },
  // For tracking mood or energy level during completion (1-5)
  mood: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  // Difficulty level (1-5)
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  // Location where the habit was performed
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    name: String
  },
  // Metadata
  completedAt: {
    type: Date,
    default: null
  },
  // For recurring habits, track if this was a make-up for a missed day
  isMakeup: {
    type: Boolean,
    default: false
  },
  // Any additional data as key-value pairs
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create a compound index to ensure one completion per habit per day
habitCompletionSchema.index({ habitId: 1, date: 1 }, { unique: true });

// Index for common queries
habitCompletionSchema.index({ userId: 1, date: -1 });
habitCompletionSchema.index({ completed: 1, date: -1 });

// 2dsphere index for location-based queries
habitCompletionSchema.index({ 'location': '2dsphere' });

// Pre-save hook to set completedAt timestamp
habitCompletionSchema.pre('save', function(next) {
  if (this.isModified('completed') && this.completed && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

// Method to mark as completed with optional data
habitCompletionSchema.methods.markCompleted = async function({
  quantity = 1,
  notes = '',
  duration = 0,
  mood = null,
  difficulty = null,
  location = null,
  metadata = {}
} = {}) {
  this.completed = true;
  this.quantity = quantity;
  this.notes = notes;
  this.duration = duration;
  this.mood = mood;
  this.difficulty = difficulty;
  this.completedAt = new Date();
  
  if (location) {
    this.location = location;
  }
  
  // Merge metadata
  this.metadata = { ...this.metadata, ...metadata };
  
  return this.save();
};

const HabitCompletion = mongoose.model('HabitCompletion', habitCompletionSchema);

export default HabitCompletion;