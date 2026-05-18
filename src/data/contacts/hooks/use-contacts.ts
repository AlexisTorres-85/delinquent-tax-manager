import { useQuery } from '@tanstack/react-query';
import { contactsService } from '../services/contacts.service';

export const CONTACTS_QUERY_KEY = (parcelNumber: string) =>
  ['contacts', 'by-parcel', parcelNumber] as const;

export function useContacts(parcelNumber: string) {
  const query = useQuery({
    queryKey: CONTACTS_QUERY_KEY(parcelNumber),
    queryFn: () => contactsService.getByParcelNumber(parcelNumber),
    enabled: !!parcelNumber,
    staleTime: 1000 * 60 * 5,
  });

  return {
    contacts: query.data ?? [],
    isLoading: query.isLoading,
    isRefreshing: query.isFetching,
    lastUpdated: query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null,
    refetch: query.refetch,
  };
}
