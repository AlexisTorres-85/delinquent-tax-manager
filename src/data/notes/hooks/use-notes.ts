import { useQuery } from '@tanstack/react-query';
import { notesService } from '../services/notes.service';
import type { InternalNote } from '../types';

export const NOTES_QUERY_KEY = (parcelId: number) =>
  ['notes', 'by-parcel', parcelId] as const;

const EMPTY_NOTES: InternalNote[] = [];

export function useNotes(parcelId: number) {
  const query = useQuery({
    queryKey: NOTES_QUERY_KEY(parcelId),
    queryFn: () => notesService.getByParcelId(parcelId),
    enabled: !!parcelId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    notes: query.data ?? EMPTY_NOTES,
    isLoading: query.isLoading,
    isRefreshing: query.isFetching,
    lastUpdated: query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null,
    refetch: query.refetch,
  };
}
