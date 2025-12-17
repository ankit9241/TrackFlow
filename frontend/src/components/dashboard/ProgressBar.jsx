const ProgressBar = ({ value, max = 100, color = 'indigo', showLabel = true, className = '' }) => {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);
  
  const colorMap = {
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-slate-700">Progress</span>
        {showLabel && <span className="font-medium text-slate-900">{Math.round(percentage)}%</span>}
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className={`${colorMap[color] || colorMap.indigo} h-2 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
