import { useCallback, useEffect, useRef, useState } from 'react';
import { workflowHistoryService } from '../services/workflow-history.service';
import type { ParcelWorkflowEntry } from '../types';

export function useWorkflowHistory(parcelNumber: string) {
  const [entries, setEntries] = useState<ParcelWorkflowEntry[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const hasLoadedRef = useRef(false);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    if (!parcelNumber) return;
    setIsFetching(true);
    workflowHistoryService.getByParcelNumber(parcelNumber).then((data) => {
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
