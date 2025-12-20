import HabitEntry from "../models/HabitEntry.js";
import Habit from "../models/Habit.js";
import { ErrorResponse } from "../utils/errorResponse.js";

const parseDateString = (dateStr) => {
  if (dateStr instanceof Date) {
    const d = new Date(dateStr);
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  }

  if (typeof dateStr === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }

  const d = new Date(dateStr);
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
};

// Toggle habit completion status
export const toggleHabitCompletion = async (req, res, next) => {
  try {
    const { habitId, date, completed = true } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!habitId || !date) {
      return next(new ErrorResponse("Habit ID and date are required", 400));
    }

    // Check if habit exists
    const habit = await Habit.findById(habitId);
    if (!habit) {
      return next(new ErrorResponse("Habit not found", 404));
    }

    // Check if user owns the habit
    if (habit.userId.toString() !== userId.toString()) {
      return next(
        new ErrorResponse("Not authorized to update this habit", 401)
      );
    }

    const targetDate = parseDateString(date);
    const formattedDate = `${targetDate.getFullYear()}-${String(
      targetDate.getMonth() + 1
    ).padStart(2, "0")}-${String(targetDate.getDate()).padStart(2, "0")}`;

    // Find or create the habit entry
    let entry = await HabitEntry.findOneAndUpdate(
      {
        user: userId,
        habit: habitId,
        date: targetDate,
      },
      {
        $set: {
          completed,
          updatedAt: new Date(),
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    // Update the habit's streak and stats
    await habit.updateStreak(completed);

    // Get the updated habit with current stats
    const updatedHabit = await Habit.findById(habitId);

    res.status(200).json({
      success: true,
      data: {
        entry: {
          ...entry.toObject(),
          date: formattedDate,
        },
        habit: {
          id: updatedHabit._id,
          name: updatedHabit.name,
          currentStreak: updatedHabit.currentStreak,
          bestStreak: updatedHabit.bestStreak,
          lastCompleted: updatedHabit.lastCompleted,
          completionRate: updatedHabit.completionRate,
        },
      },
    });
  } catch (error) {
    console.error("Error toggling habit completion:", error);
    next(error);
  }
};

// Get all completions for a user
export const getUserCompletions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate, habitId } = req.query;

    // Build the query
    const query = { user: userId };

    // Parse dates if provided
    if (startDate && endDate) {
      const start = parseDateString(startDate);
      const end = parseDateString(endDate);
      end.setHours(23, 59, 59, 999); // End of day

      query.date = {
        $gte: start,
        $lte: end,
      };
    }

    // Filter by habit if provided
    if (habitId) {
      query.habit = habitId;
    }

    // Execute query with sorting and population
    let completions = await HabitEntry.find(query)
      .sort({ date: 1 })
      .populate("habit", "name");

    // Format dates in the response
    completions = completions.map((entry) => {
      const entryObj = entry.toObject();
      if (entryObj.date) {
        entryObj.date = entryObj.date.toISOString().split("T")[0];
      }
      return entryObj;
    });

    res.status(200).json({
      success: true,
      count: completions.length,
      data: completions,
    });
  } catch (error) {
    console.error("Error fetching habit completions:", error);
    next(new ErrorResponse("Failed to fetch habit completions", 500));
  }
};
