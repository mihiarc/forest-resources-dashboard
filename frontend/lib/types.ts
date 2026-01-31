// Common types
export interface RegionInfo {
  name: string;
  subregions: string[];
}

// Land Area types
export interface LandAreaRecord {
  region: string;
  subregion: string;
  state: string;
  total_land_area: number | null;
  total_forest_land: number | null;
  total_timberland: number | null;
  planted_timberland: number | null;
  natural_timberland: number | null;
  productive_reserved: number | null;
  unproductive_reserved: number | null;
  other_forest: number | null;
  woodland_area: number | null;
  other_land: number | null;
}

export interface LandAreaResponse {
  data: LandAreaRecord[];
  total_records: number;
  total_land_area: number;
  total_forest_land: number;
  total_timberland: number;
  forest_cover_percent: number;
}

export interface LandAreaSummary {
  name: string;
  total_land_area: number;
  total_forest_land: number;
  total_timberland: number;
  forest_cover_percent: number;
}

// Ownership types
export interface OwnershipRecord {
  region: string;
  subregion: string;
  state: string;
  all_ownerships: number | null;
  total_public: number | null;
  total_federal: number | null;
  national_forest: number | null;
  blm: number | null;
  other_federal: number | null;
  state_owned: number | null;
  county_municipal: number | null;
  total_private: number | null;
  private_corporate: number | null;
  private_noncorporate: number | null;
}

export interface OwnershipResponse {
  data: OwnershipRecord[];
  total_records: number;
  total_public: number;
  total_private: number;
  total_federal: number;
}

export interface OwnershipBreakdown {
  category: string;
  area: number;
  percentage: number;
}

// Trends types
export interface ForestAreaTrendRecord {
  region: string;
  subregion: string;
  state: string;
  year: number;
  area: number | null;
}

export interface ForestAreaTrendResponse {
  data: ForestAreaTrendRecord[];
  years: number[];
  total_records: number;
}

export interface TimeSeriesPoint {
  year: number;
  value: number | null;
}

export interface RegionalTrend {
  name: string;
  data: TimeSeriesPoint[];
}

// Timber types
export interface TimberVolumeRecord {
  region: string;
  subregion: string;
  state: string;
  all_timber_total: number | null;
  all_timber_softwoods: number | null;
  all_timber_hardwoods: number | null;
  growing_stock_total: number | null;
  growing_stock_softwoods: number | null;
  growing_stock_hardwoods: number | null;
  cull_total: number | null;
  cull_softwoods: number | null;
  cull_hardwoods: number | null;
  sound_dead_total: number | null;
  sound_dead_softwoods: number | null;
  sound_dead_hardwoods: number | null;
}

export interface TimberVolumeResponse {
  data: TimberVolumeRecord[];
  total_records: number;
  total_volume: number;
  softwood_volume: number;
  hardwood_volume: number;
  softwood_percent: number;
  hardwood_percent: number;
}

export interface TimberBreakdown {
  category: string;
  volume: number;
  percentage: number;
}

// Dynamics types
export interface DynamicsRecord {
  region: string;
  subregion: string | null;
  species_group: string;
  year: number;
  growth: number | null;
  mortality: number | null;
  removals: number | null;
  net_change: number | null;
}

export interface DynamicsResponse {
  data: DynamicsRecord[];
  years: number[];
  total_records: number;
}

export interface DynamicsSummary {
  year: number;
  total_growth: number;
  total_mortality: number;
  total_removals: number;
  net_change: number;
  sustainability_ratio: number;
}

export interface RegionalDynamics {
  region: string;
  growth: number;
  mortality: number;
  removals: number;
  net_change: number;
}

// Filter state
export type FilterState = {
  region?: string;
  subregion?: string;
  state?: string;
  year?: number;
  [key: string]: string | number | undefined;
}
