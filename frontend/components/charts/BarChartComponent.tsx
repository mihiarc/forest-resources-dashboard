'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface BarChartComponentProps {
  data: Record<string, unknown>[];
  xKey: string;
  bars: {
    key: string;
    name: string;
    color: string;
  }[];
  yAxisLabel?: string;
  stacked?: boolean;
}

export default function BarChartComponent({
  data,
  xKey,
  bars,
  yAxisLabel = 'Value',
  stacked = false,
}: BarChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
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
            value.toLocaleString(undefined, { maximumFractionDigits: 1 }),
          ]}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
          }}
        />
        <Legend />
        {bars.map((bar) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            name={bar.name}
            fill={bar.color}
            stackId={stacked ? 'stack' : undefined}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
