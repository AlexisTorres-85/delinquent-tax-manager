import type { TaxPayment, TaxYearBalance } from '../types';
import { API_BASE, unwrapApiResponse } from '@/lib/api';

// Raw shape returned by GET /api/parcels/tax-payments/{parcelNumber}
interface RawTaxPayment {
  isRE: number;
  parcelNumber: string;
  taxYear: number;
  paymentType: string;
  paymentSource: string;
  paymentDate: string;        // "YYYYMMDD"; invalid: "00010101" or "01000101"
  receiptNumber: number;
  amount: number;
  generalPropertyTax: number;
  specialAssessment: number;
  specialCharge: number;
  delinquentUtilityCharge: number;
  interest: number;
  penalty: number;
  generalPropertyTaxInterest: number;
  specialTaxesInterest: number;
  generalPropertyTaxPenalty: number;
  specialTaxesPenalty: number;
  otherCharge: number;
  paymentTypeDescription: string;
  paymentSourceDescription: string;
  totalTaxes: number;
  totalInterestAndPenalties: number;
}

const INVALID_DATES = new Set(['00010101', '01000101']);

function parsePaymentDate(value: string): string | null {
  if (!value || INVALID_DATES.has(value)) return null;
  if (/^\d{8}$/.test(value)) {
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  }
  return value;
}

function mapPayment(raw: RawTaxPayment): TaxPayment {
  return {
    parcelNumber: raw.parcelNumber,
    taxYear: raw.taxYear,
    paymentType: raw.paymentType,
    paymentSource: raw.paymentSource,
    paymentDate: parsePaymentDate(raw.paymentDate),
    receiptNumber: raw.receiptNumber,
    amount: raw.amount,
    generalPropertyTax: raw.generalPropertyTax,
    specialAssessment: raw.specialAssessment,
    specialCharge: raw.specialCharge,
    delinquentUtilityCharge: raw.delinquentUtilityCharge,
    interest: raw.interest,
    penalty: raw.penalty,
    generalPropertyTaxInterest: raw.generalPropertyTaxInterest,
    specialTaxesInterest: raw.specialTaxesInterest,
    generalPropertyTaxPenalty: raw.generalPropertyTaxPenalty,
    specialTaxesPenalty: raw.specialTaxesPenalty,
    otherCharge: raw.otherCharge,
    paymentTypeDescription: raw.paymentTypeDescription,
    paymentSourceDescription: raw.paymentSourceDescription,
    totalTaxes: raw.totalTaxes,
    totalInterestAndPenalties: raw.totalInterestAndPenalties,
  };
}

// Raw shape returned by GET /api/parcels/tax-breakdown/{parcelNumber}
interface RawTaxYearBalance {
  taxYear: number;
  isDelinquent: boolean;
  hasBalanceDue: boolean;
  paymentStatus: string;
  baseTax: number;
  interest: number;
  penalty: number;
  otherCharges: number;
  specialAssessments: number;
  totalDue: number;
  totalPaid: number;
  currentDue: number;
  lastPayment: number | null;
  lastPaidOn: string | null; // "YYYYMMDD" or null
}

interface RawTaxBreakdownResponse {
  taxYears: RawTaxYearBalance[];
  totalDue: number;
  yearsWithBalance: number;
  delinquentYears: number;
}

export interface TaxBreakdownResult {
  balances: import('../types').TaxYearBalance[];
  totalDue: number;
}

function parseLastPaidOn(value: string | null): string | null {
  if (!value) return null;
  if (/^\d{8}$/.test(value)) {
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  }
  return value;
}

function mapBalance(raw: RawTaxYearBalance): TaxYearBalance {
  return {
    taxYear: raw.taxYear,
    isDelinquent: raw.isDelinquent,
    hasBalanceDue: raw.hasBalanceDue,
    paymentStatus: raw.paymentStatus,
    baseTax: raw.baseTax,
    interest: raw.interest,
    penalty: raw.penalty,
    otherCharges: raw.otherCharges,
    specialAssessments: raw.specialAssessments,
    totalDue: raw.totalDue,
    totalPaid: raw.totalPaid,
    currentDue: raw.currentDue,
    lastPaymentAmount: raw.lastPayment,
    lastPaymentDate: parseLastPaidOn(raw.lastPaidOn),
  };
}

export const taxPaymentService = {
  /**
   * Fetch all tax payments for a given parcel number.
   * GET /api/parcels/tax-payments/{parcelNumber}?taxYears=...
   */
  async getByParcelNumber(parcelNumber: string, taxYears?: number[]): Promise<TaxPayment[]> {
    const url = new URL(`${API_BASE}/api/parcels/tax-payments/${encodeURIComponent(parcelNumber)}`);
    if (taxYears && taxYears.length > 0) {
      url.searchParams.set('taxYears', taxYears.join(','));
    }
    const res = await fetch(url.toString());
    const data = await unwrapApiResponse<RawTaxPayment[]>(res);
    return data.map(mapPayment);
  },

  /**
   * Fetch per-year balance summaries for a given parcel number.
   * GET /api/parcels/tax-breakdown/{parcelNumber}?taxYears=2022,2023,...
   */
  async getYearBalancesByParcelNumber(parcelNumber: string, taxYears?: number[]): Promise<TaxBreakdownResult> {
    const url = new URL(`${API_BASE}/api/parcels/tax-breakdown/${encodeURIComponent(parcelNumber)}`);
    if (taxYears && taxYears.length > 0) {
      url.searchParams.set('taxYears', taxYears.join(','));
    }
    const res = await fetch(url.toString());
    const data = await unwrapApiResponse<RawTaxBreakdownResponse>(res);
    return {
      balances: data.taxYears.map(mapBalance).sort((a, b) => b.taxYear - a.taxYear),
      totalDue: data.totalDue,
    };
  },
};
