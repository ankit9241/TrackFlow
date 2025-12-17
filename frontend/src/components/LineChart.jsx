import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
        <p className="font-medium text-gray-900">{`Day ${label}`}</p>
        <p className="text-sm text-indigo-600">
          {payload[0].value} {payload[0].value === 1 ? 'completion' : 'completions'}
        </p>
      </div>
    );
  }
  return null;
};

const LineChartComponent = ({ data }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-80">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Completions</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="completions"
              stroke="#4f46e5"
              fillOpacity={1}
              fill="url(#colorCompletion)"
              strokeWidth={2}
              dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartComponent;