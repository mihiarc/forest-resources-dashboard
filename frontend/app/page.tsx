'use client';

import { useState } from 'react';
import MetricCard from '@/components/ui/MetricCard';
import ChartContainer from '@/components/ui/ChartContainer';
import PieChartComponent from '@/components/charts/PieChartComponent';
import BarChartComponent from '@/components/charts/BarChartComponent';
import USChoropleth from '@/components/maps/USChoropleth';
import {
  useLandArea,
  useLandAreaByRegion,
  useLandAreaByState,
  useOwnershipBreakdown,
} from '@/hooks/useForestData';

export default function HomePage() {
  const [selectedState, setSelectedState] = useState<string>();

  const { data: landArea, isLoading: landAreaLoading, error: landAreaError } = useLandArea();
  const { data: landAreaByRegion, isLoading: regionLoading, error: regionError } = useLandAreaByRegion();
  const { data: landAreaByState, isLoading: stateLoading, error: stateError } = useLandAreaByState();
  const { data: ownershipBreakdown, isLoading: ownershipLoading, error: ownershipError } = useOwnershipBreakdown();

  const mapData = landAreaByState?.map((s) => ({
    state: s.name,
    value: s.total_forest_land,
  })) || [];

  const ownershipPieData = ownershipBreakdown?.map((o) => ({
    name: o.category,
    value: o.area,
  })) || [];

  const regionBarData = landAreaByRegion?.map((r) => ({
    name: r.name,
    forest: r.total_forest_land / 1000,
    timberland: r.total_timberland / 1000,
  })) || [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          U.S. Forest Resources Overview
        </h1>
        <p className="mt-2 text-gray-600">
          2022 data from the USDA Forest Service Forest Inventory and Analysis Program
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Forest Land"
          value={landArea?.total_forest_land ? landArea.total_forest_land / 1000 : 0}
          unit="million acres"
          subtitle="All forest land in the U.S."
          isLoading={landAreaLoading}
        />
        <MetricCard
          title="Total Timberland"
          value={landArea?.total_timberland ? landArea.total_timberland / 1000 : 0}
          unit="million acres"
          subtitle="Productive forest land"
          isLoading={landAreaLoading}
        />
        <MetricCard
          title="Forest Cover"
          value={landArea?.forest_cover_percent || 0}
          unit="%"
          subtitle="Percentage of total land area"
          isLoading={landAreaLoading}
        />
        <MetricCard
          title="States Covered"
          value={landArea?.total_records || 0}
          subtitle="Including all U.S. states"
          isLoading={landAreaLoading}
        />
      </div>

      {/* Map and Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* US Map */}
        <ChartContainer
          title="Forest Land by State"
          subtitle="Click a state to see details"
          isLoading={stateLoading}
          error={stateError}
        >
          <USChoropleth
            data={mapData}
            metric="thousand acres"
            onStateClick={setSelectedState}
            selectedState={selectedState}
          />
          {selectedState && (
            <div className="mt-4 p-4 bg-forest-50 rounded-lg">
              <h4 className="font-semibold text-forest-800">{selectedState}</h4>
              {landAreaByState && (
                <p className="text-sm text-forest-600">
                  Forest Land:{' '}
                  {landAreaByState
                    .find((s) => s.name === selectedState)
                    ?.total_forest_land.toLocaleString()}{' '}
                  thousand acres
                </p>
              )}
            </div>
          )}
        </ChartContainer>

        {/* Ownership Breakdown */}
        <ChartContainer
          title="Forest Ownership Breakdown"
          subtitle="Distribution of forest land by ownership type"
          isLoading={ownershipLoading}
          error={ownershipError}
        >
          <PieChartComponent data={ownershipPieData} />
        </ChartContainer>
      </div>

      {/* Regional Comparison */}
      <ChartContainer
        title="Forest Area by Region"
        subtitle="Forest land and timberland by major region (million acres)"
        isLoading={regionLoading}
        error={regionError}
      >
        <BarChartComponent
          data={regionBarData}
          xKey="name"
          bars={[
            { key: 'forest', name: 'Forest Land', color: '#16a34a' },
            { key: 'timberland', name: 'Timberland', color: '#22c55e' },
          ]}
          yAxisLabel="Million Acres"
        />
      </ChartContainer>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="/trends"
          className="block p-6 bg-white rounded-lg shadow-md border border-gray-100 hover:border-forest-500 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900">Historical Trends</h3>
          <p className="mt-2 text-sm text-gray-600">
            View forest area changes from 1630 to 2022
          </p>
        </a>
        <a
          href="/timber"
          className="block p-6 bg-white rounded-lg shadow-md border border-gray-100 hover:border-forest-500 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900">Timber Volume</h3>
          <p className="mt-2 text-sm text-gray-600">
            Explore softwood and hardwood timber statistics
          </p>
        </a>
        <a
          href="/dynamics"
          className="block p-6 bg-white rounded-lg shadow-md border border-gray-100 hover:border-forest-500 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900">Forest Dynamics</h3>
          <p className="mt-2 text-sm text-gray-600">
            Analyze growth, mortality, and removals data
          </p>
        </a>
      </div>
    </div>
  );
}
