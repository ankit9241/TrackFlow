import { twMerge as cn } from 'tailwind-merge';

const StatsCard = ({ title, value, icon: Icon, trend, trendText, color = 'indigo', compact = false }) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-100',
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-100',
    },
    yellow: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-100',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-100',
    },
    slate: {
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      border: 'border-slate-100',
    },
  };

  const colors = colorMap[color] || colorMap.indigo;

  if (compact) {
    return (
      <div className={cn("rounded-lg border p-3 sm:p-4", colors.border, colors.bg)}>
        <div className="flex items-center">
          <div className={cn("p-2 rounded-md mr-3", colors.text, colors.bg.replace('50', '100'))}>
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-slate-500">{title}</p>
            <p className="text-base sm:text-xl font-semibold text-slate-900">{value}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border p-4 sm:p-5", colors.border, colors.bg)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-xl sm:text-2xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className={cn("p-2 sm:p-3 rounded-lg", colors.text, colors.bg.replace('50', '100'))}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-2 flex items-center text-xs sm:text-sm">
          <span className={cn('font-medium', trend >= 0 ? 'text-emerald-600' : 'text-amber-600')}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span className="text-slate-500 ml-1">{trendText}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
