import { useCallback, useEffect, useRef, useState } from 'react';
import { paymentScheduleService } from '../services/payment-schedule.service';
import type { ParcelPaymentPlan } from '../types';

type UsePaymentScheduleResult = {
  plan: ParcelPaymentPlan | null;
  isLoading: boolean;
  isRefreshing: boolean;
  lastUpdated: Date | null;
  refetch: () => void;
};

export function usePaymentSchedule(parcelNumber: string): UsePaymentScheduleResult {
  const [plan, setPlan] = useState<ParcelPaymentPlan | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const hasLoadedRef = useRef(false);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    setIsFetching(true);
    paymentScheduleService.getByParcelNumber(parcelNumber).then((data) => {
      if (cancelled) return;
      hasLoadedRef.current = true;
      setPlan(data);
      setLastUpdated(new Date());
      setIsFetching(false);
    });
    return () => { cancelled = true; };
  }, [parcelNumber, refreshKey]);

  return {
    plan,
    isLoading: isFetching && !hasLoadedRef.current,
    isRefreshing: isFetching,
    lastUpdated,
    refetch,
  };
}
