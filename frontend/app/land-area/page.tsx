'use client';

import { useState } from 'react';
import ChartContainer from '@/components/ui/ChartContainer';
import FilterSidebar from '@/components/filters/FilterSidebar';
import DataTable from '@/components/ui/DataTable';
import BarChartComponent from '@/components/charts/BarChartComponent';
import MetricCard from '@/components/ui/MetricCard';
import { useLandArea, useLandAreaByState } from '@/hooks/useForestData';
import type { FilterState, LandAreaRecord } from '@/lib/types';

export default function LandAreaPage() {
  const [filters, setFilters] = useState<FilterState>({});

  const { data: landArea, isLoading, error } = useLandArea(filters);
  const { data: stateData } = useLandAreaByState(filters.region);

  const chartData = stateData?.slice(0, 15).map((s) => ({
    name: s.name,
    forest: s.total_forest_land / 1000,
    timberland: s.total_timberland / 1000,
  })) || [];

  const columns = [
    { key: 'state', header: 'State' },
    { key: 'region', header: 'Region' },
    { key: 'subregion', header: 'Subregion' },
    { key: 'total_land_area', header: 'Total Land', align: 'right' as const },
    { key: 'total_forest_land', header: 'Forest Land', align: 'right' as const },
    { key: 'total_timberland', header: 'Timberland', align: 'right' as const },
    {
      key: 'forest_percent',
      header: 'Forest %',
      align: 'right' as const,
      render: (_: unknown, row: LandAreaRecord) => {
        const percent = row.total_land_area && row.total_forest_land
          ? ((row.total_forest_land / row.total_land_area) * 100).toFixed(1)
          : '—';
        return `${percent}%`;
      },
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Land Area Analysis</h1>
        <p className="mt-2 text-gray-600">
          Land classification data by region, subregion, and state (2022)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <FilterSidebar filters={filters} onFilterChange={setFilters} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Summary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Total Land Area"
              value={landArea?.total_land_area ? (landArea.total_land_area / 1000).toFixed(1) : '—'}
              unit="million acres"
              isLoading={isLoading}
            />
            <MetricCard
              title="Total Forest Land"
              value={landArea?.total_forest_land ? (landArea.total_forest_land / 1000).toFixed(1) : '—'}
              unit="million acres"
              isLoading={isLoading}
            />
            <MetricCard
              title="Forest Cover"
              value={landArea?.forest_cover_percent?.toFixed(1) || '—'}
              unit="%"
              isLoading={isLoading}
            />
          </div>

          {/* Chart */}
          <ChartContainer
            title="Forest and Timberland by State"
            subtitle="Top 15 states by forest area (million acres)"
            isLoading={isLoading}
            error={error}
          >
            <BarChartComponent
              data={chartData}
              xKey="name"
              bars={[
                { key: 'forest', name: 'Forest Land', color: '#16a34a' },
                { key: 'timberland', name: 'Timberland', color: '#86efac' },
              ]}
              yAxisLabel="Million Acres"
            />
          </ChartContainer>

          {/* Data Table */}
          <ChartContainer
            title="Detailed Land Area Data"
            subtitle="All values in thousand acres"
            isLoading={isLoading}
            error={error}
          >
            <DataTable
              data={landArea?.data || []}
              columns={columns}
              pageSize={15}
            />
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
