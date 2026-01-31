'use client';

import { useState } from 'react';
import ChartContainer from '@/components/ui/ChartContainer';
import FilterSidebar from '@/components/filters/FilterSidebar';
import DataTable from '@/components/ui/DataTable';
import PieChartComponent from '@/components/charts/PieChartComponent';
import BarChartComponent from '@/components/charts/BarChartComponent';
import MetricCard from '@/components/ui/MetricCard';
import {
  useTimberVolume,
  useTimberBreakdown,
  useTimberByRegion,
  useTimberByState,
} from '@/hooks/useForestData';
import type { FilterState } from '@/lib/types';

export default function TimberPage() {
  const [filters, setFilters] = useState<FilterState>({});

  const { data: timber, isLoading, error } = useTimberVolume(filters);
  const { data: breakdown } = useTimberBreakdown(filters.region);
  const { data: byRegion } = useTimberByRegion();
  const { data: byState } = useTimberByState(filters.region);

  const pieData =
    breakdown?.map((b) => ({
      name: b.category,
      value: b.volume,
    })) || [];

  const regionBarData =
    (byRegion as Record<string, unknown>[] | undefined)?.map((r) => ({
      name: r.region as string,
      softwood: (r.softwood as number) / 1000,
      hardwood: (r.hardwood as number) / 1000,
    })) || [];

  const stateBarData =
    (byState as Record<string, unknown>[] | undefined)
      ?.slice(0, 12)
      .map((s) => ({
        name: s.state as string,
        volume: (s.total as number) / 1000,
      })) || [];

  const columns = [
    { key: 'state', header: 'State' },
    { key: 'region', header: 'Region' },
    { key: 'all_timber_total', header: 'Total', align: 'right' as const },
    { key: 'all_timber_softwoods', header: 'Softwood', align: 'right' as const },
    { key: 'all_timber_hardwoods', header: 'Hardwood', align: 'right' as const },
    { key: 'growing_stock_total', header: 'Growing Stock', align: 'right' as const },
    { key: 'cull_total', header: 'Cull', align: 'right' as const },
    { key: 'sound_dead_total', header: 'Sound Dead', align: 'right' as const },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Timber Volume</h1>
        <p className="mt-2 text-gray-600">
          Net volume of timber on timberland by species group and state (2022)
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              title="Total Volume"
              value={timber?.total_volume ? (timber.total_volume / 1000).toFixed(0) : '—'}
              unit="billion cu ft"
              isLoading={isLoading}
            />
            <MetricCard
              title="Softwood"
              value={timber?.softwood_volume ? (timber.softwood_volume / 1000).toFixed(0) : '—'}
              unit="billion cu ft"
              subtitle={`${timber?.softwood_percent?.toFixed(0) || '—'}% of total`}
              isLoading={isLoading}
            />
            <MetricCard
              title="Hardwood"
              value={timber?.hardwood_volume ? (timber.hardwood_volume / 1000).toFixed(0) : '—'}
              unit="billion cu ft"
              subtitle={`${timber?.hardwood_percent?.toFixed(0) || '—'}% of total`}
              isLoading={isLoading}
            />
            <MetricCard
              title="States"
              value={timber?.total_records || '—'}
              subtitle="With timber data"
              isLoading={isLoading}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartContainer
              title="Softwood vs Hardwood"
              subtitle="Volume distribution by species type"
              isLoading={isLoading}
              error={error}
            >
              <PieChartComponent
                data={pieData}
                colors={['#16a34a', '#86efac']}
              />
            </ChartContainer>

            <ChartContainer
              title="Volume by Region"
              subtitle="Billion cubic feet"
              isLoading={isLoading}
              error={error}
            >
              <BarChartComponent
                data={regionBarData}
                xKey="name"
                bars={[
                  { key: 'softwood', name: 'Softwood', color: '#16a34a' },
                  { key: 'hardwood', name: 'Hardwood', color: '#86efac' },
                ]}
                yAxisLabel="Billion Cu Ft"
                stacked
              />
            </ChartContainer>
          </div>

          {/* Top States */}
          <ChartContainer
            title="Top States by Timber Volume"
            subtitle="Billion cubic feet"
            isLoading={isLoading}
            error={error}
          >
            <BarChartComponent
              data={stateBarData}
              xKey="name"
              bars={[{ key: 'volume', name: 'Total Volume', color: '#16a34a' }]}
              yAxisLabel="Billion Cu Ft"
            />
          </ChartContainer>

          {/* Data Table */}
          <ChartContainer
            title="Detailed Timber Data"
            subtitle="All values in million cubic feet"
            isLoading={isLoading}
            error={error}
          >
            <DataTable
              data={timber?.data || []}
              columns={columns}
              pageSize={15}
            />
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
