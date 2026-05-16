import type { ParcelPaymentPlan, PaymentScheduleEntry, ApiPaymentScheduleEntry } from '../types';
import { apiFetch, API_BASE } from '@/lib/api';

function mapEntry(raw: ApiPaymentScheduleEntry): PaymentScheduleEntry {
  const VALID_STATUSES = new Set(['Pending', 'Paid', 'Partial', 'Overdue']);
  return {
    id: String(raw.id),
    parcelNumber: raw.parcelNumber,
    taxYear: raw.taxYear,
    dueDate: raw.dueDate,
    tax: raw.tax,
    interest: raw.interest,
    penalty: raw.penalty,
    total: raw.total,
    totalPaid: raw.totalPaid,
    status: (VALID_STATUSES.has(raw.status) ? raw.status : 'Pending') as PaymentScheduleEntry['status'],
  };
}

function computeSummary(entries: PaymentScheduleEntry[]): ParcelPaymentPlan['paymentPlanSummary'] {
  const sorted = [...entries].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const unpaid = sorted.filter((e) => e.status !== 'Paid');
  const paid = sorted.filter((e) => e.totalPaid > 0);

  const currentAmountDue = unpaid.reduce((sum, e) => sum + (e.total - e.totalPaid), 0);
  const missedPayments = entries.filter((e) => e.status === 'Overdue' || e.status === 'Partial').length;
  const totalPayments = entries.reduce((sum, e) => sum + e.totalPaid, 0);
  const monthlyPayment = unpaid.length > 0 ? currentAmountDue / unpaid.length : 0;

  return {
    startDate: sorted[0]?.dueDate ?? '',
    payoffDate: unpaid[unpaid.length - 1]?.dueDate ?? null,
    lastPaymentDate: paid[paid.length - 1]?.dueDate ?? null,
    missedPayments,
    currentAmountDue,
    totalPayments,
    monthlyPayment,
  };
}

export const paymentScheduleService = {
  async getByParcelNumber(parcelNumber: string, taxYears?: number[]): Promise<ParcelPaymentPlan | null> {
    if (!parcelNumber || !taxYears?.length) return null;

    const params = new URLSearchParams({ taxYears: taxYears.join(',') });
    const raw = await apiFetch<ApiPaymentScheduleEntry[]>(
      `${API_BASE}/api/parcels/${encodeURIComponent(parcelNumber)}/payment-plan-schedule?${params}`,
    );

    const entries = (raw ?? []).map(mapEntry);
    return {
      parcelNumber,
      paymentSchedule: entries,
      paymentPlanSummary: computeSummary(entries),
    };
  },
};
