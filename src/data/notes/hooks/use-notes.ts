import { useCallback, useEffect, useRef, useState } from 'react';
import { notesService } from '../services/notes.service';
import type { ParcelNote } from '../types';

export function useNotes(parcelNumber: string) {
  const [notes, setNotes] = useState<ParcelNote[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const hasLoadedRef = useRef(false);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    if (!parcelNumber) return;
    setIsFetching(true);
    notesService.getByParcelNumber(parcelNumber).then((data) => {
      hasLoadedRef.current = true;
      setNotes(data);
      setLastUpdated(new Date());
      setIsFetching(false);
    });
  }, [parcelNumber, refreshKey]);

  return {
    notes,
    isLoading: isFetching && !hasLoadedRef.current,
    isRefreshing: isFetching,
    lastUpdated,
    refetch,
  };
}
