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
    <div className="md:hidden bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => onChangeDate(subDays(date, 1))}
          className="h-9 w-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          ‹
        </button>

        <div className="text-center">
          <p className="text-xs font-medium text-slate-500">
            {format(date, "EEEE")}
          </p>
          <h2 className="text-lg font-semibold text-slate-900 leading-tight">
            {format(date, "d MMM yyyy")}
          </h2>

          {isToday(date) && (
            <span className="inline-block mt-0.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Today
            </span>
          )}
        </div>

        <button
          onClick={() => onChangeDate(addDays(date, 1))}
          className="h-9 w-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          ›
        </button>
      </div>

      {/* Habits */}
      <div className="space-y-2">
        {habits
          .filter(habit => {
            const hStart = habit.startDate ? new Date(habit.startDate) : null;
            const hEnd = habit.endDate ? new Date(habit.endDate) : null;
            const compareDay = new Date(date);
            compareDay.setHours(0, 0, 0, 0);

            const isActive =
              (!hStart || compareDay >= new Date(hStart).setHours(0, 0, 0, 0)) &&
              (!hEnd || compareDay <= new Date(hEnd).setHours(0, 0, 0, 0));

            return isActive;
          })
          .map((habit) => (
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
