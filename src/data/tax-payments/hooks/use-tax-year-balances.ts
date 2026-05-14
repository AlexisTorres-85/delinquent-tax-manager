import { useEffect, useRef, useState } from 'react';
import { taxPaymentService } from '../services/tax-payment.service';
import type { TaxYearBalance } from '../types';

type UseTaxYearBalancesResult = {
  balances: TaxYearBalance[];
  isLoading: boolean;
};

export function useTaxYearBalances(parcelNumber: string): UseTaxYearBalancesResult {
  const [balances, setBalances] = useState<TaxYearBalance[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setIsFetching(true);
    taxPaymentService.getYearBalancesByParcelNumber(parcelNumber).then((data) => {
      if (cancelled) return;
      hasLoadedRef.current = true;
      setBalances(data);
      setIsFetching(false);
    });
    return () => { cancelled = true; };
  }, [parcelNumber]);

  return {
    balances,
    isLoading: isFetching && !hasLoadedRef.current,
  };
}
