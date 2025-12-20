import React from 'react';
import { FireIcon, TrophyIcon } from '@heroicons/react/24/solid';

const OverviewCards = ({ stats }) => {
  const { completionRate, currentStreak, bestStreak, activeHabits } =
    stats.overview || {};

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Overall Completion */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">
              Overall Completion
            </p>
            <h3 className="text-2xl font-black text-emerald-600">
              {completionRate}%
            </h3>
          </div>
          <div className="h-12 w-12 rounded-full border-[3px] border-emerald-100 flex items-center justify-center">
            <svg
              className="w-full h-full transform -rotate-90 text-emerald-600"
              viewBox="0 0 36 36"
            >
              <path
                strokeDasharray={`${completionRate}, 100`}
                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Current Streak */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">
              Current Streak
            </p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-2xl font-black text-slate-800">
                {currentStreak}
              </h3>
              <span className="text-xs text-slate-400">days</span>
            </div>
          </div>
          <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <FireIcon className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Best Streak */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">
              Best Streak
            </p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-2xl font-black text-slate-800">
                {bestStreak}
              </h3>
              <span className="text-xs text-slate-400">days</span>
            </div>
          </div>
          <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <TrophyIcon className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Active Habits */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">
              Active Habits
            </p>
            <h3 className="text-2xl font-black text-slate-800">
              {activeHabits}
            </h3>
          </div>
          <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <svg
              className="w-5 h-5 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewCards;
