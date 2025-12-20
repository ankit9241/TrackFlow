import React from 'react';
import {
  CalendarDaysIcon,
  ChartBarIcon,
  FireIcon,
  SparklesIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      name: 'Intuitive Habit Grid',
      description:
        'An Excel-inspired monthly grid that lets you track multiple habits clearly and efficiently.',
      icon: CalendarDaysIcon,
    },
    {
      name: 'Advanced Analytics',
      description:
        'Visualize momentum, weekly output, and long-term consistency with clean, actionable insights.',
      icon: ChartBarIcon,
    },
    {
      name: 'Global Streaks',
      description:
        'Track overall consistency across all habits to build discipline, not just short-term motivation.',
      icon: FireIcon,
    },
    {
      name: 'Premium Experience',
      description:
        'A calm, distraction-free interface designed to make daily tracking effortless.',
      icon: SparklesIcon,
    },
    {
      name: 'Fully Responsive',
      description:
        'Optimized for desktop and mobile so you can track habits anywhere, anytime.',
      icon: DevicePhoneMobileIcon,
    },
    {
      name: 'Privacy First',
      description:
        'Your data stays private and secure. No tracking, no ads, no noise.',
      icon: ShieldCheckIcon,
    }
  ];

  return (
    <section className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest">
            Features
          </p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Build habits that last
          </h2>
          <p className="mt-6 text-lg text-slate-600">
            Thoughtfully designed tools to help you stay consistent,
            focused, and in control of your progress.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center p-3 rounded-xl bg-emerald-100 text-emerald-700 mb-6">
                <feature.icon className="h-6 w-6" />
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {feature.name}
              </h3>

              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-28 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl px-10 py-14 text-center">
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
            Start building better habits today
          </h3>

          <p className="text-emerald-100 max-w-xl mx-auto mb-10 text-lg">
            Simple tools, clear insights, and a calm experience designed
            to keep you consistent.
          </p>

          <Link
            to="/register"
            className="inline-flex items-center justify-center px-10 py-4 bg-white text-emerald-700 font-semibold rounded-2xl hover:bg-emerald-50 transition-colors shadow-sm"
          >
            Get Started Free
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Features;
