import { useQuery } from '@tanstack/react-query';
import { documentsService } from '../services/documents.service';

export const DOCUMENTS_QUERY_KEY = (parcelNumber: string) =>
  ['documents', 'by-parcel', parcelNumber] as const;

export function useDocuments(parcelNumber: string) {
  const query = useQuery({
    queryKey: DOCUMENTS_QUERY_KEY(parcelNumber),
    queryFn: () => documentsService.getByParcelNumber(parcelNumber),
    enabled: !!parcelNumber,
    staleTime: 1000 * 60 * 5,
  });

  return {
    documents: query.data ?? [],
    isLoading: query.isLoading,
    isRefreshing: query.isFetching,
    lastUpdated: query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null,
    refetch: query.refetch,
  };
}
