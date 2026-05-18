import { useQuery } from '@tanstack/react-query';
import { caseService } from '../services/case.service';

export const CASE_STATUSES_QUERY_KEY = ['cases', 'statuses'] as const;

/**
 * Returns the full list of case statuses (each with their ordered stages).
 * Swap caseService.getStatuses() for a real API call when the backend is ready.
 */
export function useCase() {
  const query = useQuery({
    queryKey: CASE_STATUSES_QUERY_KEY,
    queryFn: () => caseService.getStatuses(),
    staleTime: 1000 * 60 * 30,
    refetchInterval: false, // case status list is static — no polling needed
  });

  return {
    statuses: query.data ?? [],
    isLoading: query.isLoading,
  };
}
