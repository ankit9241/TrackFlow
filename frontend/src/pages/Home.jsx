import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  CheckBadgeIcon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import HeroImage from '../assets/hero-image.png';

import '@fontsource/montserrat/300.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-teal-50 font-montserrat selection:bg-emerald-100 selection:text-emerald-900">

      {/* ================= HERO ================= */}
      <section className="relative pt-8 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[640px] h-[640px] bg-teal-100/40 rounded-full blur-[140px]" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <span className="inline-flex px-3 py-1 rounded-full border border-teal-200/80 text-emerald-700 text-[11px] font-semibold tracking-widest uppercase mb-6">
                Habit System, Not a Todo App
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-6">
                Consistency beats motivation.
                <br />
                <span className="text-emerald-600">Track it. Build it.</span>
              </h1>

              <p className="max-w-xl mx-auto lg:mx-0 text-lg text-slate-600 leading-relaxed mb-10">
                TrackFlow helps you build habits through clarity, momentum,
                and visual accountability - without noise or guilt.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  to={currentUser ? '/dashboard' : '/register'}
                  className="px-6 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow-md hover:bg-emerald-700"
                >
                  {currentUser ? 'Go to Dashboard' : 'Start Free'}
                </Link>

                <Link
                  to="/features"
                  className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                >
                  Explore Features
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="mt-14 lg:mt-0">
              <img
                src={HeroImage}
                alt="TrackFlow dashboard"
                className="w-full max-w-2xl mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            A simple system that compounds
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            No hacks. No streak anxiety. Just visible progress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: CalendarDaysIcon,
              title: 'Plan your habits',
              desc: 'Create habits with clear timeframes and intent. Focus on what matters.',
              step: '01'
            },
            {
              icon: CheckBadgeIcon,
              title: 'Show up daily',
              desc: 'Mark progress visually with a sleek monthly grid. Build your flow.',
              step: '02'
            },
            {
              icon: ArrowTrendingUpIcon,
              title: 'Review momentum',
              desc: 'Understand patterns through calm, premium analytics and trends.',
              step: '03'
            },
          ].map((step) => (
            <div
              key={step.title}
              className="group relative bg-white/60 backdrop-blur-md p-10 rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(13,148,136,0.12)] transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              {/* Decorative Step Indicator */}
              <div className="absolute top-6 right-8 text-5xl font-black text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors duration-500 select-none">
                {step.step}
              </div>

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm">
                  <step.icon className="w-7 h-7" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">
                  {step.title}
                </h3>

                <p className="text-slate-600 leading-relaxed text-[15px]">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-t border-slate-100 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <SparklesIcon className="w-8 h-8 text-emerald-600 mx-auto mb-6" />

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Designed for long-term thinkers
          </h2>

          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            TrackFlow isn’t about perfection.
            It’s about reducing friction, visualizing effort,
            and letting consistency compound quietly over time.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-teal-50 border-t border-teal-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
            Your future habits start today
          </h2>

          <Link
            to="/register"
            className="px-8 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow-sm hover:bg-emerald-700"
          >
            Create your account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
