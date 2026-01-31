'use client';

import { useState, useMemo } from 'react';
import ChartContainer from '@/components/ui/ChartContainer';
import TrendChart from '@/components/charts/TrendChart';
import MultiLineChart from '@/components/charts/MultiLineChart';
import MetricCard from '@/components/ui/MetricCard';
import {
  useNationalForestAreaTrend,
  useForestAreaByRegion,
} from '@/hooks/useForestData';

const ALL_YEARS = [1630, 1907, 1920, 1938, 1953, 1963, 1977, 1987, 1997, 2007, 2012, 2017, 2022];

export default function TrendsPage() {
  const [startYear, setStartYear] = useState(1630);
  const [endYear, setEndYear] = useState(2022);

  const { data: nationalTrend, isLoading: nationalLoading, error: nationalError } =
    useNationalForestAreaTrend();
  const { data: regionalTrends, isLoading: regionalLoading, error: regionalError } =
    useForestAreaByRegion();

  // Filter data by year range
  const filteredNationalTrend = useMemo(() => {
    if (!nationalTrend) return [];
    return nationalTrend.filter((p) => p.year >= startYear && p.year <= endYear);
  }, [nationalTrend, startYear, endYear]);

  const filteredRegionalTrends = useMemo(() => {
    if (!regionalTrends) return [];
    return regionalTrends.map((region) => ({
      ...region,
      data: region.data.filter((p) => p.year >= startYear && p.year <= endYear),
    }));
  }, [regionalTrends, startYear, endYear]);

  // Calculate change metrics based on filtered range
  const firstPoint = filteredNationalTrend[0];
  const lastPoint = filteredNationalTrend[filteredNationalTrend.length - 1];

  const periodChange =
    firstPoint?.value && lastPoint?.value
      ? ((lastPoint.value - firstPoint.value) / firstPoint.value) * 100
      : null;

  // Original metrics for context
  const originalFirst = nationalTrend?.find((p) => p.year === 1630);
  const originalLatest = nationalTrend?.find((p) => p.year === 2022);
  const minPoint = nationalTrend?.find((p) => p.year === 1920);

  const changeFrom1920 =
    minPoint?.value && originalLatest?.value
      ? ((originalLatest.value - minPoint.value) / minPoint.value) * 100
      : null;

  // Available years for dropdowns
  const startYearOptions = ALL_YEARS.filter((y) => y < endYear);
  const endYearOptions = ALL_YEARS.filter((y) => y > startYear);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Historical Trends</h1>
          <p className="mt-2 text-gray-600">
            Forest area changes from 1630 to 2022
          </p>
        </div>

        {/* Year Range Filter */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <span className="text-sm font-medium text-gray-700">Year Range:</span>
          <select
            value={startYear}
            onChange={(e) => setStartYear(Number(e.target.value))}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
          >
            {startYearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <span className="text-gray-500">to</span>
          <select
            value={endYear}
            onChange={(e) => setEndYear(Number(e.target.value))}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
          >
            {endYearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {(startYear !== 1630 || endYear !== 2022) && (
            <button
              onClick={() => {
                setStartYear(1630);
                setEndYear(2022);
              }}
              className="text-sm text-forest-600 hover:text-forest-700 underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title={`${startYear} Forest Area`}
          value={firstPoint?.value ? (firstPoint.value / 1000).toFixed(0) : '—'}
          unit="million acres"
          subtitle="Start of selected period"
          isLoading={nationalLoading}
        />
        <MetricCard
          title={`${endYear} Forest Area`}
          value={lastPoint?.value ? (lastPoint.value / 1000).toFixed(0) : '—'}
          unit="million acres"
          subtitle="End of selected period"
          isLoading={nationalLoading}
        />
        <MetricCard
          title="Period Change"
          value={periodChange ? `${periodChange > 0 ? '+' : ''}${periodChange.toFixed(1)}` : '—'}
          unit="%"
          subtitle={`${startYear} to ${endYear}`}
          isLoading={nationalLoading}
        />
        <MetricCard
          title="Recovery Since 1920"
          value={changeFrom1920 ? `+${changeFrom1920.toFixed(1)}` : '—'}
          unit="%"
          subtitle="From historical low"
          isLoading={nationalLoading}
        />
      </div>

      {/* National Trend Chart */}
      <ChartContainer
        title="U.S. Forest Area Over Time"
        subtitle={`Total forest area in thousand acres (${startYear}-${endYear})`}
        isLoading={nationalLoading}
        error={nationalError}
      >
        <TrendChart
          data={filteredNationalTrend}
          yAxisLabel="Thousand Acres"
          color="#16a34a"
          formatValue={(v) => `${(v / 1000).toFixed(1)}M acres`}
        />
      </ChartContainer>

      {/* Regional Trends */}
      <ChartContainer
        title="Forest Area Trends by Region"
        subtitle={`Regional comparison (${startYear}-${endYear})`}
        isLoading={regionalLoading}
        error={regionalError}
      >
        <MultiLineChart
          data={filteredRegionalTrends}
          yAxisLabel="Thousand Acres"
        />
      </ChartContainer>

      {/* Quick Presets */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Time Periods
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => { setStartYear(1630); setEndYear(2022); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              startYear === 1630 && endYear === 2022
                ? 'bg-forest-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Full History (1630-2022)
          </button>
          <button
            onClick={() => { setStartYear(1920); setEndYear(2022); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              startYear === 1920 && endYear === 2022
                ? 'bg-forest-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Recovery Era (1920-2022)
          </button>
          <button
            onClick={() => { setStartYear(1953); setEndYear(2022); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              startYear === 1953 && endYear === 2022
                ? 'bg-forest-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Modern Era (1953-2022)
          </button>
          <button
            onClick={() => { setStartYear(1997); setEndYear(2022); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              startYear === 1997 && endYear === 2022
                ? 'bg-forest-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Recent (1997-2022)
          </button>
          <button
            onClick={() => { setStartYear(1630); setEndYear(1920); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              startYear === 1630 && endYear === 1920
                ? 'bg-forest-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Decline Era (1630-1920)
          </button>
        </div>
      </div>

      {/* Historical Context */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Historical Context
        </h3>
        <div className="prose prose-sm max-w-none text-gray-600">
          <p>
            U.S. forest area has undergone significant changes over the past four
            centuries. Pre-settlement estimates suggest approximately{' '}
            {originalFirst?.value ? (originalFirst.value / 1000).toFixed(0) : '—'} million
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
            {originalLatest?.value ? (originalLatest.value / 1000).toFixed(0) : '—'} million
            acres, representing a{' '}
            {changeFrom1920 ? `${changeFrom1920.toFixed(0)}%` : '—'} increase from
            the 1920 low point.
          </p>
        </div>
      </div>
    </div>
  );
}
