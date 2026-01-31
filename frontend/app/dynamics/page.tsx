'use client';

import { useState } from 'react';
import ChartContainer from '@/components/ui/ChartContainer';
import BarChartComponent from '@/components/charts/BarChartComponent';
import MetricCard from '@/components/ui/MetricCard';
import DataTable from '@/components/ui/DataTable';
import { useDynamicsSummary, useDynamicsByRegion, useDynamics } from '@/hooks/useForestData';

export default function DynamicsPage() {
  const [selectedYear, setSelectedYear] = useState(2022);
  const [selectedSpecies, setSelectedSpecies] = useState('Total');

  const { data: summary, isLoading: summaryLoading, error: summaryError } =
    useDynamicsSummary(selectedYear);
  const { data: byRegion, isLoading: regionLoading, error: regionError } =
    useDynamicsByRegion(selectedYear, selectedSpecies);
  const { data: dynamics } = useDynamics({ year: selectedYear, species: selectedSpecies });

  const regionBarData =
    byRegion?.map((r) => ({
      name: r.region,
      growth: r.growth / 1000000,
      mortality: r.mortality / 1000000,
      removals: r.removals / 1000000,
    })) || [];

  const years = [2022, 2016, 2011, 2006, 1996, 1976, 1952];
  const speciesOptions = ['Total', 'Softwood', 'Hardwood'];

  const columns = [
    { key: 'region', header: 'Region' },
    { key: 'species_group', header: 'Species' },
    { key: 'growth', header: 'Growth', align: 'right' as const },
    { key: 'mortality', header: 'Mortality', align: 'right' as const },
    { key: 'removals', header: 'Removals', align: 'right' as const },
    { key: 'net_change', header: 'Net Change', align: 'right' as const },
  ];

  const isSustainable = summary?.sustainability_ratio && summary.sustainability_ratio >= 1;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Forest Dynamics</h1>
          <p className="mt-2 text-gray-600">
            Annual growth, mortality, and removals of growing stock on timberland
          </p>
        </div>
        <div className="flex gap-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
          >
            {speciesOptions.map((species) => (
              <option key={species} value={species}>
                {species}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <MetricCard
          title="Total Growth"
          value={summary?.total_growth ? (summary.total_growth / 1000000).toFixed(1) : '—'}
          unit="billion cu ft"
          subtitle="Annual addition"
          isLoading={summaryLoading}
        />
        <MetricCard
          title="Total Mortality"
          value={summary?.total_mortality ? (summary.total_mortality / 1000000).toFixed(1) : '—'}
          unit="billion cu ft"
          subtitle="Natural loss"
          isLoading={summaryLoading}
        />
        <MetricCard
          title="Total Removals"
          value={summary?.total_removals ? (summary.total_removals / 1000000).toFixed(1) : '—'}
          unit="billion cu ft"
          subtitle="Harvested"
          isLoading={summaryLoading}
        />
        <MetricCard
          title="Net Change"
          value={summary?.net_change ? (summary.net_change / 1000000).toFixed(1) : '—'}
          unit="billion cu ft"
          subtitle={summary?.net_change && summary.net_change > 0 ? 'Net gain' : 'Net loss'}
          isLoading={summaryLoading}
        />
        <MetricCard
          title="Sustainability Ratio"
          value={summary?.sustainability_ratio?.toFixed(2) || '—'}
          subtitle={isSustainable ? 'Sustainable (>1.0)' : 'Unsustainable (<1.0)'}
          isLoading={summaryLoading}
        />
      </div>

      {/* Sustainability Indicator */}
      <div
        className={`p-4 rounded-lg border ${
          isSustainable
            ? 'bg-green-50 border-green-200'
            : 'bg-amber-50 border-amber-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-4 h-4 rounded-full ${
              isSustainable ? 'bg-green-500' : 'bg-amber-500'
            }`}
          />
          <div>
            <p className="font-medium text-gray-900">
              {isSustainable
                ? 'Forests are growing sustainably'
                : 'Monitor forest sustainability'}
            </p>
            <p className="text-sm text-gray-600">
              {isSustainable
                ? 'Growth exceeds mortality and removals combined'
                : 'Removals and mortality are approaching or exceeding growth'}
            </p>
          </div>
        </div>
      </div>

      {/* Regional Comparison */}
      <ChartContainer
        title="Dynamics by Region"
        subtitle="Growth, mortality, and removals in billion cubic feet"
        isLoading={regionLoading}
        error={regionError}
      >
        <BarChartComponent
          data={regionBarData}
          xKey="name"
          bars={[
            { key: 'growth', name: 'Growth', color: '#16a34a' },
            { key: 'mortality', name: 'Mortality', color: '#ef4444' },
            { key: 'removals', name: 'Removals', color: '#f59e0b' },
          ]}
          yAxisLabel="Billion Cu Ft"
        />
      </ChartContainer>

      {/* Explanation */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Understanding Forest Dynamics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-green-600 mb-2">Growth</h4>
            <p>
              The annual net increase in tree volume due to biological growth.
              Represents new wood added to existing trees plus new trees that
              enter the inventory.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-red-600 mb-2">Mortality</h4>
            <p>
              Volume lost due to natural causes such as disease, insects, fire,
              weather events, and competition. Does not include harvesting.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-amber-600 mb-2">Removals</h4>
            <p>
              Volume removed through timber harvesting, land clearing, and other
              human activities. Includes both commercial and non-commercial
              removals.
            </p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <ChartContainer
        title="Detailed Dynamics Data"
        subtitle="Values in thousand cubic feet"
        isLoading={regionLoading}
        error={regionError}
      >
        <DataTable
          data={dynamics?.data.filter((d) => d.subregion === null) || []}
          columns={columns}
          pageSize={10}
        />
      </ChartContainer>
    </div>
  );
}
