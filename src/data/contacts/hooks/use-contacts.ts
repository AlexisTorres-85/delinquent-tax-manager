import { useQuery } from '@tanstack/react-query';
import { contactsService } from '../services/contacts.service';

export const CONTACTS_QUERY_KEY = (parcelId: number) =>
  ['contacts', 'by-parcel', parcelId] as const;

export function useContacts(parcelId: number) {
  const query = useQuery({
    queryKey: CONTACTS_QUERY_KEY(parcelId),
    queryFn: () => contactsService.getByParcelId(parcelId),
    enabled: !!parcelId,
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
