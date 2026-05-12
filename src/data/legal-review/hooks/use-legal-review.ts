import { useCallback, useEffect, useRef, useState } from 'react';
import { legalReviewService } from '../services/legal-review.service';
import type { LegalReview } from '../types';

export function useLegalReview(parcelNumber: string) {
  const [reviews, setReviews] = useState<LegalReview[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const hasLoadedRef = useRef(false);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    if (!parcelNumber) return;
    setIsFetching(true);
    legalReviewService.getByParcelNumber(parcelNumber).then((data) => {
      hasLoadedRef.current = true;
      setReviews(data);
      setLastUpdated(new Date());
      setIsFetching(false);
    });
  }, [parcelNumber, refreshKey]);

  return {
    reviews,
    isLoading: isFetching && !hasLoadedRef.current,
    isRefreshing: isFetching,
    lastUpdated,
    refetch,
  };
}
