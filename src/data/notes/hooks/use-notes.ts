import { useQuery } from '@tanstack/react-query';
import { notesService } from '../services/notes.service';
import type { ParcelNote } from '../types';

export const NOTES_QUERY_KEY = (parcelNumber: string) =>
  ['notes', 'by-parcel', parcelNumber] as const;

const EMPTY_NOTES: ParcelNote[] = [];

export function useNotes(parcelNumber: string) {
  const query = useQuery({
    queryKey: NOTES_QUERY_KEY(parcelNumber),
    queryFn: () => notesService.getByParcelNumber(parcelNumber),
    enabled: !!parcelNumber,
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
