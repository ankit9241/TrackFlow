const StatsCard = ({ title, value, icon: Icon, trend, trendText, color = "indigo" }) => {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-50 text-slate-700",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${colors[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {trend && (
          <div className="mt-2 flex items-center text-sm">
            <span
              className={`font-medium ${
                trend > 0 ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </span>
            <span className="text-gray-500 ml-1">{trendText}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;