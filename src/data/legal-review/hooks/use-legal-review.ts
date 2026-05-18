import { useQuery } from '@tanstack/react-query';
import { legalReviewService } from '../services/legal-review.service';

export const LEGAL_REVIEW_QUERY_KEY = (parcelNumber: string) =>
  ['legal-review', 'by-parcel', parcelNumber] as const;

export function useLegalReview(parcelNumber: string) {
  const query = useQuery({
    queryKey: LEGAL_REVIEW_QUERY_KEY(parcelNumber),
    queryFn: () => legalReviewService.getByParcelNumber(parcelNumber),
    enabled: !!parcelNumber,
    staleTime: 1000 * 60 * 5,
  });

  return {
    reviews: query.data ?? [],
    isLoading: query.isLoading,
    isRefreshing: query.isFetching,
    lastUpdated: query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null,
    refetch: query.refetch,
  };
}
