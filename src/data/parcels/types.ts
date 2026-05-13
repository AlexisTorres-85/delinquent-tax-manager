import type { ParcelStatus, ParcelStage } from '@/data/workflow/workflow-status-definitions';
export { STAGES_BY_STATUS, type ParcelStatus, type ParcelStage } from '@/data/workflow/workflow-status-definitions';
export type { ParcelWorkflowEntry as ParcelActiveWorkflow } from '@/data/workflow/workflow-history/types';

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

import type { ParcelWorkflowEntry } from '@/data/workflow/workflow-history/types';
export type Parcel = {
  id: string;
  parcelNumber: string;
  ownerName: string;
  propertyAddress: string;
  municipality: string;
  amountDue: number;
  /** The active workflow entry, or null if this parcel has no active workflow. */
  activeWorkflow: ParcelWorkflowEntry | null;
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
};

/**
 * Raw parcel data as stored in the data layer.
 * `activeWorkflow` is embedded directly in each parcel record.
 * Legacy parcels without a workflow have `activeWorkflow: null` (or omitted).
 */
export type RawParcelData = Omit<Parcel, 'activeWorkflow'> & {
  activeWorkflow?: ParcelWorkflowEntry | null;
  /** Legacy field — kept for parcels that pre-date the workflow system. */
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
  taxYear: 'Tax Year',
  amountDue: 'Amount Due',
  status: 'Status / Stage',
  lastPaymentDate: 'Last Payment',
};

export const DEFAULT_COLUMN_VISIBILITY = {
  parcelNumber: true,
  ownerName: true,
  propertyAddress: true,
  taxYear: true,
  amountDue: false,
  status: true,
  lastPaymentDate: false,
};

export const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10 rows' },
  { value: '25', label: '25 rows' },
  { value: '50', label: '50 rows' },
] as const;
