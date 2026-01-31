'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { RegionalTrend } from '@/lib/types';

interface MultiLineChartProps {
  data: RegionalTrend[];
  yAxisLabel?: string;
}

const COLORS = [
  '#16a34a', // forest-600
  '#3b82f6', // blue-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
];

export default function MultiLineChart({
  data,
  yAxisLabel = 'Value',
}: MultiLineChartProps) {
  // Transform data for recharts
  const years = new Set<number>();
  data.forEach((region) => {
    region.data.forEach((point) => {
      years.add(point.year);
    });
  });

  const sortedYears = Array.from(years).sort((a, b) => a - b);

  const chartData = sortedYears.map((year) => {
    const point: Record<string, number> = { year };
    data.forEach((region) => {
      const regionPoint = region.data.find((p) => p.year === year);
      point[region.name] = regionPoint?.value ?? 0;
    });
    return point;
  });

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 12 }}
          tickFormatter={(year) => String(year)}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(value) =>
            value >= 1000000
              ? `${(value / 1000000).toFixed(1)}M`
              : value >= 1000
              ? `${(value / 1000).toFixed(0)}K`
              : String(value)
          }
          label={{
            value: yAxisLabel,
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle', fontSize: 12 },
          }}
        />
        <Tooltip
          formatter={(value: number) => [
            value.toLocaleString(undefined, { maximumFractionDigits: 0 }),
          ]}
          labelFormatter={(year) => `Year: ${year}`}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
          }}
        />
        <Legend />
        {data.map((region, index) => (
          <Line
            key={region.name}
            type="monotone"
            dataKey={region.name}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={2}
            dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
