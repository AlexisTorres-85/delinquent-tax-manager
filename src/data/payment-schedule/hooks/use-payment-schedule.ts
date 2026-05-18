import { useQuery } from '@tanstack/react-query';
import { paymentScheduleService } from '../services/payment-schedule.service';

export const PAYMENT_SCHEDULE_QUERY_KEY = (parcelNumber: string, taxYears?: number[]) =>
  ['payment-schedule', 'by-parcel', parcelNumber, taxYears ?? []] as const;

export function usePaymentSchedule(parcelNumber: string, taxYears?: number[]) {
  const query = useQuery({
    queryKey: PAYMENT_SCHEDULE_QUERY_KEY(parcelNumber, taxYears),
    queryFn: () => paymentScheduleService.getByParcelNumber(parcelNumber, taxYears),
    enabled: !!parcelNumber,
    staleTime: 1000 * 60 * 5,
  });

  return {
    plan: query.data ?? null,
    isLoading: query.isLoading,
    isRefreshing: query.isFetching,
    lastUpdated: query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null,
    refetch: query.refetch,
  };
}
