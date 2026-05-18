import { useQuery } from '@tanstack/react-query';
import { caseStageHistoryService } from '../services/case-stage-history.service';

export const CASE_STAGE_HISTORY_QUERY_KEY = (parcelNumber: string) =>
  ['case-stage-history', 'by-parcel', parcelNumber] as const;

export function useCaseStageHistory(parcelNumber: string) {
  const query = useQuery({
    queryKey: CASE_STAGE_HISTORY_QUERY_KEY(parcelNumber),
    queryFn: () => caseStageHistoryService.getByParcelNumber(parcelNumber),
    enabled: !!parcelNumber,
    staleTime: 1000 * 60 * 5,
  });

  return {
    entries: query.data ?? [],
    isLoading: query.isLoading,
    isRefreshing: query.isFetching,
    lastUpdated: query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null,
    refetch: query.refetch,
  };
}
