import HabitCompletion from '../models/HabitCompletion.js';
import { ErrorResponse } from '../utils/errorResponse.js';

// Toggle habit completion status
export const toggleHabitCompletion = async (req, res, next) => {
  try {
    const { habitId, date, completed = true } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!habitId || !date) {
      return next(new ErrorResponse('Habit ID and date are required', 400));
    }

    // Check if completion record exists
    let completion = await HabitCompletion.findOneAndUpdate(
      { 
        userId, 
        habitId, 
        date: new Date(date) 
      },
      { 
        $set: { completed } 
      },
      { 
        new: true,
        upsert: true 
      }
    );

    res.status(200).json({
      success: true,
      data: completion
    });
  } catch (error) {
    next(error);
  }
};

// Get all completions for a user
export const getUserCompletions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate } = req.query;

    const query = { userId };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const completions = await HabitCompletion.find(query);
    
    res.status(200).json({
      success: true,
      count: completions.length,
      data: completions
    });
  } catch (error) {
    next(error);
  }
};