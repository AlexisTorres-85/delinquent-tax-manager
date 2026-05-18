import { useQuery } from '@tanstack/react-query';
import { taxPaymentService } from '../services/tax-payment.service';

export const TAX_PAYMENTS_QUERY_KEY = (parcelNumber: string, taxYears?: number[]) =>
  ['tax-payments', 'by-parcel', parcelNumber, taxYears ?? []] as const;

export function useTaxPayments(parcelNumber: string, taxYears?: number[]) {
  const query = useQuery({
    queryKey: TAX_PAYMENTS_QUERY_KEY(parcelNumber, taxYears),
    queryFn: () => taxPaymentService.getByParcelNumber(parcelNumber, taxYears),
    enabled: !!parcelNumber,
    staleTime: 1000 * 60 * 5,
  });

  return {
    payments: query.data ?? [],
    isLoading: query.isLoading,
    isRefreshing: query.isFetching,
    lastUpdated: query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null,
    refetch: query.refetch,
  };
}
