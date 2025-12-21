import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
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
  }],
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total completions
habitSchema.virtual('totalCompletions', {
  ref: 'HabitEntry',
  localField: '_id',
  foreignField: 'habit',
  count: true
});

// Virtual for successful completions
habitSchema.virtual('successfulCompletions', {
  ref: 'HabitEntry',
  localField: '_id',
  foreignField: 'habit',
  match: { completed: true },
  count: true
});

// Update completion rate before saving
habitSchema.pre('save', async function () {
  try {
    // Only calculate if we're modifying relevant fields
    if (this.isModified('totalCompletions') || this.isModified('successfulCompletions')) {
      const total = typeof this.totalCompletions === 'number' ? this.totalCompletions : 0;
      const successful = typeof this.successfulCompletions === 'number' ? this.successfulCompletions : 0;

      // Only calculate if we have valid numbers
      if (!isNaN(total) && !isNaN(successful) && total > 0) {
        this.completionRate = Math.round((successful / total) * 100);
      } else {
        this.completionRate = 0;
      }
    }
  } catch (error) {
    console.error('Error in pre-save hook:', error);
    this.completionRate = 0;
  }
});

// Update streaks when a completion is toggled
// Update streaks when a completion is toggled
habitSchema.methods.updateStreak = async function (completed) {
  try {
    // Get all completed entries up to current date, sorted by date DESCENDING (newest first)
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    const allEntries = await this.model('HabitEntry')
      .find({
        habit: this._id,
        completed: true,
        date: { $lte: today } // Only include entries up to current date
      })
      .sort({ date: -1 })
      .select('date')
      .lean();
      
    // Set up today's date at midnight
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    
    // Filter out any future dates that might be included
    const validEntries = allEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate <= todayMidnight;
    });

    let currentStreak = 0;

    if (validEntries.length > 0) {
      // Start with the most recent valid entry
      let lastEntryDate = new Date(validEntries[0].date);
      lastEntryDate.setHours(0, 0, 0, 0);
      
      // If the last entry is in the future, find the most recent past entry
      
      if (lastEntryDate > todayMidnight) {
        const pastEntry = validEntries.find(entry => {
          const entryDate = new Date(entry.date);
          entryDate.setHours(0, 0, 0, 0);
          return entryDate <= todayMidnight;
        });
        
        if (!pastEntry) {
          // No valid past entries
          this.currentStreak = 0;
          this.lastCompleted = null;
          await this.save();
          return this;
        }
        lastEntryDate = new Date(pastEntry.date);
        lastEntryDate.setHours(0, 0, 0, 0);
      }

      // If the most recent entry is today or yesterday, we might have a current streak
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastEntryDate.getTime() >= yesterday.getTime()) {
        currentStreak = 1;
        let previousDate = lastEntryDate;

        // Now check previous valid entries for consecutive completion
        for (let i = 0; i < validEntries.length; i++) {
          const currentDate = new Date(validEntries[i].date);
          currentDate.setHours(0, 0, 0, 0);
          
          // Skip if this is the first entry (already processed)
          if (i === 0) continue;
          
          // Skip if date is in the future (shouldn't happen due to filter, but just in case)
          if (currentDate > today) continue;

          // Calculate days between previous and current entry
          const diffTime = previousDate.getTime() - currentDate.getTime();
          const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

          if (diffDays === 1) {
            // Consecutive day found, increment streak
            currentStreak++;
            previousDate = currentDate;
          } else if (diffDays > 1) {
            // Gap found, streak is broken
            break;
          }
          // If diffDays === 0, it's a duplicate entry for the same day, skip it
        }
      }

      this.lastCompleted = validEntries[0].date;
    } else {
      this.lastCompleted = null;
    }

    // Update the streak
    this.currentStreak = currentStreak;

    // Update best streak if needed
    if (this.currentStreak > this.bestStreak) {
      this.bestStreak = this.currentStreak;
    }

    // Update completion stats
    this.totalCompletions = await this.model('HabitEntry').countDocuments({
      habit: this._id
    });

    this.successfulCompletions = await this.model('HabitEntry').countDocuments({
      habit: this._id,
      completed: true
    });

    await this.save();
    return this;
  } catch (error) {
    console.error('Error updating streak:', error);
    throw error;
  }
};

// Create a compound index to ensure unique habit names per user
habitSchema.index({ userId: 1, name: 1 }, { unique: true });
// Index for faster queries
habitSchema.index({ userId: 1, isActive: 1 });
habitSchema.index({ 'frequency.day': 1 });

const Habit = mongoose.model('Habit', habitSchema);

export default Habit;
