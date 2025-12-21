import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon,
  FireIcon
} from '@heroicons/react/20/solid';

const HabitItem = ({
  habit,
  date,
  completed,
  onToggleHabit,
  onEditHabit,
  onDeleteHabit,
  isMobile = false,
  compact = false
}) => {

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${habit.name}"?`)) {
      onDeleteHabit(habit._id);
    }
  };

  // Format the date to match the backend format (YYYY-MM-DD)
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Check if the current date is today or in the future
  const isFutureDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) > today;
  };

  // Show streak if it's greater than 0
  // For mobile, we want to show the streak regardless of the date
  const shouldShowStreak = habit.currentStreak > 0;

  return (
    <div className="group relative flex items-center gap-2 w-full">
      <button
        onClick={async () => {
          await onToggleHabit(habit._id, date);
          // Force a refresh of the habits to update the streak
          // This will be handled by the parent component
        }}
        className={`flex-1 flex items-center justify-between p-3 rounded-xl border transition-all ${
          completed
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-white border-slate-200 hover:border-emerald-300'
        }`}
      >
        <div className="flex items-center min-w-0">
          <span className="text-sm font-medium text-slate-700 truncate">
            {habit.name}
          </span>
          {shouldShowStreak && (
            <div className="ml-2 flex items-center">
              <span className="text-xs font-medium text-amber-600">{habit.currentStreak}</span>
              <FireIcon className="w-4 h-4 ml-0.5 text-amber-500" />
            </div>
          )}
        </div>

        <span
          className={`h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full border text-xs font-bold transition-colors ${
            completed
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
              : 'border-slate-300 text-slate-400'
          }`}
        >
          ✓
        </span>
      </button>

      <Menu as="div" className="relative flex-shrink-0">
        <MenuButton className="p-2 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all active:scale-95">
          <EllipsisVerticalIcon className="w-5 h-5" />
        </MenuButton>

        <MenuItems
          transition
          className="absolute right-0 top-full mt-2 z-50 w-40 origin-top-right rounded-xl bg-white p-1 shadow-xl ring-1 ring-black/5 focus:outline-none transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <MenuItem>
            <button
              onClick={() => onEditHabit(habit)}
              className="group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
            >
              <PencilSquareIcon className="w-4 h-4" />
              Edit
            </button>
          </MenuItem>

          <div className="my-1 h-px bg-slate-100" />

          <MenuItem>
            <button
              onClick={handleDelete}
              className="group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
};

export default HabitItem;
