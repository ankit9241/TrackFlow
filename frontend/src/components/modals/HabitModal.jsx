import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { format, startOfMonth, endOfMonth } from 'date-fns';

const HabitModal = ({ isOpen, onClose, onSubmit, habit = null }) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  const [isWholeMonth, setIsWholeMonth] = useState(true);

  useEffect(() => {
    if (habit && isOpen) {
      setName(habit.name || '');
      const hStart = habit.startDate
        ? format(new Date(habit.startDate), 'yyyy-MM-dd')
        : format(startOfMonth(new Date()), 'yyyy-MM-dd');
      const hEnd = habit.endDate
        ? format(new Date(habit.endDate), 'yyyy-MM-dd')
        : format(endOfMonth(new Date()), 'yyyy-MM-dd');

      setStartDate(hStart);
      setEndDate(hEnd);

      const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd');
      setIsWholeMonth(hStart === monthStart && hEnd === monthEnd);
    } else if (!habit && isOpen) {
      setName('');
      setStartDate(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
      setEndDate(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
      setIsWholeMonth(true);
    }
  }, [habit, isOpen]);

  useEffect(() => {
    if (isWholeMonth) {
      setStartDate(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
      setEndDate(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
    }
  }, [isWholeMonth]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      startDate,
      endDate: endDate || null,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                  {habit ? 'Edit Habit' : 'New Habit'}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Habit Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Morning Meditation"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none"
                    autoFocus
                    required
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <CalendarDaysIcon className="w-4 h-4 text-emerald-600" />
                      Duration
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsWholeMonth(!isWholeMonth)}
                      className={`text-xs px-2 py-1 rounded-full border transition ${
                        isWholeMonth
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      Whole Month
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1 ml-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          setIsWholeMonth(false);
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1 ml-1">
                        End Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                          setIsWholeMonth(false);
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 text-slate-600 font-semibold rounded-xl hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 active:scale-95 transition text-sm"
                  >
                    {habit ? 'Save Changes' : 'Create Habit'}
                  </button>
                </div>
              </form>
            </div>

            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-32 h-32 bg-teal-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default HabitModal;
