import React from 'react';
import { TrophyIcon } from '@heroicons/react/24/solid';

const AnalyticsHabits = ({ rankings, overview }) => {
  const { all } = rankings;
  if (!all || all.length === 0) return null;

  const maxCompletions = all[0].totalCompletions || 1;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 pb-10">
      
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-slate-900">
          Habit performance
        </h3>
        <p className="text-sm text-slate-600">
          Consistency comparison across your habits
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Rankings */}
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-5">
            Rankings
          </p>

          <div className="space-y-5 max-h-[360px] overflow-y-auto pr-2">
            {all.map((habit, idx) => {
              const percentage = Math.round(
                (habit.totalCompletions / maxCompletions) * 100
              );
              const isTop = idx === 0;

              return (
                <div
                  key={habit._id}
                  className={`p-3 rounded-xl ${
                    isTop ? 'bg-emerald-50 border border-emerald-200' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${
                          isTop
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span className="text-sm font-semibold text-slate-900">
                        {habit.name}
                      </span>
                    </div>

                    <span className="text-sm font-semibold text-slate-700">
                      {habit.totalCompletions}
                    </span>
                  </div>

                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isTop ? 'bg-emerald-600' : 'bg-emerald-300'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Highlights */}
        <div className="flex flex-col gap-5">

          {/* Top Performer */}
          <div className="bg-white border border-emerald-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <TrophyIcon className="w-4 h-4 text-emerald-700" />
              </div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                Top performer
              </span>
            </div>

            <h4 className="text-base font-bold text-slate-900 truncate">
              {rankings.top.name}
            </h4>
            <p className="text-sm text-slate-600 mt-1">
              {rankings.top.totalCompletions} completions
            </p>
          </div>

          {/* Weekly Momentum */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Weekly momentum
            </p>

            <div className="flex items-baseline gap-2 mt-2">
              <span
                className={`text-2xl font-bold ${
                  overview.weeklyMomentum >= 0
                    ? 'text-emerald-600'
                    : 'text-rose-600'
                }`}
              >
                {overview.weeklyMomentum >= 0 ? '+' : ''}
                {overview.weeklyMomentum}%
              </span>
              <span className="text-xs text-slate-500">
                vs last week
              </span>
            </div>

            <p className="text-sm text-slate-600 mt-1">
              {overview.weeklyMomentum >= 0
                ? 'Momentum is improving'
                : 'Consistency dipped slightly'}
            </p>
          </div>

          {/* Needs Attention */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
              Needs attention
            </p>
            <h4 className="text-base font-bold text-slate-900 mt-1 truncate">
              {rankings.bottom.name}
            </h4>
            <p className="text-sm text-slate-700 mt-1">
              Opportunity to build consistency
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsHabits;
