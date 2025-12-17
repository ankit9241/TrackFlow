const HabitProgress = ({ name, progress, currentStreak }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-900">{name}</span>
        <span className="text-gray-600">{progress}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {currentStreak > 0 && (
        <div className="mt-1 flex items-center">
          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            🔥 {currentStreak} day{currentStreak !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
};

export default HabitProgress;