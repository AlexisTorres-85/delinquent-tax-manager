export type PaymentScheduleStatus = 'Pending' | 'Paid' | 'Partial' | 'Overdue';

export type PaymentScheduleEntry = {
  id: string;
  parcelNumber: string;
  taxYear: number;
  dueDate: string;          // ISO date e.g. '2024-01-31'
  tax: number;
  interest: number;
  penalty: number;
  total: number;
  totalPaid: number;
  status: PaymentScheduleStatus;
};

/** Pre-computed summary for a parcel's entire payment plan. */
export type PaymentPlanSummary = {
  startDate: string;             // earliest dueDate (ISO)
  missedPayments: number;        // count of Overdue | Partial entries
  currentAmountDue: number;      // sum of (total - totalPaid) for unpaid entries
  monthlyPayment: number;        // currentAmountDue / number of unpaid installments
  payoffDate: string | null;     // last unpaid dueDate (ISO)
  totalPayments: number;         // sum of all totalPaid
  lastPaymentDate: string | null;// latest dueDate where totalPaid > 0
};

/** All payment plan data for one parcel: summary + individual installment entries. */
export type ParcelPaymentPlan = {
  parcelNumber: string;
  paymentPlanSummary: PaymentPlanSummary;
  paymentSchedule: PaymentScheduleEntry[];
};
