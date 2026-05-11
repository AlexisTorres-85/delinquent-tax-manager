import type { ParcelStatus, ParcelStage } from '@/data/parcels/types';

export type { ParcelStatus as WorkflowStatus, ParcelStage as WorkflowStage };

export type WorkflowActionTaken =
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

export type ParcelWorkflowEntry = {
  id: string;
  workflowId: string;
  dateTime: string; // MM/DD/YYYY HH:mm
  status: ParcelStatus;
  stage: ParcelStage;
  actionTaken: WorkflowActionTaken;
  performedBy: string;
  documentCount: number;
  notes?: string;
  isActive: boolean;
};

export type ParcelWorkflowHistory = {
  parcelNumber: string;
  entries: ParcelWorkflowEntry[];
};
