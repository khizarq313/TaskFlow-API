import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface StatusDonutChartProps {
  data: Record<string, number>;
}

interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
}

export const StatusDonutChart: React.FC<StatusDonutChartProps> = ({ data }) => {
  const COLORS: Record<string, string> = {
    TODO: '#464555',
    IN_PROGRESS: '#4f46e5',
    DONE: '#ffb95f',
  };

  const LABELS: Record<string, string> = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done',
  };

  const chartData: ChartDataPoint[] = Object.entries(data).map(([status, value]) => ({
    name: LABELS[status] || status,
    value,
    color: COLORS[status] || '#464555',
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any): React.ReactElement | null => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-container-high rounded-xl p-3 text-sm text-white atmospheric-shadow">
          <p className="font-semibold">{payload[0].name}</p>
          <p style={{ color: payload[0].payload.color }}>{payload[0].value} tasks</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface-container-low rounded-xl p-6">
      <h3 className="font-headline font-bold text-lg text-white mb-6">Status Distribution</h3>

      <div className="relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-2xl font-extrabold text-white">{total}</div>
          <div className="text-xs text-on-surface-variant">Total</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2 mt-4">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            <span className="text-sm text-on-surface-variant flex-1">{item.name}</span>
            <span className="text-sm font-bold text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusDonutChart;
