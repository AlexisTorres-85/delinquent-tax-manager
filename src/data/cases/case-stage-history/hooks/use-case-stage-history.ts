import { useCallback, useEffect, useRef, useState } from 'react';
import { caseStageHistoryService } from '../services/case-stage-history.service';
import type { ParcelCaseStageHistory } from '../types';

export function useCaseStageHistory(parcelNumber: string) {
  const [entries, setEntries] = useState<ParcelCaseStageHistory[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const hasLoadedRef = useRef(false);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    if (!parcelNumber) return;
    setIsFetching(true);
    caseStageHistoryService.getByParcelNumber(parcelNumber).then((data) => {
      hasLoadedRef.current = true;
      setEntries(data);
      setLastUpdated(new Date());
      setIsFetching(false);
    });
  }, [parcelNumber, refreshKey]);

  return {
    entries,
    isLoading: isFetching && !hasLoadedRef.current,
    isRefreshing: isFetching,
    lastUpdated,
    refetch,
  };
}
