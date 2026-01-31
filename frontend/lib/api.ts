import type {
  RegionInfo,
  LandAreaResponse,
  LandAreaSummary,
  OwnershipResponse,
  OwnershipBreakdown,
  ForestAreaTrendResponse,
  TimeSeriesPoint,
  RegionalTrend,
  TimberVolumeResponse,
  TimberBreakdown,
  DynamicsResponse,
  DynamicsSummary,
  RegionalDynamics,
  FilterState,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetchApi<T>(endpoint: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Filter endpoints
export async function getRegions(): Promise<RegionInfo[]> {
  return fetchApi<RegionInfo[]>('/api/filters/regions');
}

export async function getStates(region?: string, subregion?: string): Promise<string[]> {
  return fetchApi<string[]>('/api/filters/states', { region, subregion });
}

export async function getYears(): Promise<number[]> {
  return fetchApi<number[]>('/api/filters/years');
}

// Land Area endpoints
export async function getLandArea(filters?: FilterState): Promise<LandAreaResponse> {
  return fetchApi<LandAreaResponse>('/api/land-area', filters);
}

export async function getLandAreaByRegion(): Promise<LandAreaSummary[]> {
  return fetchApi<LandAreaSummary[]>('/api/land-area/summary/by-region');
}

export async function getLandAreaByState(region?: string): Promise<LandAreaSummary[]> {
  return fetchApi<LandAreaSummary[]>('/api/land-area/summary/by-state', { region });
}

// Ownership endpoints
export async function getOwnership(filters?: FilterState): Promise<OwnershipResponse> {
  return fetchApi<OwnershipResponse>('/api/ownership', filters);
}

export async function getOwnershipBreakdown(region?: string): Promise<OwnershipBreakdown[]> {
  return fetchApi<OwnershipBreakdown[]>('/api/ownership/breakdown', { region });
}

export async function getOwnershipByRegion(): Promise<Record<string, unknown>[]> {
  return fetchApi<Record<string, unknown>[]>('/api/ownership/by-region');
}

// Trends endpoints
export async function getForestAreaTrends(filters?: FilterState): Promise<ForestAreaTrendResponse> {
  return fetchApi<ForestAreaTrendResponse>('/api/trends/forest-area', filters);
}

export async function getNationalForestAreaTrend(): Promise<TimeSeriesPoint[]> {
  return fetchApi<TimeSeriesPoint[]>('/api/trends/forest-area/national');
}

export async function getForestAreaByRegion(): Promise<RegionalTrend[]> {
  return fetchApi<RegionalTrend[]>('/api/trends/forest-area/by-region');
}

// Timber endpoints
export async function getTimberVolume(filters?: FilterState): Promise<TimberVolumeResponse> {
  return fetchApi<TimberVolumeResponse>('/api/timber', filters);
}

export async function getTimberBreakdown(region?: string): Promise<TimberBreakdown[]> {
  return fetchApi<TimberBreakdown[]>('/api/timber/breakdown', { region });
}

export async function getTimberByRegion(): Promise<Record<string, unknown>[]> {
  return fetchApi<Record<string, unknown>[]>('/api/timber/by-region');
}

export async function getTimberByState(region?: string): Promise<Record<string, unknown>[]> {
  return fetchApi<Record<string, unknown>[]>('/api/timber/by-state', { region });
}

// Dynamics endpoints
export async function getDynamics(filters?: FilterState & { species?: string }): Promise<DynamicsResponse> {
  return fetchApi<DynamicsResponse>('/api/dynamics', filters);
}

export async function getDynamicsSummary(year?: number): Promise<DynamicsSummary> {
  return fetchApi<DynamicsSummary>('/api/dynamics/summary', { year });
}

export async function getDynamicsByRegion(year?: number, species?: string): Promise<RegionalDynamics[]> {
  return fetchApi<RegionalDynamics[]>('/api/dynamics/by-region', { year, species });
}
