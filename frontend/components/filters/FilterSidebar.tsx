'use client';

import { useRegions, useStates } from '@/hooks/useForestData';
import type { FilterState } from '@/lib/types';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export default function FilterSidebar({
  filters,
  onFilterChange,
}: FilterSidebarProps) {
  const { data: regions, isLoading: regionsLoading } = useRegions();
  const { data: states } = useStates(filters.region, filters.subregion);

  const handleRegionChange = (region: string) => {
    onFilterChange({
      ...filters,
      region: region || undefined,
      subregion: undefined,
      state: undefined,
    });
  };

  const handleSubregionChange = (subregion: string) => {
    onFilterChange({
      ...filters,
      subregion: subregion || undefined,
      state: undefined,
    });
  };

  const handleStateChange = (state: string) => {
    onFilterChange({
      ...filters,
      state: state || undefined,
    });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const selectedRegion = regions?.find((r) => r.name === filters.region);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {(filters.region || filters.subregion || filters.state) && (
          <button
            onClick={clearFilters}
            className="text-sm text-forest-600 hover:text-forest-700"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Region Filter */}
        <div>
          <label
            htmlFor="region"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Region
          </label>
          <select
            id="region"
            value={filters.region || ''}
            onChange={(e) => handleRegionChange(e.target.value)}
            disabled={regionsLoading}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
          >
            <option value="">All Regions</option>
            {regions?.map((region) => (
              <option key={region.name} value={region.name}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subregion Filter */}
        {selectedRegion && selectedRegion.subregions.length > 0 && (
          <div>
            <label
              htmlFor="subregion"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subregion
            </label>
            <select
              id="subregion"
              value={filters.subregion || ''}
              onChange={(e) => handleSubregionChange(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
            >
              <option value="">All Subregions</option>
              {selectedRegion.subregions.map((subregion) => (
                <option key={subregion} value={subregion}>
                  {subregion}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* State Filter */}
        {states && states.length > 0 && (
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              State
            </label>
            <select
              id="state"
              value={filters.state || ''}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
            >
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {(filters.region || filters.subregion || filters.state) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-500 uppercase mb-2">
            Active Filters
          </p>
          <div className="flex flex-wrap gap-2">
            {filters.region && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-forest-100 text-forest-800">
                {filters.region}
              </span>
            )}
            {filters.subregion && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-forest-100 text-forest-800">
                {filters.subregion}
              </span>
            )}
            {filters.state && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-forest-100 text-forest-800">
                {filters.state}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
