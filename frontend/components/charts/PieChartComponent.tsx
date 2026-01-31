'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PieChartComponentProps {
  data: { name: string; value: number }[];
  colors?: string[];
}

const DEFAULT_COLORS = [
  '#16a34a', // forest-600
  '#22c55e', // forest-500
  '#4ade80', // forest-400
  '#86efac', // forest-300
  '#bbf7d0', // forest-200
  '#166534', // forest-800
  '#14532d', // forest-900
  '#15803d', // forest-700
];

export default function PieChartComponent({
  data,
  colors = DEFAULT_COLORS,
}: PieChartComponentProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            percent > 0.05 ? `${name} (${(percent * 100).toFixed(0)}%)` : ''
          }
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [
            `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })} (${(
              (value / total) *
              100
            ).toFixed(1)}%)`,
            'Area',
          ]}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
