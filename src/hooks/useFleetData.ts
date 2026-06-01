import { useQuery } from '@tanstack/react-query';
import { fetchVehicles } from '../services/api';
import { processFleetData } from '../services/dataProcessor';
import type { FleetData } from '../types/fleet';

export function useFleetData() {
  return useQuery<FleetData>({
    queryKey: ['fleetData'],
    queryFn: async () => {
      const vehicles = await fetchVehicles();
      return processFleetData(vehicles);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
