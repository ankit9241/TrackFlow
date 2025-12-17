// At the top of Dashboard.jsx
import { useState, useEffect } from "react";
import {
  format,
  isSameDay,
  parseISO,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import {
  PlusIcon,
  CheckCircleIcon,
  TrophyIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { toggleHabitCompletion, getHabitCompletions } from "../api/api";
import StatsCard from "../components/dashboard/StatsCard";
import HabitProgress from "../components/HabitProgress";
import WeeklySummary from "../components/WeeklySummary";
import DonutChart from "../components/DonutChart";
import CalendarView from "../components/CalendarView";
import MobileDayView from "../components/MobileDayView";

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newHabitName, setNewHabitName] = useState("");
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch habits data
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        setIsLoading(true);
        const [habitsRes, completionsRes] = await Promise.all([
          api.get("/habits"),
          getHabitCompletions(
            startOfMonth(selectedDate),
            endOfMonth(selectedDate)
          ),
        ]);
        // Map completions to habits
        const habitsWithCompletions = habitsRes.data.map((habit) => ({
          ...habit,
          completions: completionsRes.data
            .filter((c) => c.habitId === habit._id && c.completed)
            .map((c) => ({ date: c.date.split("T")[0] })),
        }));
        setHabits(habitsWithCompletions);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load habits");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHabits();
  }, [selectedDate]);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    try {
      const response = await api.post("/habits", {
        name: newHabitName,
        description: "",
        category: "personal",
        frequency: [
          {
            day: "monday", // Default day
            time: "09:00", // Default time
          },
        ],
        target: 1,
        targetUnit: "times",
        tags: [],
      });

      setHabits((prev) => [...prev, { ...response.data, completions: [] }]);
      setNewHabitName("");
      setIsAddingHabit(false);
      toast.success("Habit added successfully");
    } catch (error) {
      console.error("Error adding habit:", error);
      toast.error(error.response?.data?.message || "Failed to add habit");
    }
  };

  const handleEditHabit = async (habitId, newName) => {
    try {
      await api.put(`/habits/${habitId}`, { name: newName });

      // Update local state
      setHabits((prevHabits) =>
        prevHabits.map((habit) =>
          habit._id === habitId ? { ...habit, name: newName } : habit
        )
      );
    } catch (error) {
      console.error("Error updating habit:", error);
      throw error;
    }
  };

  const handleDeleteHabit = async (habitId) => {
    try {
      await api.delete(`/habits/${habitId}`);

      // Update local state
      setHabits((prevHabits) =>
        prevHabits.filter((habit) => habit._id !== habitId)
      );
    } catch (error) {
      console.error("Error deleting habit:", error);
      throw error;
    }
  };

  const handleToggleHabit = async (habitId, date) => {
    try {
      const isCompleted = isHabitCompleted(habitId, date);
      await toggleHabitCompletion(habitId, date, !isCompleted);

      // Update local state
      setHabits((prevHabits) =>
        prevHabits.map((habit) =>
          habit._id === habitId
            ? {
                ...habit,
                completions: isCompleted
                  ? (habit.completions || []).filter(
                      (c) => c.date !== date.toISOString().split("T")[0]
                    )
                  : [
                      ...(habit.completions || []),
                      { date: date.toISOString().split("T")[0] },
                    ],
              }
            : habit
        )
      );
    } catch (error) {
      console.error("Error toggling habit:", error);
      toast.error("Failed to update habit completion");
    }
  };

  const isHabitCompleted = (habitId, date) => {
    const habit = habits.find((h) => h._id === habitId);
    if (!habit || !habit.completions) return false;

    const dateString = date.toISOString().split("T")[0];
    return habit.completions.some((c) => c.date === dateString);
  };

  const getCompletionPercentage = (habit) => {
    if (!habit.completions || !habit.completions.length) return 0;
    const completed = habit.completions.filter((c) => c.completed).length;
    return Math.round((completed / habit.completions.length) * 100);
  };

  const calculateAnalytics = () => {
    const totalHabits = habits.length;
    const completedHabits = habits.filter((habit) => {
      return habit.completions?.some(
        (c) => c.completed && isSameDay(parseISO(c.date), new Date())
      );
    }).length;

    const totalCompletions = habits.reduce((sum, habit) => {
      return sum + (habit.completions?.filter((c) => c.completed).length || 0);
    }, 0);

    const averageCompletion =
      totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

    return {
      totalHabits,
      completedHabits,
      totalCompletions,
      averageCompletion,
    };
  };

  const analytics = calculateAnalytics();

  // Get top performing habits (sorted by completion rate)
  const getTopHabits = (count = 3) => {
    return [...habits]
      .sort((a, b) => (b.completionRate || 0) - (a.completionRate || 0))
      .slice(0, count);
  };

  // Get habits that need attention (lowest completion rate)
  const getHabitsNeedingAttention = (count = 3) => {
    return [...habits]
      .sort((a, b) => (a.completionRate || 0) - (b.completionRate || 0))
      .slice(0, count);
  };

  // Get streak information for a habit
  const getStreakInfo = (habit) => {
    const currentStreak = habit.currentStreak || 0;
    let streakMessage = "";

    if (currentStreak === 0) {
      streakMessage = "No active streak";
    } else if (currentStreak === 1) {
      streakMessage = "1 day";
    } else {
      streakMessage = `${currentStreak} days`;
    }

    return {
      currentStreak,
      message: streakMessage,
      isHotStreak: currentStreak >= 7,
      isPerfectMonth: habit.completionRate === 100,
    };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-white rounded-lg shadow"></div>
              ))}
            </div>
            <div className="h-64 bg-white rounded-lg shadow"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Habit Tracker
            </h1>
            <p className="text-sm text-gray-500">
              Track your habits and build better routines
            </p>
          </div>
          <button
            onClick={() => setIsAddingHabit(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Habit
          </button>
        </div>

        {/* Stats Overview - Compact on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
          <StatsCard
            title="Total"
            value={analytics.totalHabits}
            icon={CheckCircleIcon}
            color="indigo"
            compact
          />
          <StatsCard
            title="Today"
            value={`${analytics.completedHabits}/${analytics.totalHabits}`}
            icon={ChartBarIcon}
            color="green"
            compact
          />
          <StatsCard
            title="Completed"
            value={analytics.totalCompletions}
            icon={TrophyIcon}
            color="yellow"
            compact
          />
          <StatsCard
            title="Rate"
            value={`${analytics.averageCompletion}%`}
            icon={ArrowTrendingUpIcon}
            color="purple"
            compact
          />
        </div>

        {/* Mobile Day View - Only visible on mobile */}
        <div className="md:hidden mb-6">
          <MobileDayView
            date={selectedDate}
            habits={habits}
            onToggleHabit={handleToggleHabit}
            onEditHabit={handleEditHabit}
            onDeleteHabit={handleDeleteHabit}
            isHabitCompleted={isHabitCompleted}
            onChangeDate={setSelectedDate}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Calendar View - Hidden on mobile, visible on md and up */}
          <div className="hidden md:block lg:col-span-2 bg-white p-6 rounded-lg shadow">
            <CalendarView
              habits={habits}
              onToggleHabit={handleToggleHabit}
              isHabitCompleted={isHabitCompleted}
            />
          </div>

          {/* Weekly Summary */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Weekly Summary
            </h3>
            <WeeklySummary
              habits={habits}
              isHabitCompleted={isHabitCompleted}
            />

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">
              Habit Progress
            </h3>
            <div className="space-y-4">
              {habits.map((habit) => (
                <HabitProgress
                  key={habit._id}
                  name={habit.name}
                  progress={getCompletionPercentage(habit)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Donut Chart */}
        {habits.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Habit Distribution
            </h3>
            <div className="h-64">
              <DonutChart
                data={habits.map((habit) => ({
                  name: habit.name,
                  value: getCompletionPercentage(habit),
                  color: `hsl(${Math.random() * 360}, 70%, 50%)`,
                }))}
              />
            </div>
          </div>
        )}

        {/* Add Habit Form */}
        {isAddingHabit && (
          <div className="mb-6 p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Create New Habit
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="e.g., Drink 8 glasses of water"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onKeyDown={(e) => e.key === "Enter" && handleAddHabit(e)}
                  autoFocus
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddHabit}
                  className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Habit
                </button>
                <button
                  onClick={() => {
                    setIsAddingHabit(false);
                    setNewHabitName("");
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
