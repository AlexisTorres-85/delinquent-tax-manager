export type ParcelStatus =
  | 'Delinquent'
  | 'Payment Plan'
  | 'Early Enforcement'
  | 'Tax Deed Preparation'
  | 'Advertisement / Waiting'
  | 'Auction / Sale'
  | 'Post-Deed Processing'
  | 'Financial Processing'
  | 'On Hold'
  | 'Review'
  | 'Legal'
  | 'Complete';

export type ParcelStage =
  // Delinquent
  | 'Initial Delinquency'
  | 'Early Notice Issued'
  | 'Final Notice Issued'
  | 'Letter Rpt Expiration'
  | '90-Day Expiration Window'
  | 'Pre-Enforcement Review'
  | 'Escalation Ready'
  // Payment Plan
  | 'In Payment Plan'
  | 'Payment Plan Letter Sent'
  // Early Enforcement
  | 'Title Search'
  | 'Notice of Tax Deed App'
  | 'Letter of Affidavit'
  | 'Owner/Occupant Notification'
  | 'Utility Notification'
  // Tax Deed Preparation
  | 'Prepare Tax Deed'
  | 'Create Tax Deed Verify & Taxes Form'
  | 'Finalize Tax Deed Verify & Taxes Form'
  | 'Create County Clerk Memo'
  | 'Submit to County Clerk'
  | 'Submit to P&D'
  | 'Treasurer Review'
  | 'Finance Committee Review'
  // Advertisement / Waiting
  | 'Advertise Tax Deed'
  | 'Post Advertisement Wait Period'
  // Auction / Sale
  | 'Send to Auction'
  | 'Finalize Sale'
  | 'Over the Counter Sales'
  // Post-Deed Processing
  | 'Complete Tax Deed'
  | 'County Tax Deed'
  | 'Eviction Proceedings'
  | 'Quit Claim'
  // Financial Processing
  | 'Finance Journal Entry'
  | 'Proceeds Notice'
  | 'Proceeds Affidavit Returned'
  | 'Proceeds Check Issued'
  // Review
  | 'Legal Description Review'
  | 'Legal Description Correction'
  | 'Awaiting Legal Description'
  // Legal
  | 'Legal Description Verification'
  // Exceptions / Holds
  | 'Bankruptcy'
  | 'Litigation / Legal Hold'
  | 'Appeal Pending'
  | 'Estate / Probate'
  | 'Administrative Review'
  | 'Hardship Review'
  // Complete
  | 'Paid in Full'
  | 'Move to Treasurer';

export const STAGES_BY_STATUS: Record<ParcelStatus, ParcelStage[]> = {
  'Delinquent': ['Initial Delinquency', 'Early Notice Issued', 'Final Notice Issued', 'Letter Rpt Expiration', '90-Day Expiration Window', 'Pre-Enforcement Review', 'Escalation Ready'],
  'Payment Plan': ['In Payment Plan', 'Payment Plan Letter Sent'],
  'Early Enforcement': ['Title Search', 'Notice of Tax Deed App', 'Letter of Affidavit', 'Owner/Occupant Notification', 'Utility Notification'],
  'Tax Deed Preparation': ['Prepare Tax Deed', 'Create Tax Deed Verify & Taxes Form', 'Finalize Tax Deed Verify & Taxes Form', 'Create County Clerk Memo', 'Submit to County Clerk', 'Submit to P&D', 'Treasurer Review', 'Finance Committee Review'],
  'Advertisement / Waiting': ['Advertise Tax Deed', 'Post Advertisement Wait Period'],
  'Auction / Sale': ['Send to Auction', 'Finalize Sale', 'Over the Counter Sales'],
  'Post-Deed Processing': ['Complete Tax Deed', 'County Tax Deed', 'Eviction Proceedings', 'Quit Claim'],
  'Financial Processing': ['Finance Journal Entry', 'Proceeds Notice', 'Proceeds Affidavit Returned', 'Proceeds Check Issued'],
  'On Hold': ['Bankruptcy', 'Litigation / Legal Hold', 'Appeal Pending', 'Estate / Probate', 'Administrative Review', 'Hardship Review'],
  'Review': ['Legal Description Review', 'Legal Description Correction', 'Awaiting Legal Description'],
  'Legal': ['Legal Description Verification'],
  'Complete': ['Paid in Full', 'Move to Treasurer'],
};

export type ParcelFlag = 'Foreclosure' | 'Deeded' | 'Contaminated' | 'Bankruptcy' | 'Flood Plain' | 'In Rem' | 'Razing' | 'Outlot';

export type PaymentRecord = {
  date: string;
  amount: number;
  method: 'Check' | 'Online' | 'Cash' | 'Money Order';
  receiptNo: string;
};

export type Parcel = {
  id: string;
  parcelNumber: string;
  ownerName: string;
  propertyAddress: string;
  taxYears: number[];
  municipality: string;
  amountDue: number;
  status: ParcelStatus;
  stage: ParcelStage;
  flags: ParcelFlag[];
  lastPaymentDate: string | null;
  phoneNumber: string;
  email: string;
  legalDescription: string;
  lotSize: string;
  assessedValue: number;
  paymentHistory: PaymentRecord[];
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
] as const;

export const PARCEL_COLUMN_LABELS: Record<string, string> = {
  parcelNumber: 'Parcel #',
  ownerName: 'Owner Name',
  propertyAddress: 'Property Address',
  taxYears: 'Tax Years',
  amountDue: 'Amount Due',
  status: 'Status / Stage',
  lastPaymentDate: 'Last Payment',
};

export const DEFAULT_COLUMN_VISIBILITY = {
  parcelNumber: true,
  ownerName: true,
  propertyAddress: true,
  taxYears: false,
  amountDue: false,
  status: true,
  lastPaymentDate: false,
};

export const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10 rows' },
  { value: '25', label: '25 rows' },
  { value: '50', label: '50 rows' },
] as const;
