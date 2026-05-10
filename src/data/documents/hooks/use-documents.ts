import { useCallback, useEffect, useRef, useState } from 'react';
import { documentsService } from '../services/documents.service';
import type { ParcelDocument } from '../types';

export function useDocuments(parcelNumber: string) {
  const [documents, setDocuments] = useState<ParcelDocument[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const hasLoadedRef = useRef(false);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    if (!parcelNumber) return;
    setIsFetching(true);
    documentsService.getByParcelNumber(parcelNumber).then((data) => {
      hasLoadedRef.current = true;
      setDocuments(data);
      setLastUpdated(new Date());
      setIsFetching(false);
    });
  }, [parcelNumber, refreshKey]);

  return {
    documents,
    isLoading: isFetching && !hasLoadedRef.current,
    isRefreshing: isFetching,
    lastUpdated,
    refetch,
  };
}
