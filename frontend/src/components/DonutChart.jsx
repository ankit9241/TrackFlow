import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const DonutChartComponent = ({ completed, total }) => {
  const data = [
    { name: 'Completed', value: completed, color: '#10b981' },
    { name: 'Remaining', value: total - completed, color: '#e2e8f0' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
          <p className="font-medium text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            {payload[0].value} {payload[0].value === 1 ? 'task' : 'tasks'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-80 flex flex-col">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Progress</h3>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-2xl font-bold text-gray-900">
              {total > 0 ? Math.round((completed / total) * 100) : 0}%
            </span>
            <span className="text-sm text-gray-500">Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonutChartComponent;