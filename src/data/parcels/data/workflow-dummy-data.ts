import type { ParcelStatus, ParcelStage } from '../types';

/**
 * WorkflowStatusRecord — represents a row from the `workflow_statuses` table.
 * WorkflowStageRecord  — represents a row from the `workflow_stages` table (FK → status).
 *
 * Replace the service implementation (workflow.service.ts) when the real API is ready.
 * The hook and UI components need no changes.
 */
export type WorkflowStageRecord = {
  id: string;
  name: ParcelStage;
  sortOrder: number;
};

export type WorkflowStatusRecord = {
  id: string;
  name: ParcelStatus;
  sortOrder: number;
  stages: WorkflowStageRecord[];
};

export const WORKFLOW_DUMMY_DATA: WorkflowStatusRecord[] = [
  {
    id: 'status-01',
    name: 'Delinquent',
    sortOrder: 1,
    stages: [
      { id: 'stage-01-01', name: 'Initial Delinquency',         sortOrder: 1 },
      { id: 'stage-01-02', name: 'Early Notice Issued',         sortOrder: 2 },
      { id: 'stage-01-03', name: 'Final Notice Issued',         sortOrder: 3 },
      { id: 'stage-01-04', name: 'Letter Rpt Expiration',       sortOrder: 4 },
      { id: 'stage-01-05', name: '90-Day Expiration Window',    sortOrder: 5 },
      { id: 'stage-01-06', name: 'Pre-Enforcement Review',      sortOrder: 6 },
      { id: 'stage-01-07', name: 'Escalation Ready',            sortOrder: 7 },
    ],
  },
  {
    id: 'status-02',
    name: 'Payment Plan',
    sortOrder: 2,
    stages: [
      { id: 'stage-02-01', name: 'In Payment Plan',             sortOrder: 1 },
      { id: 'stage-02-02', name: 'Payment Plan Letter Sent',    sortOrder: 2 },
    ],
  },
  {
    id: 'status-03',
    name: 'Early Enforcement',
    sortOrder: 3,
    stages: [
      { id: 'stage-03-01', name: 'Title Search',                sortOrder: 1 },
      { id: 'stage-03-02', name: 'Notice of Tax Deed App',      sortOrder: 2 },
      { id: 'stage-03-03', name: 'Letter of Affidavit',         sortOrder: 3 },
      { id: 'stage-03-04', name: 'Owner/Occupant Notification', sortOrder: 4 },
      { id: 'stage-03-05', name: 'Utility Notification',        sortOrder: 5 },
    ],
  },
  {
    id: 'status-04',
    name: 'Tax Deed Preparation',
    sortOrder: 4,
    stages: [
      { id: 'stage-04-01', name: 'Prepare Tax Deed',                          sortOrder: 1 },
      { id: 'stage-04-02', name: 'Create Tax Deed Verify & Taxes Form',       sortOrder: 2 },
      { id: 'stage-04-03', name: 'Finalize Tax Deed Verify & Taxes Form',     sortOrder: 3 },
      { id: 'stage-04-04', name: 'Create County Clerk Memo',                  sortOrder: 4 },
      { id: 'stage-04-05', name: 'Submit to County Clerk',                    sortOrder: 5 },
      { id: 'stage-04-06', name: 'Submit to P&D',                             sortOrder: 6 },
      { id: 'stage-04-07', name: 'Treasurer Review',                          sortOrder: 7 },
      { id: 'stage-04-08', name: 'Finance Committee Review',                  sortOrder: 8 },
    ],
  },
  {
    id: 'status-05',
    name: 'Advertisement / Waiting',
    sortOrder: 5,
    stages: [
      { id: 'stage-05-01', name: 'Advertise Tax Deed',           sortOrder: 1 },
      { id: 'stage-05-02', name: 'Post Advertisement Wait Period', sortOrder: 2 },
    ],
  },
  {
    id: 'status-06',
    name: 'Auction / Sale',
    sortOrder: 6,
    stages: [
      { id: 'stage-06-01', name: 'Send to Auction',              sortOrder: 1 },
      { id: 'stage-06-02', name: 'Finalize Sale',                sortOrder: 2 },
      { id: 'stage-06-03', name: 'Over the Counter Sales',       sortOrder: 3 },
    ],
  },
  {
    id: 'status-07',
    name: 'Post-Deed Processing',
    sortOrder: 7,
    stages: [
      { id: 'stage-07-01', name: 'Complete Tax Deed',            sortOrder: 1 },
      { id: 'stage-07-02', name: 'County Tax Deed',              sortOrder: 2 },
      { id: 'stage-07-03', name: 'Eviction Proceedings',         sortOrder: 3 },
      { id: 'stage-07-04', name: 'Quit Claim',                   sortOrder: 4 },
    ],
  },
  {
    id: 'status-08',
    name: 'Financial Processing',
    sortOrder: 8,
    stages: [
      { id: 'stage-08-01', name: 'Finance Journal Entry',        sortOrder: 1 },
      { id: 'stage-08-02', name: 'Proceeds Notice',              sortOrder: 2 },
      { id: 'stage-08-03', name: 'Proceeds Affidavit Returned',  sortOrder: 3 },
      { id: 'stage-08-04', name: 'Proceeds Check Issued',        sortOrder: 4 },
    ],
  },
  {
    id: 'status-09',
    name: 'On Hold',
    sortOrder: 9,
    stages: [
      { id: 'stage-09-01', name: 'Bankruptcy',               sortOrder: 1 },
      { id: 'stage-09-02', name: 'Litigation / Legal Hold',  sortOrder: 2 },
      { id: 'stage-09-03', name: 'Appeal Pending',           sortOrder: 3 },
      { id: 'stage-09-04', name: 'Estate / Probate',         sortOrder: 4 },
      { id: 'stage-09-05', name: 'Administrative Review',    sortOrder: 5 },
      { id: 'stage-09-06', name: 'Hardship Review',          sortOrder: 6 },
    ],
  },
  {
    id: 'status-10',
    name: 'Complete',
    sortOrder: 10,
    stages: [
      { id: 'stage-10-01', name: 'Paid in Full',                  sortOrder: 1 },
      { id: 'stage-10-02', name: 'Move to Treasurer',             sortOrder: 2 },
    ],
  },
  {
    id: 'status-11',
    name: 'Review',
    sortOrder: 11,
    stages: [
      { id: 'stage-11-01', name: 'Legal Description Review',      sortOrder: 1 },
      { id: 'stage-11-02', name: 'Legal Description Correction',  sortOrder: 2 },
      { id: 'stage-11-03', name: 'Awaiting Legal Description',    sortOrder: 3 },
    ],
  },
  {
    id: 'status-12',
    name: 'Legal',
    sortOrder: 12,
    stages: [
      { id: 'stage-12-01', name: 'Legal Description Verification', sortOrder: 1 },
    ],
  },
];
