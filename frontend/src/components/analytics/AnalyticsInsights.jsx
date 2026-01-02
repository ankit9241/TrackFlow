import React from 'react';
import {
    eachDayOfInterval,
    subWeeks,
    subMonths,
    format,
    startOfWeek,
    startOfMonth,
    isSameMonth,
    addDays
} from 'date-fns';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const AnalyticsInsights = ({ stats, habits }) => {
    const today = new Date();
    const startDate = startOfMonth(subMonths(today, 5)); // Show last 6 months including current
    const dates = eachDayOfInterval({ start: startDate, end: today });

    const activeDaysCount = stats.heatmap.filter(d => d.count > 0).length;
    const perfectDaysCount = stats.heatmap.filter(d => d.count >= (habits.length || 1)).length;
    const totalPossibleDays = dates.length;
    const activePercentage = Math.round((activeDaysCount / totalPossibleDays) * 100);

    const getColor = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayData = stats.heatmap.find(d => d.date === dateStr);
        if (!dayData) return 'bg-slate-100 hover:bg-slate-200';

        // If we have data for this day, use the intensity from the data
        if (dayData.intensity) {
            switch (dayData.intensity) {
                case 1: return 'bg-emerald-200';
                case 2: return 'bg-emerald-300';
                case 3: return 'bg-teal-400';
                case 4: return 'bg-teal-500';
                default: return 'bg-slate-100';
            }
        }
        
        // For backward compatibility, calculate intensity if not provided
        const activeHabitsCount = habits.length || 1;
        const count = dayData.count || 0;
        const intensity = count >= activeHabitsCount ? 4 : 
                         count >= activeHabitsCount * 0.75 ? 3 : 
                         count >= activeHabitsCount * 0.5 ? 2 : 
                         count > 0 ? 1 : 0;
                         
        switch (intensity) {
            case 1: return 'bg-emerald-200';
            case 2: return 'bg-emerald-300';
            case 3: return 'bg-teal-400';
            case 4: return 'bg-teal-500';
            default: return 'bg-slate-100';
        }
    };

    const getTooltipData = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayData = stats.heatmap.find(d => d.date === dateStr);
        return {
            count: dayData ? dayData.count : 0,
            dateLabel: format(date, 'MMM do, yyyy')
        };
    };

    const weeks = [];
    let currentWeekStart = startDate;
    while (currentWeekStart <= today) {
        weeks.push(currentWeekStart);
        currentWeekStart = addDays(currentWeekStart, 7);
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-12 mb-12">
            {/* Heatmap */}
            <div className="lg:col-span-2 bg-white p-10 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-bold text-slate-800">Consistency Map</h3>
                    <div className="flex items-center text-xs text-slate-400 gap-2">
                        <span>Less</span>
                        <div className="w-4 h-4 bg-slate-100 rounded-[2px]" />
                        <div className="w-4 h-4 bg-emerald-200 rounded-[2px]" />
                        <div className="w-4 h-4 bg-teal-400 rounded-[2px]" />
                        <div className="w-4 h-4 bg-teal-500 rounded-[2px]" />
                        <span>More</span>
                    </div>
                </div>

                <div className="flex gap-3 text-xs text-slate-400 overflow-x-auto pb-6 flex-grow">
                    <div className="flex flex-col gap-1.5 mt-[26px] pr-2 font-medium bg-white sticky left-0 z-10">
                        <span className="h-[18px]" />
                        <span className="h-[18px]">Mon</span>
                        <span className="h-[18px]" />
                        <span className="h-[18px]">Wed</span>
                        <span className="h-[18px]" />
                        <span className="h-[18px]">Fri</span>
                        <span className="h-[18px]" />
                    </div>

                    <div className="flex flex-col">
                        <div className="flex mb-2 h-4 relative">
                            {weeks.map((weekStart, idx) => {
                                const showLabel = idx === 0 || !isSameMonth(weekStart, subWeeks(weekStart, 1));
                                return (
                                    <div key={idx} className="w-[18px] mr-1.5 relative">
                                        {showLabel && (
                                            <span className="absolute top-0 left-0 text-[11px] font-bold text-slate-500 uppercase">
                                                {format(weekStart, 'MMM')}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="grid grid-rows-7 grid-flow-col gap-1.5">
                            {dates.map((date) => {
                                const { count, dateLabel } = getTooltipData(date);
                                const isFuture = date > today;
                                const isCurrentMonth = date.getMonth() === today.getMonth() && 
                                                    date.getFullYear() === today.getFullYear();
                                
                                return (
                                    <div key={date.toString()} className="relative group">
                                        <div
                                            className={`w-[18px] h-[18px] rounded-[3px] ${
                                                isFuture 
                                                    ? 'bg-slate-50 border border-dashed border-slate-200' 
                                                    : getColor(date)
                                            } ${
                                                !isFuture && !isCurrentMonth 
                                                    ? 'opacity-70' 
                                                    : ''
                                            } hover:ring-2 hover:ring-emerald-300 hover:ring-offset-2`}
                                            title={isFuture ? 'Future date' : dateLabel}
                                        />
                                        {!isFuture && (
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                                                <div className="bg-white border border-slate-200 text-slate-800 text-[11px] py-1.5 px-3 rounded-lg shadow-xl">
                                                    <span className="font-bold">
                                                        {count > 0 ? `${count} ${count === 1 ? 'habit' : 'habits'}` : 'No activity'}
                                                    </span>
                                                    <span className="block text-[10px] text-slate-400">{dateLabel}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-10 border-t border-slate-100 flex flex-wrap justify-between gap-8">
                    <div className="flex gap-12">
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase mb-1.5">Active Days</p>
                            <p className="text-2xl font-black text-slate-900">{activeDaysCount}</p>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase mb-1.5">Impact Level</p>
                            <p className="text-2xl font-black text-slate-900">{activePercentage}%</p>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase mb-1.5">Perfect Days</p>
                            <p className="text-2xl font-black text-emerald-500">{perfectDaysCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Habit Intelligence – High Contrast */}
<div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-6 rounded-2xl border border-emerald-200 shadow-sm">
  {/* Header */}
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-2 relative group">
      <h3 className="text-lg font-bold text-slate-900">
        Habit Intelligence
      </h3>
      <div className="relative">
        <InformationCircleIcon className="w-4 h-4 text-teal-600 cursor-pointer" />
        <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-sm text-slate-700 z-50">
          <p className="font-semibold mb-1">Your Habit Intelligence Score</p>
          <p className="text-xs text-slate-500">Measures your consistency and performance across all habits. Updated daily based on your progress.</p>
        </div>
      </div>
    </div>
    <span className="px-3 py-1 text-xs font-semibold text-teal-800 bg-white border border-teal-200 rounded-full">
      Smart AI
    </span>
  </div>

  {/* HERO SCORE */}
  <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 text-center">
    <p className="text-xs uppercase tracking-widest text-slate-600 font-semibold mb-1">
      Consistency Score
    </p>

    <div className="flex items-center justify-center gap-4">
      <span className="text-6xl font-black text-slate-900 leading-none">
        {stats.insights.consistencyScore}
      </span>

      <span
        className={`px-3 py-1 text-xs font-bold rounded-full ${
          stats.insights.consistencyScore >= 80
            ? 'bg-emerald-200 text-emerald-900'
            : stats.insights.consistencyScore >= 50
            ? 'bg-teal-200 text-teal-900'
            : 'bg-amber-200 text-amber-900'
        }`}
      >
        {stats.insights.consistencyScore >= 80
          ? 'Elite'
          : stats.insights.consistencyScore >= 50
          ? 'Steady'
          : 'Building'}
      </span>
    </div>

    <div className="relative group">
      <p className="mt-2 text-sm text-slate-600 font-medium cursor-help">
        Overall habit discipline strength
        <span className="ml-1 text-xs text-teal-600">ⓘ</span>
      </p>
      <div className="absolute hidden group-hover:block bottom-full left-0 mb-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-sm text-slate-700 z-50">
        <p className="font-semibold mb-1">How is this calculated?</p>
        <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
          <li>70% based on completion rate (tasks done vs total possible)</li>
          <li>30% based on consistency (active days vs total days)</li>
          <li>+ Bonus for current streak</li>
          <li>- Penalty for gaps in tracking</li>
        </ul>
      </div>
    </div>
  </div>

  {/* PERFORMANCE SPLIT */}
  <div className="grid grid-cols-2 gap-4 mb-6">
    <div>
      <div className="relative group">
        <p className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
          Weekdays
          <span className="text-teal-600 text-[10px] cursor-help">ⓘ</span>
        </p>
        <div className="absolute hidden group-hover:block bottom-full left-0 mb-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs text-slate-700 z-50">
          Your completion rate on weekdays (Monday-Friday).
          Higher is better for building consistent routines.
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold text-slate-900">
          {stats.insights.weekdayRate}%
        </span>
        <div className="flex-grow h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-600"
            style={{ width: `${stats.insights.weekdayRate}%` }}
          />
        </div>
      </div>
    </div>

    <div>
      <div className="relative group">
        <p className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
          Weekends
          <span className="text-teal-600 text-[10px] cursor-help">ⓘ</span>
        </p>
        <div className="absolute hidden group-hover:block bottom-full left-0 mb-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs text-slate-700 z-50">
          Your completion rate on weekends (Saturday-Sunday).
          Helps track if you maintain habits on off-days.
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold text-slate-900">
          {stats.insights.weekendRate}%
        </span>
        <div className="flex-grow h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600"
            style={{ width: `${stats.insights.weekendRate}%` }}
          />
        </div>
      </div>
    </div>
  </div>

  {/* RECOVERY + RISK */}
  <div className="grid grid-cols-2 gap-4">
    <div className="bg-white p-4 rounded-lg border border-slate-200">
      <div className="relative group">
        <p className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
          Recovery
          <span className="text-teal-600 text-[10px] cursor-help">ⓘ</span>
        </p>
        <p className="text-sm font-semibold text-slate-900 leading-tight">
          {stats.insights.recoveryMessage}
        </p>
        <div className="absolute hidden group-hover:block bottom-full left-0 mb-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs text-slate-700 z-50">
          <p className="font-semibold mb-1">Recovery Rate</p>
          <p className="text-slate-500">
            Shows how quickly you get back on track after missing a day.
            Lower numbers are better, with 0 being perfect consistency.
          </p>
        </div>
      </div>
    </div>

    <div className="bg-white p-4 rounded-lg border border-slate-200">
      <div className="relative group">
        <p className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
          Longest Gap
          <span className="text-teal-600 text-[10px] cursor-help">ⓘ</span>
        </p>
        <div className="absolute hidden group-hover:block bottom-full left-0 mb-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs text-slate-700 z-50">
          <p className="font-semibold mb-1">Longest Break</p>
          <p className="text-slate-500">
            The maximum number of consecutive days you've missed all habits.
            Try to keep this number low for better consistency.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-slate-900">
          {stats.insights.longestGap}d
        </span>
        {stats.insights.longestGap > 3 ? (
          <span className="text-[10px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full font-bold">
            ⚠ At Risk
          </span>
        ) : (
          <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
            On Track
          </span>
        )}
      </div>
    </div>
  </div>
</div>


        </div>
    );
};

export default AnalyticsInsights;
