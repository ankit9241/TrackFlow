import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isSameMonth
} from 'date-fns';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/10 text-white">
        <p className="text-sm font-semibold mb-1 text-slate-300">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            {payload[0].value}
          </span>
          <span className="text-sm font-medium text-slate-400">
            {payload[0].name === 'percentage' ? '%' : 'habits'}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const WeeklyTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md p-3 rounded-xl shadow-xl border border-white/10 text-white text-xs">
        <p className="font-semibold mb-1 text-slate-300">
          {payload[0].payload.fullLabel}
        </p>
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-400">Completions</span>
          <span className="font-black text-emerald-400 text-lg">
            {payload[0].value}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const AnalyticsTrends = ({ habits, stats, selectedDate }) => {
  const activityData = useMemo(() => {
    const data = [];
    const today = new Date();
    const isCurrentMonth = isSameMonth(selectedDate, today);
    const start = startOfMonth(selectedDate);
    const end = isCurrentMonth ? today : endOfMonth(selectedDate);
    const days = eachDayOfInterval({ start, end });

    days.forEach(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      let completedCount = 0;
      let totalHabitsActive = 0;

      habits.forEach(habit => {
        const hStart = habit.startDate ? new Date(habit.startDate) : null;
        const hEnd = habit.endDate ? new Date(habit.endDate) : null;
        const compareDay = new Date(date);
        compareDay.setHours(0, 0, 0, 0);

        const isActive =
          (!hStart || compareDay >= new Date(hStart).setHours(0, 0, 0, 0)) &&
          (!hEnd || compareDay <= new Date(hEnd).setHours(0, 0, 0, 0));

        if (isActive) {
          totalHabitsActive++;
          const isCompleted = habit.completions?.some(c => {
            const cDate =
              typeof c.date === 'string'
                ? c.date
                : format(new Date(c.date), 'yyyy-MM-dd');
            return cDate === dateStr && c.completed;
          });
          if (isCompleted) completedCount++;
        }
      });

      const percentage =
        totalHabitsActive > 0
          ? Math.round((completedCount / totalHabitsActive) * 100)
          : 0;

      data.push({
        date: format(date, 'MMM d'),
        percentage
      });
    });

    return data;
  }, [habits, selectedDate]);

  const weeklyData = useMemo(() => {
    const data = [];
    const today = new Date();
    const isCurrentMonth = isSameMonth(selectedDate, today);
    const referenceDate = isCurrentMonth ? today : endOfMonth(selectedDate);
    const currentWeekStart = startOfWeek(referenceDate, { weekStartsOn: 1 });

    for (let i = 4; i >= 0; i--) {
      const weekStart = subDays(currentWeekStart, i * 7);
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

      let count = 0;
      habits.forEach(habit => {
        habit.completions?.forEach(c => {
          const cDate = new Date(c.date);
          if (c.completed && cDate >= weekStart && cDate <= weekEnd) {
            count++;
          }
        });
      });

      data.push({
        label: format(weekStart, 'MMM d'),
        fullLabel: `${format(weekStart, 'MMM d')} - ${format(
          weekEnd,
          'MMM d'
        )}`,
        count
      });
    }

    return data;
  }, [habits]);

  return (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-[0_6px_30px_rgba(0,0,0,0.04)] border border-slate-100">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                30-Day Momentum
              </h3>
              <p className="text-sm text-slate-500">
                Daily completion trend
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase tracking-widest">
                Velocity
              </p>
              <p className="text-lg font-black text-emerald-600">
                {stats.insights.averageCompletionsPerDay} / day
              </p>
            </div>
          </div>

          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, left: -20 }}>
                <defs>
                  <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="trendStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={30}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke="url(#trendStroke)"
                  strokeWidth={2}
                  fill="url(#trendFill)"
                  activeDot={{
                    r: 4,
                    fill: '#10b981',
                    stroke: '#fff',
                    strokeWidth: 2
                  }}
                  animationDuration={1400}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-[0_6px_30px_rgba(0,0,0,0.04)] border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-4">
              Weekly Output
            </h3>
            <div className="h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Bar dataKey="count" radius={[6, 6, 6, 6]}>
                    {weeklyData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={
                          index === weeklyData.length - 1
                            ? '#10b981'
                            : '#d1fae5'
                        }
                      />
                    ))}
                  </Bar>
                  <Tooltip content={<WeeklyTooltip />} cursor={{ fill: 'transparent' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <p className="text-xs font-black text-emerald-600 uppercase mb-1">
                Best Day
              </p>
              <p className="text-lg font-black text-slate-800">
                {stats.trends.bestDay}
              </p>
            </div>
            <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
              <p className="text-xs font-black text-rose-600 uppercase mb-1">
                Worst Day
              </p>
              <p className="text-lg font-black text-slate-800">
                {stats.trends.worstDay}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTrends;
