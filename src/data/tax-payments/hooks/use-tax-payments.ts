import { useCallback, useEffect, useRef, useState } from 'react';
import { taxPaymentService } from '../services/tax-payment.service';
import type { TaxPayment } from '../types';

type UseTaxPaymentsResult = {
  payments: TaxPayment[];
  isLoading: boolean;
  isRefreshing: boolean;
  lastUpdated: Date | null;
  refetch: () => void;
};

export function useTaxPayments(parcelNumber: string): UseTaxPaymentsResult {
  const [payments, setPayments] = useState<TaxPayment[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const hasLoadedRef = useRef(false);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    setIsFetching(true);
    taxPaymentService.getByParcelNumber(parcelNumber).then((data) => {
      if (cancelled) return;
      hasLoadedRef.current = true;
      setPayments(data);
      setLastUpdated(new Date());
      setIsFetching(false);
    });
    return () => { cancelled = true; };
  }, [parcelNumber, refreshKey]);

  return {
    payments,
    isLoading: isFetching && !hasLoadedRef.current,
    isRefreshing: isFetching,
    lastUpdated,
    refetch,
  };
}
