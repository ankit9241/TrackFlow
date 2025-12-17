// frontend/src/components/WeeklySummary.jsx
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval } from 'date-fns';

const WeeklySummary = ({ habits, isHabitCompleted }) => {
  // Calculate the start and end of the current week
  const now = new Date();
  const startDate = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const endDate = endOfWeek(now, { weekStartsOn: 1 }); // Sunday

  // Get all days of the current week
  const weekDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Calculate completions for each day of the week
  const weeklyData = weekDays.map(day => {
    const dayCompletions = habits.reduce((count, habit) => {
      return isHabitCompleted(habit._id, day) ? count + 1 : count;
    }, 0);

    return {
      day: format(day, 'EEE'),
      date: day,
      completions: dayCompletions
    };
  });

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Summary</h3>
      <div className="space-y-4">
        <div className="space-y-3">
          {weeklyData.map(({ day, completions }) => (
            <div key={day} className="flex items-center">
              <span className="w-10 text-sm font-medium text-gray-500">{day}</span>
              <div className="flex-1 ml-2">
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ 
                      width: `${(completions / Math.max(habits.length, 1)) * 100}%`,
                      transition: 'width 0.5s ease-out'
                    }}
                  ></div>
                </div>
              </div>
              <span className="ml-2 text-sm text-gray-600 w-8 text-right">
                {completions}/{habits.length}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklySummary;