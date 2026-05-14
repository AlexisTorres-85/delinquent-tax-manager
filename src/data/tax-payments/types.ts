export type TaxPaymentType = 'Tax' | 'Redemption';

export type TaxYearBalance = {
  id: string;
  parcelNumber: string;
  taxYear: number;
  isDelinquent: boolean;
  baseTax: number;
  interest: number;
  penalty: number;
  otherCharges: number;
  specialAssessments: number;
  totalDue: number;
  totalPaid: number;
  currentDue: number;
  lastPaymentAmount: number | null;
  lastPaymentDate: string | null; // ISO date e.g. '2025-03-15'
  assessedValue: number;
};

export type TaxPayment = {
  id: string;
  parcelNumber: string;
  taxYear: number;
  paymentDate: string;            // ISO date e.g. '2024-03-15'
  certificationNumber: string;
  receipt: string;
  type: TaxPaymentType;
  amountPaid: number;

  // Expanded detail fields
  propertyTax: number;
  delinquentCharges: number;
  taxPenalty: number;
  totalPayment: number;
  specialAssessments: number;
  taxInterest: number;
  specialTaxPenalty: number;
  overPayment: number;
  paymentType: string;            // e.g. 'Check', 'Online', 'Cash', 'Money Order'
  specialCharges: number;
  specialInterest: number;
  otherCharges: number;
  receiptNumber: string;
};
