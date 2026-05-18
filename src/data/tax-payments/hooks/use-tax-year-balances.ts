import { useQuery } from '@tanstack/react-query';
import { taxPaymentService } from '../services/tax-payment.service';

export const TAX_YEAR_BALANCES_QUERY_KEY = (parcelNumber: string, taxYears?: number[]) =>
  ['tax-payments', 'balances', parcelNumber, taxYears ?? []] as const;

export function useTaxYearBalances(parcelNumber: string, taxYears?: number[]) {
  const query = useQuery({
    queryKey: TAX_YEAR_BALANCES_QUERY_KEY(parcelNumber, taxYears),
    queryFn: () => taxPaymentService.getYearBalancesByParcelNumber(parcelNumber, taxYears),
    enabled: !!parcelNumber,
    staleTime: 1000 * 60 * 5,
  });

  return {
    balances: query.data?.balances ?? [],
    totalDue: query.data?.totalDue ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
