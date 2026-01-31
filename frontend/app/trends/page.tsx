'use client';

import ChartContainer from '@/components/ui/ChartContainer';
import TrendChart from '@/components/charts/TrendChart';
import MultiLineChart from '@/components/charts/MultiLineChart';
import MetricCard from '@/components/ui/MetricCard';
import {
  useNationalForestAreaTrend,
  useForestAreaByRegion,
} from '@/hooks/useForestData';

export default function TrendsPage() {
  const { data: nationalTrend, isLoading: nationalLoading, error: nationalError } =
    useNationalForestAreaTrend();
  const { data: regionalTrends, isLoading: regionalLoading, error: regionalError } =
    useForestAreaByRegion();

  // Calculate change metrics
  const firstPoint = nationalTrend?.find((p) => p.year === 1630);
  const latestPoint = nationalTrend?.find((p) => p.year === 2022);
  const minPoint = nationalTrend?.find((p) => p.year === 1920);

  const changeFrom1630 =
    firstPoint?.value && latestPoint?.value
      ? ((latestPoint.value - firstPoint.value) / firstPoint.value) * 100
      : null;

  const changeFrom1920 =
    minPoint?.value && latestPoint?.value
      ? ((latestPoint.value - minPoint.value) / minPoint.value) * 100
      : null;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Historical Trends</h1>
        <p className="mt-2 text-gray-600">
          Forest area changes from 1630 to 2022
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="1630 Forest Area"
          value={firstPoint?.value ? (firstPoint.value / 1000).toFixed(0) : '—'}
          unit="million acres"
          subtitle="Estimated pre-settlement"
          isLoading={nationalLoading}
        />
        <MetricCard
          title="1920 Low Point"
          value={minPoint?.value ? (minPoint.value / 1000).toFixed(0) : '—'}
          unit="million acres"
          subtitle="Historical minimum"
          isLoading={nationalLoading}
        />
        <MetricCard
          title="2022 Forest Area"
          value={latestPoint?.value ? (latestPoint.value / 1000).toFixed(0) : '—'}
          unit="million acres"
          subtitle="Current estimate"
          isLoading={nationalLoading}
        />
        <MetricCard
          title="Recovery Since 1920"
          value={changeFrom1920 ? `+${changeFrom1920.toFixed(1)}` : '—'}
          unit="%"
          subtitle="Forest area increase"
          isLoading={nationalLoading}
        />
      </div>

      {/* National Trend Chart */}
      <ChartContainer
        title="U.S. Forest Area Over Time"
        subtitle="Total forest area in thousand acres (1630-2022)"
        isLoading={nationalLoading}
        error={nationalError}
      >
        <TrendChart
          data={nationalTrend || []}
          yAxisLabel="Thousand Acres"
          color="#16a34a"
          formatValue={(v) => `${(v / 1000).toFixed(1)}M acres`}
        />
      </ChartContainer>

      {/* Regional Trends */}
      <ChartContainer
        title="Forest Area Trends by Region"
        subtitle="Regional comparison over time (thousand acres)"
        isLoading={regionalLoading}
        error={regionalError}
      >
        <MultiLineChart
          data={regionalTrends || []}
          yAxisLabel="Thousand Acres"
        />
      </ChartContainer>

      {/* Historical Context */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Historical Context
        </h3>
        <div className="prose prose-sm max-w-none text-gray-600">
          <p>
            U.S. forest area has undergone significant changes over the past four
            centuries. Pre-settlement estimates suggest approximately{' '}
            {firstPoint?.value ? (firstPoint.value / 1000).toFixed(0) : '—'} million
            acres of forest land in 1630.
          </p>
          <p className="mt-2">
            Forest area declined steadily through the 19th and early 20th centuries
            due to agricultural expansion and timber harvesting, reaching a low
            point around 1920. Since then, forest area has gradually recovered due
            to:
          </p>
          <ul className="mt-2 list-disc list-inside">
            <li>Abandonment of marginal agricultural land</li>
            <li>Improved forest management practices</li>
            <li>Conservation efforts and reforestation programs</li>
            <li>Natural forest regeneration</li>
          </ul>
          <p className="mt-2">
            Today, forests cover approximately{' '}
            {latestPoint?.value ? (latestPoint.value / 1000).toFixed(0) : '—'} million
            acres, representing a{' '}
            {changeFrom1920 ? `${changeFrom1920.toFixed(0)}%` : '—'} increase from
            the 1920 low point.
          </p>
        </div>
      </div>
    </div>
  );
}
