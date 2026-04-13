import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface WeeklyBarChartProps {
  data: Record<string, number>;
}

interface ChartDataPoint {
  day: string;
  completed: number;
}

export const WeeklyBarChart: React.FC<WeeklyBarChartProps> = ({ data }) => {
  // Transform data into chart format and get last 7 days
  const chartData: ChartDataPoint[] = Object.entries(data)
    .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
    .slice(-7)
    .map(([date, completed]) => {
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      return {
        day: dayName,
        completed,
      };
    });

  const CustomTooltip = ({ active, payload }: any): React.ReactElement | null => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-container-high rounded-xl p-3 text-sm text-white atmospheric-shadow">
          <p className="font-semibold">{payload[0].payload.day}</p>
          <p className="text-primary">{payload[0].value} tasks completed</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface-container-low rounded-xl p-6">
      <h3 className="font-headline font-bold text-lg text-white mb-1">Weekly Task Completion</h3>
      <p className="text-xs text-on-surface-variant mb-6">Tasks completed per day — last 7 days</p>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c3c0ff" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#464555" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: '#918fa1', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#918fa1', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(79, 70, 229, 0.1)' }} />
          <Bar dataKey="completed" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyBarChart;
