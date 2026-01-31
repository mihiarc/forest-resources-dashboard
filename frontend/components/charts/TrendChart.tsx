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
import type { TimeSeriesPoint } from '@/lib/types';

interface TrendChartProps {
  data: TimeSeriesPoint[];
  title?: string;
  color?: string;
  yAxisLabel?: string;
  formatValue?: (value: number) => string;
}

export default function TrendChart({
  data,
  color = '#16a34a',
  yAxisLabel = 'Value',
  formatValue = (v) => v.toLocaleString(),
}: TrendChartProps) {
  const chartData = data.map((point) => ({
    year: point.year,
    value: point.value,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
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
          formatter={(value: number) => [formatValue(value), yAxisLabel]}
          labelFormatter={(year) => `Year: ${year}`}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
          name={yAxisLabel}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
