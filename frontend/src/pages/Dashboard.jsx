import { useState, useEffect, useCallback } from "react";
import {
  format,
  isSameDay,
  parseISO,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { PlusIcon } from "@heroicons/react/24/outline";
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
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const stats = calculatePremiumStats(habits);

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

      const [habitsRes, completionsRes] = await Promise.all([
        api.get("/habits"),
        getHabitCompletions(
          startOfMonth(selectedDate),
          endOfMonth(selectedDate)
        ),
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

    try {
      setHabits((prev) =>
        prev.map((h) =>
          h._id === habitId
            ? {
              ...h,
              completions: [
                ...(h.completions || []),
                {
                  _id: `temp-${Date.now()}`,
                  habit: habitId,
                  date: dateStr,
                  completed: !isHabitCompleted(habitId, dateStr),
                  isOptimistic: true,
                },
              ],
            }
            : h
        )
      );

      const res = await toggleHabitCompletion(
        habitId,
        dateStr,
        !isHabitCompleted(habitId, dateStr)
      );

      const entry = res.data.data?.entry || res.data.entry;

      setHabits((prev) =>
        prev.map((h) =>
          h._id === habitId
            ? {
              ...h,
              completions: [
                ...h.completions.filter(
                  (c) => formatDate(c.date) !== dateStr || c.isOptimistic
                ),
                { ...entry, date: formatDate(entry.date) },
              ],
            }
            : h
        )
      );
    } catch (error) {
      setHabits(previousHabits);
      toast.error(
        error.response?.data?.message || "Failed to update habit status"
      );
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Track<span className="text-teal-600">Flow</span></h1>
            <p className="text-sm text-gray-500">
              Track your habits and build better routines
            </p>
          </div>
          <button
            onClick={() => {
              setEditingHabit(null);
              setIsHabitModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-teal-700 hover:bg-teal-800"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Habit
          </button>
        </div>

        <OverviewCards stats={stats} />

        <div className="mb-8 hidden md:block">
          <HabitGrid
            habits={habits}
            currentDate={new Date()}
            onToggleHabit={handleToggleHabit}
            isHabitCompleted={isHabitCompleted}
            onEditHabit={handleEditHabit}
            onDeleteHabit={handleDeleteHabit}
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

        <AnalyticsTrends habits={habits} stats={stats} />
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
