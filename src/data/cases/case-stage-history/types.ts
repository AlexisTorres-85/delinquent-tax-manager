import type { ParcelStatus, ParcelStage } from '@/data/parcels/types';

export type { ParcelStatus as CaseStatus, ParcelStage as CaseStage };

/**
 * ParcelCase — the active case for a parcel.
 * Tracks tax years, active/closed state, and a pointer to the current history entry.
 */
export type ParcelCase = {
  caseId: string;
  parcelNumber: string;
  taxYears: number[];
  activeCaseStageHistoryId: string | null;
  isActive: boolean;
};

export type CaseActionTaken =
  | 'Case Opened'
  | 'Stage Advanced'
  | 'Status Changed'
  | 'Notice Sent'
  | 'Document Uploaded'
  | 'Payment Received'
  | 'Title Search Completed'
  | 'Lien Filed'
  | 'Court Filing Submitted'
  | 'Deed Prepared'
  | 'Deed Submitted'
  | 'Auction Scheduled'
  | 'Contact Updated'
  | 'Note Added'
  | 'Hold Applied'
  | 'Hold Released'
  | 'Case Closed';

export type ParcelCaseStageHistory = {
  id: string;
  caseId: string;
  dateTime: string; // MM/DD/YYYY HH:mm
  status: ParcelStatus;
  stage: ParcelStage;
  actionTaken: CaseActionTaken;
  performedBy: string;
  documentCount: number;
  notes?: string;
  isActive: boolean;
};

export type ParcelCaseStageHistoryRecord = {
  parcelNumber: string;
  entries: ParcelCaseStageHistory[];
};

