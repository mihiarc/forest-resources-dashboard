'use client';

import { useQuery } from '@tanstack/react-query';
import * as api from '@/lib/api';
import type { FilterState } from '@/lib/types';

// Filter hooks
export function useRegions() {
  return useQuery({
    queryKey: ['regions'],
    queryFn: api.getRegions,
  });
}

export function useStates(region?: string, subregion?: string) {
  return useQuery({
    queryKey: ['states', region, subregion],
    queryFn: () => api.getStates(region, subregion),
  });
}

export function useYears() {
  return useQuery({
    queryKey: ['years'],
    queryFn: api.getYears,
  });
}

// Land Area hooks
export function useLandArea(filters?: FilterState) {
  return useQuery({
    queryKey: ['land-area', filters],
    queryFn: () => api.getLandArea(filters),
  });
}

export function useLandAreaByRegion() {
  return useQuery({
    queryKey: ['land-area-by-region'],
    queryFn: api.getLandAreaByRegion,
  });
}

export function useLandAreaByState(region?: string) {
  return useQuery({
    queryKey: ['land-area-by-state', region],
    queryFn: () => api.getLandAreaByState(region),
  });
}

// Ownership hooks
export function useOwnership(filters?: FilterState) {
  return useQuery({
    queryKey: ['ownership', filters],
    queryFn: () => api.getOwnership(filters),
  });
}

export function useOwnershipBreakdown(region?: string) {
  return useQuery({
    queryKey: ['ownership-breakdown', region],
    queryFn: () => api.getOwnershipBreakdown(region),
  });
}

export function useOwnershipByRegion() {
  return useQuery({
    queryKey: ['ownership-by-region'],
    queryFn: api.getOwnershipByRegion,
  });
}

// Trends hooks
export function useForestAreaTrends(filters?: FilterState) {
  return useQuery({
    queryKey: ['forest-area-trends', filters],
    queryFn: () => api.getForestAreaTrends(filters),
  });
}

export function useNationalForestAreaTrend() {
  return useQuery({
    queryKey: ['national-forest-area-trend'],
    queryFn: api.getNationalForestAreaTrend,
  });
}

export function useForestAreaByRegion() {
  return useQuery({
    queryKey: ['forest-area-by-region'],
    queryFn: api.getForestAreaByRegion,
  });
}

// Timber hooks
export function useTimberVolume(filters?: FilterState) {
  return useQuery({
    queryKey: ['timber-volume', filters],
    queryFn: () => api.getTimberVolume(filters),
  });
}

export function useTimberBreakdown(region?: string) {
  return useQuery({
    queryKey: ['timber-breakdown', region],
    queryFn: () => api.getTimberBreakdown(region),
  });
}

export function useTimberByRegion() {
  return useQuery({
    queryKey: ['timber-by-region'],
    queryFn: api.getTimberByRegion,
  });
}

export function useTimberByState(region?: string) {
  return useQuery({
    queryKey: ['timber-by-state', region],
    queryFn: () => api.getTimberByState(region),
  });
}

// Dynamics hooks
export function useDynamics(filters?: FilterState & { species?: string }) {
  return useQuery({
    queryKey: ['dynamics', filters],
    queryFn: () => api.getDynamics(filters),
  });
}

export function useDynamicsSummary(year?: number) {
  return useQuery({
    queryKey: ['dynamics-summary', year],
    queryFn: () => api.getDynamicsSummary(year),
  });
}

export function useDynamicsByRegion(year?: number, species?: string) {
  return useQuery({
    queryKey: ['dynamics-by-region', year, species],
    queryFn: () => api.getDynamicsByRegion(year, species),
  });
}
