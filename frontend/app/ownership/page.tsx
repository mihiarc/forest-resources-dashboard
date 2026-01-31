'use client';

import { useState } from 'react';
import ChartContainer from '@/components/ui/ChartContainer';
import FilterSidebar from '@/components/filters/FilterSidebar';
import DataTable from '@/components/ui/DataTable';
import PieChartComponent from '@/components/charts/PieChartComponent';
import BarChartComponent from '@/components/charts/BarChartComponent';
import MetricCard from '@/components/ui/MetricCard';
import {
  useOwnership,
  useOwnershipBreakdown,
  useOwnershipByRegion,
} from '@/hooks/useForestData';
import type { FilterState } from '@/lib/types';

export default function OwnershipPage() {
  const [filters, setFilters] = useState<FilterState>({});

  const { data: ownership, isLoading, error } = useOwnership(filters);
  const { data: breakdown, isLoading: breakdownLoading } = useOwnershipBreakdown(
    filters.region
  );
  const { data: byRegion } = useOwnershipByRegion();

  const pieData =
    breakdown?.map((b) => ({
      name: b.category,
      value: b.area,
    })) || [];

  const regionBarData =
    (byRegion as Record<string, unknown>[] | undefined)?.map((r) => ({
      name: r.region as string,
      public: (r.public as number) / 1000,
      private: (r.private as number) / 1000,
    })) || [];

  const columns = [
    { key: 'state', header: 'State' },
    { key: 'region', header: 'Region' },
    { key: 'all_ownerships', header: 'Total', align: 'right' as const },
    { key: 'total_public', header: 'Public', align: 'right' as const },
    { key: 'total_private', header: 'Private', align: 'right' as const },
    { key: 'national_forest', header: 'Nat. Forest', align: 'right' as const },
    { key: 'state_owned', header: 'State', align: 'right' as const },
    { key: 'private_corporate', header: 'Corporate', align: 'right' as const },
    { key: 'private_noncorporate', header: 'Non-Corp', align: 'right' as const },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Forest Ownership</h1>
        <p className="mt-2 text-gray-600">
          Forest and woodland ownership breakdown by region and state (2022)
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
              title="Total Public"
              value={ownership?.total_public ? (ownership.total_public / 1000).toFixed(1) : '—'}
              unit="million acres"
              isLoading={isLoading}
            />
            <MetricCard
              title="Total Private"
              value={ownership?.total_private ? (ownership.total_private / 1000).toFixed(1) : '—'}
              unit="million acres"
              isLoading={isLoading}
            />
            <MetricCard
              title="Total Federal"
              value={ownership?.total_federal ? (ownership.total_federal / 1000).toFixed(1) : '—'}
              unit="million acres"
              isLoading={isLoading}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartContainer
              title="Ownership Distribution"
              subtitle="Forest land by ownership category"
              isLoading={breakdownLoading}
              error={error}
            >
              <PieChartComponent data={pieData} />
            </ChartContainer>

            <ChartContainer
              title="Public vs Private by Region"
              subtitle="Million acres"
              isLoading={isLoading}
              error={error}
            >
              <BarChartComponent
                data={regionBarData}
                xKey="name"
                bars={[
                  { key: 'public', name: 'Public', color: '#3b82f6' },
                  { key: 'private', name: 'Private', color: '#16a34a' },
                ]}
                yAxisLabel="Million Acres"
                stacked
              />
            </ChartContainer>
          </div>

          {/* Data Table */}
          <ChartContainer
            title="Detailed Ownership Data"
            subtitle="All values in thousand acres"
            isLoading={isLoading}
            error={error}
          >
            <DataTable
              data={ownership?.data || []}
              columns={columns}
              pageSize={15}
            />
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
