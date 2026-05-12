import { useCallback, useEffect, useRef, useState } from 'react';
import { expensesService } from '../services/expenses.service';
import type { Expense } from '../types';

export function useExpenses(parcelNumber: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const hasLoadedRef = useRef(false);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    if (!parcelNumber) return;
    setIsFetching(true);
    expensesService.getByParcelNumber(parcelNumber).then((data) => {
      hasLoadedRef.current = true;
      setExpenses(data);
      setLastUpdated(new Date());
      setIsFetching(false);
    });
  }, [parcelNumber, refreshKey]);

  return {
    expenses,
    isLoading: isFetching && !hasLoadedRef.current,
    isRefreshing: isFetching,
    lastUpdated,
    refetch,
  };
}
