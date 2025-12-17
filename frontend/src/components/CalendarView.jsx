import { useState } from "react";
import {
  format,
  isToday,
  isSameMonth,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import HabitItem from "./HabitItem";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarView = ({ 
  habits, 
  onToggleHabit, 
  isHabitCompleted, 
  onEditHabit, 
  onDeleteHabit 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDay = monthStart.getDay();
  const endDay = monthEnd.getDay();

  const paddedDays = [
    ...Array(startDay).fill(null),
    ...days,
    ...Array(6 - endDay).fill(null),
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-900">
          {format(currentMonth, "MMMM yyyy")}
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600"
          >
            ‹
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600"
          >
            ›
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {paddedDays.map((day, index) => {
          const isCurrentMonthDay = day && isSameMonth(day, currentMonth);
          const today = day && isToday(day);

          return (
            <div
              key={index}
              className={`relative rounded-xl border p-2 flex flex-col
                ${!isCurrentMonthDay ? "bg-gray-50 border-transparent" : "bg-white border-gray-200"}
                ${today ? "ring-2 ring-indigo-500 border-indigo-500" : ""}
              `}
            >
              {/* Date */}
              <div className="flex justify-end mb-1">
                {day && (
                  <span
                    className={`text-xs font-semibold h-6 w-6 flex items-center justify-center rounded-full
                      ${today ? "bg-indigo-600 text-white" : "text-gray-700"}
                    `}
                  >
                    {format(day, "d")}
                  </span>
                )}
              </div>

              {/* Habits */}
              {day && (
                <div className="flex-1 space-y-1 overflow-y-auto scrollbar-thin">
                  {habits.length === 0 && day && isSameMonth(day, currentMonth) ? (
                    <div className="text-center p-1">
                      <p className="text-xs text-gray-600 font-medium block sm:hidden">
                        + Add habits
                      </p>
                    </div>
                  ) : (
                    habits.map((habit) => (
                      <HabitItem
                        key={habit._id}
                        habit={habit}
                        date={day}
                        completed={isHabitCompleted(habit._id, day)}
                        onToggleHabit={onToggleHabit}
                        onEditHabit={onEditHabit}
                        onDeleteHabit={onDeleteHabit}
                        isMobile={false}
                        compact={true}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
