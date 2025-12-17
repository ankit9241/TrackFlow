// controllers/analyticsController.js
import HabitEntry from '../models/HabitEntry.js';
import Habit from '../models/Habit.js';

// @desc    Get analytics for a habit
// @route   GET /api/analytics/:habitId
// @access  Private
export const getHabitAnalytics = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.habitId,
      user: req.user.id
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const entries = await HabitEntry.find({
      habit: req.params.habitId,
      user: req.user.id
    });

    const completed = entries.filter(entry => entry.completed).length;
    const total = entries.length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    res.json({
      habit: habit.name,
      totalEntries: total,
      completedEntries: completed,
      completionRate: completionRate.toFixed(2)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get streak data for a habit
// @route   GET /api/analytics/:habitId/streaks
// @access  Private
export const getHabitStreaks = async (req, res) => {
  try {
    const entries = await HabitEntry.find({
      habit: req.params.habitId,
      user: req.user.id,
      completed: true
    }).sort({ date: 1 });

    // Calculate streak logic here
    // This is a simplified version - you might want to implement more robust streak calculation
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = 1; i < entries.length; i++) {
      const prevDate = new Date(entries[i - 1].date);
      const currDate = new Date(entries[i].date);
      const diffTime = Math.abs(currDate - prevDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else if (diffDays > 1) {
        currentStreak = 0;
        tempStreak = 0;
      }
    }

    res.json({
      currentStreak,
      longestStreak
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get monthly completion data
// @route   GET /api/analytics/monthly/:year/:month
// @access  Private
export const getMonthlyCompletion = async (req, res) => {
  try {
    const { year, month } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const entries = await HabitEntry.find({
      user: req.user.id,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });

    // Group by date and count completed entries
    const dailyCompletion = {};
    entries.forEach(entry => {
      const dateStr = entry.date.toISOString().split('T')[0];
      if (!dailyCompletion[dateStr]) {
        dailyCompletion[dateStr] = { total: 0, completed: 0 };
      }
      dailyCompletion[dateStr].total++;
      if (entry.completed) {
        dailyCompletion[dateStr].completed++;
      }
    });

    res.json(dailyCompletion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};