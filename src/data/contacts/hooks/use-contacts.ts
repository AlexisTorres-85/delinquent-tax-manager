import { useCallback, useEffect, useRef, useState } from 'react';
import { contactsService } from '../services/contacts.service';
import type { ParcelContact } from '../types';

export function useContacts(parcelNumber: string) {
  const [contacts, setContacts] = useState<ParcelContact[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const hasLoadedRef = useRef(false);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    if (!parcelNumber) return;
    setIsFetching(true);
    contactsService.getByParcelNumber(parcelNumber).then((data) => {
      hasLoadedRef.current = true;
      setContacts(data);
      setLastUpdated(new Date());
      setIsFetching(false);
    });
  }, [parcelNumber, refreshKey]);

  return {
    contacts,
    isLoading: isFetching && !hasLoadedRef.current,
    isRefreshing: isFetching,
    lastUpdated,
    refetch,
  };
}
