import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(habit.name);

  const handleSaveEdit = async () => {
    if (!newName.trim()) {
      toast.error('Habit name cannot be empty');
      return;
    }
    try {
      await onEditHabit(habit._id, newName);
      setEditing(false);
      toast.success('Habit updated');
    } catch (error) {
      toast.error('Failed to update habit');
    }
  };

  const handleDelete = async () => {
    try {
      await onDeleteHabit(habit._id);
      setShowDeleteConfirm(false);
      toast.success('Habit deleted');
    } catch (error) {
      toast.error('Failed to delete habit');
    }
  };

  if (editing) {
    if (compact) {
      return (
        <div className="flex items-center w-full p-1">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 text-xs px-2 py-1 border rounded mr-1"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
          />
          <button
            onClick={handleSaveEdit}
            className="text-xs px-2 py-1 bg-blue-500 text-white rounded mr-1"
          >
            ✓
          </button>
          <button
            onClick={() => setEditing(false)}
            className="text-xs px-2 py-1 border rounded"
          >
            ×
          </button>
        </div>
      );
    }
    
    return (
      <div className="flex items-center p-2 bg-white rounded-lg">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg mr-2"
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
        />
        <button
          onClick={handleSaveEdit}
          className="px-3 py-1 bg-blue-500 text-white rounded-lg mr-2"
        >
          Save
        </button>
        <button
          onClick={() => setEditing(false)}
          className="px-3 py-1 border rounded-lg"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="group relative flex items-center w-full">
        <div 
          onClick={() => onToggleHabit(habit._id, date)}
          className={`flex-1 flex items-center gap-2 px-2 py-1 rounded-md text-left text-xs cursor-pointer ${
            completed
              ? 'bg-emerald-50 text-emerald-700'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <div
            className={`h-3.5 w-3.5 rounded border flex-shrink-0 flex items-center justify-center ${
              completed
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : 'border-gray-300'
            }`}
          >
            {completed && '✓'}
          </div>
          <span className="truncate flex-1">{habit.name}</span>
          
          {/* Desktop actions for compact view */}
          {!isMobile && (
            <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setEditing(true);
                }}
                className="text-gray-400 hover:text-blue-500 cursor-pointer p-1"
                title="Edit habit"
              >
                ✏️
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                className="text-gray-400 hover:text-red-500 cursor-pointer p-1"
                title="Delete habit"
              >
                🗑️
              </div>
            </div>
          )}
        </div>
        
        {/* Mobile menu for compact view */}
        {isMobile && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <EllipsisHorizontalIcon className="h-4 w-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditing(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                >
                  Edit Habit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-gray-100"
                >
                  Delete Habit
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Regular (non-compact) view
  return (
    <div className="group relative flex items-center">
      <button
        onClick={() => onToggleHabit(habit._id, date)}
        className={`flex-1 flex items-center justify-between p-3 rounded-xl border ${
          completed
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-white border-gray-200'
        }`}
      >
        <span className="text-sm font-medium truncate pr-2">
          {habit.name}
        </span>
        <span
          className={`h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full border ${
            completed
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-gray-300 text-gray-400'
          }`}
        >
          ✓
        </span>
      </button>

      {/* Desktop Actions */}
      {!isMobile && (
        <div className="hidden md:flex items-center ml-2 space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditing(true);
            }}
            className="p-1 text-gray-500 hover:text-blue-600"
            title="Edit habit"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
            className="p-1 text-gray-500 hover:text-red-600"
            title="Delete habit"
          >
            🗑️
          </button>
        </div>
      )}

      {/* Mobile Menu Button */}
      {isMobile && (
        <div className="relative ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </button>

          {/* Mobile Menu Dropdown */}
          {showMenu && (
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditing(true);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit Habit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Delete Habit
              </button>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className={`absolute ${
          compact ? 'right-0 top-8' : 'right-0 top-full mt-1'
        } bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-20`}>
          <p className="text-sm text-gray-700 mb-3">Delete this habit?</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(false);
              }}
              className="text-xs px-3 py-1 rounded border border-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="text-xs px-3 py-1 rounded bg-red-500 text-white"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitItem;
