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

const HabitEntry = mongoose.model('HabitEntry', habitEntrySchema);

export default HabitEntry;