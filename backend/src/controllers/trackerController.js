import mongoose from 'mongoose';
import Habit from '../models/Habit.js';
import HabitEntry from '../models/HabitEntry.js';

// @desc    Get tracking data for a specific month
// @route   GET /api/tracker/:year/:month
// @access  Private
const getMonthlyTracking = async (req, res) => {
  try {
    const { year, month } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Get all active habits for the user
    const habits = await Habit.find({ 
      userId: req.user._id,
      isActive: true 
    });

    // Get all entries for these habits in the specified month
    const habitEntries = await HabitEntry.find({
      userId: req.user._id,
      habitId: { $in: habits.map(h => h._id) },
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });

    // Format the response
    const response = {
      month: parseInt(month),
      year: parseInt(year),
      habits: habits.map(habit => {
        const entries = habitEntries
          .filter(entry => entry.habitId.toString() === habit._id.toString())
          .map(entry => ({
            date: entry.date,
            completed: entry.completed
          }));
        
        return {
          _id: habit._id,
          name: habit.name,
          entries
        };
      })
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update habit completion status for a specific date
// @route   PUT /api/tracker/update
// @access  Private
const updateHabitEntry = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { habitId, date, completed } = req.body;
    
    console.log('Received update request:', { habitId, date, completed, userId: req.user._id });
    
    if (!habitId || !date) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields',
        required: ['habitId', 'date'],
        received: { habitId, date }
      });
    }
    
    // Validate habit exists and belongs to user
    const habit = await Habit.findOne({ 
      _id: habitId, 
      userId: req.user._id,
      isActive: true 
    }).session(session);

    if (!habit) {
      console.error('Habit not found or not active:', { habitId, userId: req.user._id });
      return res.status(404).json({ 
        success: false,
        message: 'Habit not found or inactive',
        habitId
      });
    }

    // Convert date string to Date object at start of day in UTC
    let entryDate;
    try {
      entryDate = new Date(date);
      if (isNaN(entryDate.getTime())) {
        throw new Error('Invalid date format');
      }
      entryDate.setUTCHours(0, 0, 0, 0);
    } catch (error) {
      console.error('Invalid date format:', { date, error: error.message });
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Expected YYYY-MM-DD',
        received: date
      });
    }

    // Find or create entry
    const updateData = {
      user: req.user._id,
      habit: habit._id,
      date: entryDate,
      completed: completed === true
    };

    console.log('Updating habit entry:', updateData);

    const entry = await HabitEntry.findOneAndUpdate(
      {
        user: req.user._id,
        habit: habit._id,
        date: entryDate
      },
      { $set: updateData },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        session
      }
    );

    await session.commitTransaction();
    
    console.log('Successfully updated habit entry:', entry);
    
    res.json({
      success: true,
      data: entry
    });
    
  } catch (error) {
    await session.abortTransaction();
    
    console.error('Error updating habit entry:', {
      error: error.message,
      stack: error.stack,
      requestBody: req.body,
      userId: req.user?._id
    });
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to update habit entry',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    session.endSession();
  }
};

// @desc    Get streak data for all habits
// @route   GET /api/tracker/streaks
// @access  Private
const getStreaks = async (req, res) => {
  try {
    // Get all active habits for the user
    const habits = await Habit.find({ 
      userId: req.user._id,
      isActive: true 
    });

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const streaks = [];

    for (const habit of habits) {
      // Get all entries for this habit, sorted by date descending
      const entries = await HabitEntry.find({
        userId: req.user._id,
        habitId: habit._id
      }).sort({ date: -1 });

      let currentStreak = 0;
      let bestStreak = 0;
      let tempStreak = 0;
      let lastDate = null;

      // Calculate streaks
      for (const entry of entries) {
        const entryDate = new Date(entry.date);
        entryDate.setUTCHours(0, 0, 0, 0);

        // Skip future dates
        if (entryDate > today) continue;

        // If this is the first iteration, set the lastDate
        if (!lastDate) {
          lastDate = entryDate;
        }

        // Check if entries are consecutive
        const diffTime = Math.abs(lastDate - entryDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1 && entry.completed) {
          // Consecutive day and completed
          tempStreak++;
        } else if (entry.completed) {
          // Not consecutive but completed, reset temp streak
          tempStreak = 1;
        } else {
          // Not completed, reset temp streak
          tempStreak = 0;
        }

        // Update best streak if current temp streak is better
        if (tempStreak > bestStreak) {
          bestStreak = tempStreak;
        }

        lastDate = entryDate;
      }

      // Get the current streak (most recent consecutive days)
      currentStreak = 0;
      let currentDate = new Date(today);
      
      while (true) {
        const entry = entries.find(e => {
          const entryDate = new Date(e.date);
          entryDate.setUTCHours(0, 0, 0, 0);
          return entryDate.getTime() === currentDate.getTime();
        });

        if (!entry || !entry.completed) break;
        
        currentStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      }

      // Get completion percentage for current month
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      const monthEntries = await HabitEntry.find({
        userId: req.user._id,
        habitId: habit._id,
        date: { $gte: startOfMonth, $lte: endOfMonth },
        completed: true
      });

      const totalDaysInMonth = endOfMonth.getDate();
      const completionPercentage = Math.round((monthEntries.length / totalDaysInMonth) * 100);

      streaks.push({
        habitId: habit._id,
        habitName: habit.name,
        currentStreak,
        bestStreak,
        completionPercentage
      });
    }

    res.json(streaks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  getMonthlyTracking,
  updateHabitEntry,
  getStreaks
};
