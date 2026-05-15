import { useEffect, useRef, useState } from 'react';
import { taxPaymentService } from '../services/tax-payment.service';
import type { TaxYearBalance } from '../types';

type UseTaxYearBalancesResult = {
  balances: TaxYearBalance[];
  totalDue: number;
  isLoading: boolean;
  isError: boolean;
};

export function useTaxYearBalances(parcelNumber: string, taxYears?: number[]): UseTaxYearBalancesResult {
  const [balances, setBalances] = useState<TaxYearBalance[]>([]);
  const [totalDue, setTotalDue] = useState(0);
  const [isFetching, setIsFetching] = useState(true);
  const [isError, setIsError] = useState(false);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setIsFetching(true);
    setIsError(false);
    taxPaymentService.getYearBalancesByParcelNumber(parcelNumber, taxYears).then((result) => {
      if (cancelled) return;
      hasLoadedRef.current = true;
      setBalances(result.balances);
      setTotalDue(result.totalDue);
      setIsFetching(false);
    }).catch(() => {
      if (cancelled) return;
      hasLoadedRef.current = true;
      setIsError(true);
      setIsFetching(false);
    });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parcelNumber, taxYears?.join(',')]);

  return {
    balances,
    totalDue,
    isLoading: isFetching && !hasLoadedRef.current,
    isError,
  };
}
