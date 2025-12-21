import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
  format,
  isSameDay,
  parseISO,
  startOfMonth,
  endOfMonth,
  subMonths,
  addMonths,
} from "date-fns";
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import api, { toggleHabitCompletion, getHabitCompletions } from "../api/api";

import HabitGrid from "../components/HabitGrid";
import MobileDayView from "../components/MobileDayView";
import { calculatePremiumStats } from "../utils/analyticsHelper";
import OverviewCards from "../components/analytics/OverviewCards";
import AnalyticsTrends from "../components/analytics/AnalyticsTrends";
import AnalyticsHabits from "../components/analytics/AnalyticsHabits";
import AnalyticsInsights from "../components/analytics/AnalyticsInsights";
import HabitModal from "../components/modals/HabitModal";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const stats = calculatePremiumStats(habits, selectedDate);

  const handleHabitSubmit = async (habitData) => {
    if (editingHabit) {
      try {
        const response = await api.put(`/habits/${editingHabit._id}`, {
          name: habitData.name,
          startDate: habitData.startDate,
          endDate: habitData.endDate,
        });

        setHabits((prev) =>
          prev.map((h) =>
            h._id === editingHabit._id ? { ...h, ...response.data } : h
          )
        );

        setIsHabitModalOpen(false);
        setEditingHabit(null);
        toast.success("Habit updated successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update habit");
      }
    } else {
      if (!habitData?.name?.trim()) return;

      try {
        const response = await api.post("/habits", {
          name: habitData.name,
          description: "",
          category: "personal",
          frequency: [{ day: "monday", time: "09:00" }],
          target: 1,
          targetUnit: "times",
          tags: [],
          startDate: habitData.startDate,
          endDate: habitData.endDate,
        });

        setHabits((prev) => [...prev, { ...response.data, completions: [] }]);
        setIsHabitModalOpen(false);
        toast.success("Habit added successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to add habit");
      }
    }
  };

  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setIsHabitModalOpen(true);
  };

  const handleDeleteHabit = async (habitId) => {
    await api.delete(`/habits/${habitId}`);
    setHabits((prev) => prev.filter((h) => h._id !== habitId));
  };

  const fetchHabitsAndCompletions = useCallback(async () => {
    try {
      setIsLoading(true);

      const today = new Date();
      const fetchStart = subMonths(startOfMonth(selectedDate), 6);
      const fetchEnd = endOfMonth(today);

      const [habitsRes, completionsRes] = await Promise.all([
        api.get("/habits"),
        getHabitCompletions(fetchStart, fetchEnd),
      ]);

      const completionsMap = new Map();
      completionsRes.forEach((c) => {
        const id = c.habit?._id || c.habit;
        if (!completionsMap.has(id)) completionsMap.set(id, []);
        completionsMap.get(id).push(c);
      });

      setHabits(
        habitsRes.data.map((h) => ({
          ...h,
          completions: completionsMap.get(h._id) || [],
        }))
      );
    } catch {
      toast.error("Failed to load habits");
      setHabits([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  const formatDate = (date) => {
    if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const isHabitCompleted = (habitId, date) => {
    const habit = habits.find((h) => h._id === habitId);
    if (!habit) return false;
    const dateStr = formatDate(date);
    return habit.completions?.some(
      (c) => formatDate(c.date) === dateStr && c.completed
    );
  };

  const handleToggleHabit = async (habitId, date) => {
    const dateStr = formatDate(date);
    const previousHabits = [...habits];
    const wasCompleted = isHabitCompleted(habitId, date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const entryDate = new Date(date);
    entryDate.setHours(0, 0, 0, 0);

    try {
      // Optimistic update
      setHabits((prev) =>
        prev.map((h) => {
          if (h._id !== habitId) return h;
          
          // Create new completions array with the toggled status
          const newCompletions = [
            ...(h.completions || []).filter(c => formatDate(c.date) !== dateStr),
            {
              _id: `temp-${Date.now()}`,
              habit: habitId,
              date: dateStr,
              completed: !wasCompleted,
              isOptimistic: true,
            },
          ];
          
          // Filter for completed entries up to today and sort by date (newest first)
          const completedEntries = newCompletions
            .filter(c => {
              const entryDate = new Date(c.date);
              entryDate.setHours(0, 0, 0, 0);
              return c.completed && entryDate <= today;
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
          
          let newStreak = 0;
          let lastCompleted = null;
          
          if (completedEntries.length > 0) {
            // If we have completed entries, calculate the current streak
            let currentDate = new Date(completedEntries[0].date);
            currentDate.setHours(0, 0, 0, 0);
            lastCompleted = currentDate;
            
            // Start with a streak of 1 for the most recent completion
            newStreak = 1;
            
            // Check previous days to see if they were completed consecutively
            for (let i = 1; i < completedEntries.length; i++) {
              const prevDate = new Date(completedEntries[i].date);
              prevDate.setHours(0, 0, 0, 0);
              
              const dayDiff = Math.round((currentDate - prevDate) / (1000 * 60 * 60 * 24));
              
              if (dayDiff === 1) {
                // Consecutive day, increment streak
                newStreak++;
                currentDate = prevDate;
              } else if (dayDiff > 1) {
                // Gap found, stop checking
                break;
              }
              // If dayDiff === 0, it's a duplicate entry for the same day, skip it
            }
          }
          
          return {
            ...h,
            completions: newCompletions,
            currentStreak: newStreak,
            bestStreak: Math.max(h.bestStreak || 0, newStreak),
            lastCompleted: completedEntries[0]?.date || null
          };
        })
      );

      // Make the API call in the background
      toggleHabitCompletion(habitId, dateStr, !wasCompleted)
        .catch(error => {
          // If there's an error, revert to previous state
          setHabits(previousHabits);
          toast.error(
            error.response?.data?.message || "Failed to update habit status"
          );
        });
      
    } catch (error) {
      // This should only catch sync errors, not the API call errors
      console.error('Error in handleToggleHabit:', error);
      setHabits(previousHabits);
      toast.error("An unexpected error occurred");
    }
  };

  useEffect(() => {
    fetchHabitsAndCompletions();
  }, [fetchHabitsAndCompletions]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 animate-pulse">
        <div className="h-10 w-1/3 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hello, <span className="text-teal-600">{currentUser?.name?.split(' ')[0] || 'User'}</span>
            </h1>
            <p className="text-sm text-gray-500">
              Track your habits and build better routines
            </p>
          </div>

          <div className="flex flex-row items-center gap-3 w-full md:w-auto">
            {/* Mobile Navigation - Hidden on desktop as it's now in the grid */}
            <div className="flex md:hidden flex-1 items-center justify-between bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm">
              <button
                onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                title="Previous Month"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>

              <div className="text-center px-1">
                <span className="text-xs font-bold text-gray-900 block min-w-[80px]">
                  {format(selectedDate, "MMM yyyy")}
                </span>
              </div>

              <button
                onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                title="Next Month"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => {
                setEditingHabit(null);
                setIsHabitModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2.5 md:px-5 text-sm font-semibold rounded-xl text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all active:scale-95 whitespace-nowrap"
            >
              <PlusIcon className="w-5 h-5 md:mr-2" />
              <span className="hidden md:inline">Add Habit</span>
              <span className="md:hidden ml-1">Habit</span>
            </button>
          </div>
        </div>

        <OverviewCards stats={stats} />

        <div className="mb-8 hidden md:block">
          <HabitGrid
            habits={habits}
            currentDate={selectedDate}
            onToggleHabit={handleToggleHabit}
            isHabitCompleted={isHabitCompleted}
            onEditHabit={handleEditHabit}
            onDeleteHabit={handleDeleteHabit}
            onPrevMonth={() => setSelectedDate(subMonths(selectedDate, 1))}
            onNextMonth={() => setSelectedDate(addMonths(selectedDate, 1))}
          />
        </div>

        <div className="md:hidden mb-8">
          <MobileDayView
            habits={habits}
            date={selectedDate}
            onChangeDate={setSelectedDate}
            onToggleHabit={handleToggleHabit}
            onEditHabit={handleEditHabit}
            onDeleteHabit={handleDeleteHabit}
            isHabitCompleted={isHabitCompleted}
          />
        </div>

        <AnalyticsTrends habits={habits} stats={stats} selectedDate={selectedDate} />
        {/* <AnalyticsHabits rankings={stats.rankings} overview={stats.overview} /> */}
        <AnalyticsInsights stats={stats} habits={habits} />

        <HabitModal
          isOpen={isHabitModalOpen}
          onClose={() => {
            setIsHabitModalOpen(false);
            setEditingHabit(null);
          }}
          onSubmit={handleHabitSubmit}
          habit={editingHabit}
        />
      </div>
    </div>
  );
};

export default Dashboard;
