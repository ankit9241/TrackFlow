import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  name: {
    type: String,
    required: [true, 'Habit name is required'],
    trim: true,
    maxlength: [50, 'Habit name cannot be more than 50 characters']
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters'],
    default: ''
  },
  category: {
    type: String,
    enum: ['health', 'work', 'personal', 'fitness', 'education', 'other'],
    default: 'personal'
  },
  frequency: {
    type: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        required: true
      },
      time: {
        type: String,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        default: '09:00'
      }
    }],
    default: []
  },
  target: {
    type: Number,
    min: 1,
    default: 1
  },
  targetUnit: {
    type: String,
    enum: ['times', 'minutes', 'pages', 'items', 'other'],
    default: 'times'
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  bestStreak: {
    type: Number,
    default: 0
  },
  lastCompleted: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // Virtual for completion stats
  completionRate: {
    type: Number,
    default: 0
  },
  // Tags for better organization
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total completions
habitSchema.virtual('totalCompletions', {
  ref: 'HabitCompletion',
  localField: '_id',
  foreignField: 'habitId',
  count: true
});

// Virtual for successful completions
habitSchema.virtual('successfulCompletions', {
  ref: 'HabitCompletion',
  localField: '_id',
  foreignField: 'habitId',
  match: { completed: true },
  count: true
});

// Update completion rate before saving
habitSchema.pre('save', function(next) {
  if (this.isModified('totalCompletions') || this.isModified('successfulCompletions')) {
    this.completionRate = this.totalCompletions > 0 
      ? Math.round((this.successfulCompletions / this.totalCompletions) * 100) 
      : 0;
  }
  next();
});

// Update streaks when a completion is added
habitSchema.methods.updateStreak = async function(completed) {
  if (completed) {
    this.currentStreak += 1;
    if (this.currentStreak > this.bestStreak) {
      this.bestStreak = this.currentStreak;
    }
    this.lastCompleted = new Date();
  } else {
    this.currentStreak = 0;
  }
  await this.save();
};

// Create a compound index to ensure unique habit names per user
habitSchema.index({ userId: 1, name: 1 }, { unique: true });
// Index for faster queries
habitSchema.index({ userId: 1, isActive: 1 });
habitSchema.index({ 'frequency.day': 1 });

const Habit = mongoose.model('Habit', habitSchema);

export default Habit;
