import Habit from '../models/Habit.js';
import HabitEntry from '../models/HabitEntry.js';

const createHabit = async (req, res) => {
  try {
    const {
      name,
      description = '',
      category = 'personal',
      frequency = [],
      target = 1,
      targetUnit = 'times',
      tags = []
    } = req.body;

    // Check if habit already exists for this user
    const habitExists = await Habit.findOne({
      userId: req.user._id,
      name: { $regex: new RegExp(`^${name}$`, 'i') } // Case insensitive match
    });

    if (habitExists) {
      return res.status(400).json({ message: 'Habit already exists' });
    }

    const habit = new Habit({
      userId: req.user._id,
      name,
      description,
      category,
      frequency,
      target,
      targetUnit,
      tags,
      // Initialize tracking fields
      totalCompletions: 0,
      successfulCompletions: 0,
      completionRate: 0,
      currentStreak: 0,
      bestStreak: 0,
      isActive: true,
      lastCompleted: null,
      startDate: req.body.startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: req.body.endDate || new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59)
    });

    const createdHabit = await habit.save();
    res.status(201).json(createdHabit);
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).json({
      message: 'Error creating habit',
      error: error.message
    });
  }
};

// @desc    Get all habits for a user
// @route   GET /api/habits
// @access  Private
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user._id, isActive: true })
      .populate('totalCompletions')
      .populate('successfulCompletions');
    res.json(habits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a habit
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = async (req, res) => {
  try {
    const { name, startDate, endDate } = req.body;

    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    if (name) habit.name = name;
    if (startDate) habit.startDate = startDate;
    if (endDate !== undefined) habit.endDate = endDate;

    const updatedHabit = await habit.save();

    res.json(updatedHabit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a habit
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Soft delete by marking as inactive
    habit.isActive = false;
    await habit.save();

    res.json({ message: 'Habit removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get monthly analytics for habits
// @route   GET /api/habits/analytics/:year/:month
// @access  Private
const getMonthlyAnalytics = async (req, res) => {
  try {
    const { year, month } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Get all active habits for the user
    const habits = await Habit.find({
      userId: req.user._id,
      isActive: true
    });

    // Get all habit entries for the month
    const habitEntries = await HabitEntry.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: endDate }
    });

    // Calculate analytics for each habit
    const habitsWithAnalytics = await Promise.all(habits.map(async (habit) => {
      const entries = habitEntries.filter(entry =>
        entry.habitId.toString() === habit._id.toString()
      );

      const completedCount = entries.filter(entry => entry.completed).length;
      const totalDays = endDate.getDate();
      const completionRate = Math.round((completedCount / totalDays) * 100);

      // Calculate current streak
      let currentStreak = 0;
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Check if habit was completed today or yesterday
      const todayEntry = entries.find(entry =>
        isSameDay(new Date(entry.date), today)
      );
      const yesterdayEntry = entries.find(entry =>
        isSameDay(new Date(entry.date), yesterday)
      );

      if (todayEntry?.completed) {
        currentStreak = 1;
        if (yesterdayEntry?.completed) {
          // Find the start of the streak
          let streakDate = new Date(yesterday);
          let dayBefore = new Date(streakDate);
          dayBefore.setDate(dayBefore.getDate() - 1);

          while (true) {
            const dayEntry = entries.find(entry =>
              isSameDay(new Date(entry.date), dayBefore)
            );

            if (!dayEntry?.completed) break;

            currentStreak++;
            dayBefore.setDate(dayBefore.getDate() - 1);
          }
        }
      }

      return {
        _id: habit._id,
        name: habit.name,
        completionRate,
        completedCount,
        currentStreak,
        totalDays,
        entries: entries.map(entry => ({
          date: entry.date,
          completed: entry.completed
        }))
      };
    }));

    // Calculate overall stats
    const totalHabits = habitsWithAnalytics.length;
    const completedHabits = habitsWithAnalytics.filter(h => h.completionRate >= 100).length;
    const averageCompletion = totalHabits > 0
      ? Math.round(habitsWithAnalytics.reduce((sum, h) => sum + h.completionRate, 0) / totalHabits)
      : 0;

    res.json({
      success: true,
      data: {
        habits: habitsWithAnalytics,
        stats: {
          totalHabits,
          completedHabits,
          averageCompletion,
          startDate,
          endDate
        }
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};

export {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  getMonthlyAnalytics
};
