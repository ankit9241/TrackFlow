// models/HabitEntry.js
import mongoose from 'mongoose';

const habitEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  habit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure one entry per habit per day
habitEntrySchema.index({ user: 1, habit: 1, date: 1 }, { unique: true });

// Update habit stats when an entry is saved
habitEntrySchema.post('save', async function(doc) {
  try {
    const habit = await Habit.findById(doc.habit);
    if (habit) {
      await habit.updateStreak(doc.completed);
    }
  } catch (error) {
    console.error('Error updating habit stats:', error);
  }
});

// Update when an entry is removed
habitEntrySchema.post('remove', async function(doc) {
  try {
    const habit = await Habit.findById(doc.habit);
    if (habit) {
      await habit.updateStreak(false);
    }
  } catch (error) {
    console.error('Error updating habit stats after removal:', error);
  }
});

const HabitEntry = mongoose.model('HabitEntry', habitEntrySchema);

export default HabitEntry;