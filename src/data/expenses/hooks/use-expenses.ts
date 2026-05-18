import { useQuery } from '@tanstack/react-query';
import { expensesService } from '../services/expenses.service';

export const EXPENSES_QUERY_KEY = (parcelNumber: string) =>
  ['expenses', 'by-parcel', parcelNumber] as const;

export function useExpenses(parcelNumber: string) {
  const query = useQuery({
    queryKey: EXPENSES_QUERY_KEY(parcelNumber),
    queryFn: () => expensesService.getByParcelNumber(parcelNumber),
    enabled: !!parcelNumber,
    staleTime: 1000 * 60 * 5,
  });

  return {
    expenses: query.data ?? [],
    isLoading: query.isLoading,
    isRefreshing: query.isFetching,
    lastUpdated: query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null,
    refetch: query.refetch,
  };
}
