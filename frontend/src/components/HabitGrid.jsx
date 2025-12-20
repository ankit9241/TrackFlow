import { startOfMonth, endOfMonth, eachDayOfInterval, format, getWeek, isSameDay } from 'date-fns';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/20/solid';

const HabitGrid = ({
  habits,
  currentDate,
  onToggleHabit,
  isHabitCompleted,
  onEditHabit,
  onDeleteHabit,
  onPrevMonth,
  onNextMonth
}) => {
  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);
  const today = new Date();

  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

  const weeks = daysInMonth.reduce((acc, day) => {
    const weekNum = getWeek(day, { weekStartsOn: 1 });
    if (!acc[weekNum]) acc[weekNum] = [];
    acc[weekNum].push(day);
    return acc;
  }, {});

  const weekKeys = Object.keys(weeks).sort((a, b) => a - b);

  return (
    <div className="overflow-hidden bg-white rounded-2xl shadow-lg border border-slate-100 ring-1 ring-black/5">
      <div className="overflow-x-auto max-w-full">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/60">
              <th className="sticky left-0 z-30 bg-white/95 backdrop-blur-sm p-4 text-left border-b border-slate-100 min-w-[220px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-slate-900">
                    {format(currentDate, 'MMMM yyyy')}
                  </span>
                  <div className="hidden md:flex items-center gap-1">
                    <button
                      onClick={onPrevMonth}
                      className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-500"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={onNextMonth}
                      className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-500"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </th>
              <th
                colSpan={daysInMonth.length}
                className="p-2 border-b border-slate-100 text-center text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-50/40"
              >
                Monthly Progress
              </th>
            </tr>

            <tr>
              <th className="sticky left-0 z-30 bg-white/95 backdrop-blur-sm p-3 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                Week
              </th>
              {weekKeys.map((weekNum, index) => (
                <th
                  key={weekNum}
                  colSpan={weeks[weekNum].length}
                  className={`p-1 border-b border-slate-100 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/40 ${index !== weekKeys.length - 1 ? 'border-r border-slate-100' : ''
                    }`}
                >
                  Week {index + 1}
                </th>
              ))}
            </tr>

            <tr>
              <th className="sticky left-0 z-30 bg-white/95 backdrop-blur-sm p-3 border-b border-slate-100 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                Habits
              </th>
              {daysInMonth.map((day) => {
                const isToday = isSameDay(day, today);
                return (
                  <th
                    key={day.toString()}
                    className={`p-2 border-b border-slate-100 text-center min-w-[40px] ${isToday ? 'bg-emerald-50/50' : 'bg-white'
                      }`}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span
                        className={`text-[10px] font-medium uppercase tracking-wide ${isToday ? 'text-emerald-600' : 'text-slate-400'
                          }`}
                      >
                        {format(day, 'EEE')}
                      </span>
                      <span
                        className={`h-6 w-6 flex items-center justify-center rounded-full text-xs font-bold ${isToday
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'text-slate-700'
                          }`}
                      >
                        {format(day, 'd')}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="bg-white">
            {habits.map((habit) => (
              <tr
                key={habit._id}
                className="group hover:bg-slate-50/60 transition-colors"
              >
                <td className="sticky left-0 z-20 bg-white group-hover:bg-slate-50/80 p-3 border-r border-slate-100 text-[13px] font-medium text-slate-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-1 h-8 rounded-full bg-slate-200 group-hover:bg-emerald-500 transition" />
                      <span className="truncate">{habit.name}</span>
                    </div>

                    <Menu as="div" className="relative flex-shrink-0">
                      <MenuButton className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                        <EllipsisVerticalIcon className="w-5 h-5" />
                      </MenuButton>
                      <MenuItems
                        transition
                        anchor="bottom end"
                        className="z-50 w-40 origin-top-right rounded-xl bg-white p-1 shadow-xl ring-1 ring-black/5"
                      >
                        <MenuItem>
                          <button
                            onClick={() => onEditHabit(habit)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                            Edit
                          </button>
                        </MenuItem>
                        <div className="my-1 h-px bg-slate-100" />
                        <MenuItem>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${habit.name}"?`)) {
                                onDeleteHabit(habit._id);
                              }
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <TrashIcon className="w-4 h-4" />
                            Delete
                          </button>
                        </MenuItem>
                      </MenuItems>
                    </Menu>
                  </div>
                </td>

                {daysInMonth.map((day) => {
                  const isCompleted = isHabitCompleted(habit._id, day);
                  const isToday = isSameDay(day, today);

                  const hStart = habit.startDate ? new Date(habit.startDate) : null;
                  const hEnd = habit.endDate ? new Date(habit.endDate) : null;
                  const compareDay = new Date(day);
                  compareDay.setHours(0, 0, 0, 0);

                  const isActive =
                    (!hStart || compareDay >= new Date(hStart).setHours(0, 0, 0, 0)) &&
                    (!hEnd || compareDay <= new Date(hEnd).setHours(0, 0, 0, 0));

                  if (!isActive) {
                    return (
                      <td key={day.toString()} className="p-1.5 border-b border-slate-50 bg-slate-50/20" />
                    );
                  }

                  return (
                    <td
                      key={day.toString()}
                      className={`p-1.5 border-b border-slate-50 text-center cursor-pointer ${isToday ? 'bg-emerald-50/30' : ''
                        }`}
                      onClick={() => onToggleHabit(habit._id, day)}
                    >
                      <div className="flex items-center justify-center">
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center transition-all shadow-sm ${isCompleted
                              ? 'bg-emerald-500 text-white shadow-emerald-100'
                              : 'bg-white border border-slate-200 hover:border-emerald-300 hover:bg-slate-50 scale-90 hover:scale-100'
                            }`}
                        >
                          {isCompleted && (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {habits.length === 0 && (
        <div className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
            <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-900">No habits yet</h3>
          <p className="mt-1 text-slate-500">Get started by creating your first habit!</p>
        </div>
      )}
    </div>
  );
};

export default HabitGrid;
