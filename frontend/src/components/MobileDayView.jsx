import { format, addDays, subDays, isToday } from "date-fns";
import HabitItem from "./HabitItem";

const MobileDayView = ({
  date,
  habits,
  onToggleHabit,
  isHabitCompleted,
  onChangeDate,
  onEditHabit,
  onDeleteHabit,
}) => {

  return (
    <div className="md:hidden bg-white rounded-2xl shadow-sm border p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onChangeDate(subDays(date, 1))}
          className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center"
        >
          ‹
        </button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            {format(date, "EEEE")}
          </p>
          <h2 className="text-lg font-semibold text-gray-900">
            {format(date, "d MMM yyyy")}
          </h2>
          {isToday(date) && (
            <span className="text-xs text-indigo-600 font-medium">
              Today
            </span>
          )}
        </div>

        <button
          onClick={() => onChangeDate(addDays(date, 1))}
          className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center"
        >
          ›
        </button>
      </div>

      {/* Habits */}
      <div className="space-y-2">
        {habits.map((habit) => (
          <HabitItem
            key={habit._id}
            habit={habit}
            date={date}
            completed={isHabitCompleted(habit._id, date)}
            onToggleHabit={onToggleHabit}
            onEditHabit={onEditHabit}
            onDeleteHabit={onDeleteHabit}
            isMobile={true}
          />
        ))}
      </div>

    </div>
  );
};

export default MobileDayView;
