import type { ParcelStatus, ParcelStage } from '@/data/cases/case-status-definitions';
export { STAGES_BY_STATUS, type ParcelStatus, type ParcelStage } from '@/data/cases/case-status-definitions';
export type { ParcelCaseStageHistory as ParcelActiveCase } from '@/data/cases/case-stage-history/types';
export type { ParcelCase } from '@/data/cases/case-stage-history/types';

export type PaymentPlanInfo = {
  paymentPlanDescription: string;
  taxYearsCovered: string;
  monthlyAmount: number;
  numberOfPaymentsMade: number;
  planStartDate: string;
  expectedPayoffDate: string;
  expectedPayoffAmount: number;
  totalDue: number;
  lastPaymentDate: string;
};

export type ParcelFlags = {
  isBankruptcy: boolean;
  isFloodPlain: boolean;
  isInRem: boolean;
  isOutlot: boolean;
  isContaminated: boolean;
  hasHistoricalContamination: boolean;
  isDeeded: boolean;
  isEnvironmentalIssue: boolean;
  isRazingOrder: boolean;
};

export type PaymentRecord = {
  date: string;
  amount: number;
  method: 'Check' | 'Online' | 'Cash' | 'Money Order';
  receiptNo: string;
};

import type { ParcelCaseStageHistory, ParcelCase } from '@/data/cases/case-stage-history/types';
export type Parcel = {
  id: string;
  parcelNumber: string;
  ownerName: string;
  propertyAddress: string;
  municipality: string;
  amountDue: number;
  /** The active case stage history entry, or null if this parcel has no active case. */
  activeCase: ParcelCaseStageHistory | null;
  /** Tax years associated with the active case (parsed from the API). */
  caseTaxYears: number[];
  /** Full case object for the accordion grouping in the history tab. */
  activeCaseMeta: ParcelCase | null;
  /** All case stage history entries for this parcel. */
  caseStageHistory: ParcelCaseStageHistory[];
  /** Active payment plan info, or null if not in a payment plan. */
  paymentPlan: PaymentPlanInfo | null;
  /** Whether this parcel is currently in a payment plan. */
  isInPaymentPlan: boolean;
  /** Comma-separated delinquent tax years (e.g. "2023, 2024, 2025"). */
  delinquentYears: string;
  /** Total number of delinquent years. */
  totalYearsDelinquent: number;
  /** Structured flags from the database — each boolean field maps to a DB column. */
  flags: ParcelFlags;
  lastPaymentDate: string | null;
  phoneNumber: string;
  email: string;
  legalDescription: string;
  lotSize: string;
  assessedValue: number;
  paymentHistory: PaymentRecord[];
  /** Legal description fields */
  townRange?: string;
  lot?: string;
  section?: string;
  block?: string;
  gcsLegal?: string;
  researchLegal?: string;
  approvedLegal?: string;
  /** Valuation breakdown */
  landValue?: number;
  improvementValue?: number;
  /** Property physical details */
  platType?: string;
  platCode?: string;
  platDescription?: string;
  lotType?: string;
  acres?: number;
  frontageFeet?: number;
  depthFeet?: number;
  areaSquareFeet?: number;
};

/**
 * Raw parcel data as stored in the data layer.
 * `activeCase` is embedded directly in each parcel record.
 * Legacy parcels without a case have `activeCase: null` (or omitted).
 */
export type RawParcelData = Omit<Parcel, 'activeCase'> & {
  activeCase?: ParcelCaseStageHistory | null;
  /** Legacy field — kept for parcels that pre-date the case system. */
  status?: ParcelStatus;
  /** Legacy field — kept for parcels that pre-date the workflow system. */
  stage?: ParcelStage;
};

export type ParcelFilters = {
  search: string;
  status: ParcelStatus | 'all';
  minAmountDue: number;
  onlyNoPayment: boolean;
};

export const PARCEL_STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'Delinquent', label: 'Delinquent' },
  { value: 'Payment Plan', label: 'Payment Plan' },
  { value: 'Early Enforcement', label: 'Early Enforcement' },
  { value: 'Tax Deed Preparation', label: 'Tax Deed Preparation' },
  { value: 'Advertisement / Waiting', label: 'Advertisement / Waiting' },
  { value: 'Auction / Sale', label: 'Auction / Sale' },
  { value: 'Post-Deed Processing', label: 'Post-Deed Processing' },
  { value: 'Financial Processing', label: 'Financial Processing' },
  { value: 'On Hold', label: 'On Hold' },
  { value: 'Review', label: 'Review' },
  { value: 'Legal', label: 'Legal' },
] as const;

export const PARCEL_COLUMN_LABELS: Record<string, string> = {
  parcelNumber: 'Parcel #',
  ownerName: 'Owner Name',
  propertyAddress: 'Property Address',
  municipality: 'Municipality',
  activeCase: 'Status / Stage',
  totalYearsDelinquent: 'Years Delinquent',
  delinquentYears: 'Delinquent Years',
  isInPaymentPlan: 'In Payment Plan',
};

export const DEFAULT_COLUMN_VISIBILITY = {
  parcelNumber: true,
  ownerName: false,
  propertyAddress: true,
  municipality: true,
  activeCase: true,
  totalYearsDelinquent: true,
  delinquentYears: true,
  isInPaymentPlan: true,
};

export const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10 rows' },
  { value: '25', label: '25 rows' },
  { value: '50', label: '50 rows' },
] as const;
