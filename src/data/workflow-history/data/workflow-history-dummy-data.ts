import type { ParcelWorkflowHistory } from '../types';

export const WORKFLOW_HISTORY_DUMMY_DATA: ParcelWorkflowHistory[] = [
  {
    parcelNumber: '01-122-01-101-001',
    entries: [
      { id: 'wh-0001', workflowId: 'WF-2022-001', dateTime: '01/15/2022 08:32', status: 'Delinquent', stage: 'Initial Delinquency', actionTaken: 'Case Opened', performedBy: 'J. Martinez', documentCount: 1, isActive: false },
      { id: 'wh-0002', workflowId: 'WF-2022-001', dateTime: '02/03/2022 10:14', status: 'Delinquent', stage: 'Early Notice Issued', actionTaken: 'Notice Sent', performedBy: 'J. Martinez', documentCount: 2, isActive: false },
      { id: 'wh-0003', workflowId: 'WF-2022-001', dateTime: '04/11/2022 09:47', status: 'Delinquent', stage: 'Final Notice Issued', actionTaken: 'Notice Sent', performedBy: 'S. Kowalski', documentCount: 3, isActive: false },
      { id: 'wh-0004', workflowId: 'WF-2022-001', dateTime: '07/01/2022 11:05', status: 'Delinquent', stage: 'Pre-Enforcement Review', actionTaken: 'Stage Advanced', performedBy: 'T. Williams', documentCount: 1, isActive: false },
      { id: 'wh-0005', workflowId: 'WF-2022-001', dateTime: '08/22/2022 14:30', status: 'Payment Plan', stage: 'In Payment Plan', actionTaken: 'Status Changed', performedBy: 'R. Patel', documentCount: 4, notes: 'Owner agreed to 12-month payment plan.', isActive: false },
      { id: 'wh-0006', workflowId: 'WF-2022-001', dateTime: '09/05/2022 09:15', status: 'Payment Plan', stage: 'Payment Plan Letter Sent', actionTaken: 'Notice Sent', performedBy: 'R. Patel', documentCount: 2, isActive: false },
      { id: 'wh-0007', workflowId: 'WF-2022-001', dateTime: '11/14/2022 16:00', status: 'Early Enforcement', stage: 'Title Search', actionTaken: 'Title Search Completed', performedBy: 'A. Chen', documentCount: 5, isActive: false },
      { id: 'wh-0008', workflowId: 'WF-2022-001', dateTime: '12/08/2022 10:45', status: 'Early Enforcement', stage: 'Notice of Tax Deed App', actionTaken: 'Court Filing Submitted', performedBy: 'A. Chen', documentCount: 3, isActive: false },
      { id: 'wh-0009', workflowId: 'WF-2022-001', dateTime: '02/20/2023 13:22', status: 'Tax Deed Preparation', stage: 'Prepare Tax Deed', actionTaken: 'Deed Prepared', performedBy: 'M. Johnson', documentCount: 4, isActive: false },
      { id: 'wh-0010', workflowId: 'WF-2022-001', dateTime: '04/10/2023 15:37', status: 'Tax Deed Preparation', stage: 'Submit to County Clerk', actionTaken: 'Deed Submitted', performedBy: 'M. Johnson', documentCount: 5, isActive: false },
      { id: 'wh-0011', workflowId: 'WF-2022-001', dateTime: '06/30/2023 11:11', status: 'Tax Deed Preparation', stage: 'Treasurer Review', actionTaken: 'Stage Advanced', performedBy: 'D. Brown', documentCount: 2, isActive: false },
      { id: 'wh-0012', workflowId: 'WF-2022-001', dateTime: '08/15/2023 09:00', status: 'Advertisement / Waiting', stage: 'Advertise Tax Deed', actionTaken: 'Notice Sent', performedBy: 'L. Garcia', documentCount: 1, isActive: false },
      { id: 'wh-0013', workflowId: 'WF-2022-001', dateTime: '10/01/2023 10:30', status: 'Advertisement / Waiting', stage: 'Post Advertisement Wait Period', actionTaken: 'Stage Advanced', performedBy: 'L. Garcia', documentCount: 1, isActive: false },
      { id: 'wh-0014', workflowId: 'WF-2022-001', dateTime: '01/12/2024 14:00', status: 'Auction / Sale', stage: 'Send to Auction', actionTaken: 'Auction Scheduled', performedBy: 'J. Martinez', documentCount: 3, isActive: false },
      { id: 'wh-0015', workflowId: 'WF-2022-001', dateTime: '03/05/2024 16:45', status: 'Post-Deed Processing', stage: 'Complete Tax Deed', actionTaken: 'Stage Advanced', performedBy: 'S. Kowalski', documentCount: 5, isActive: false },
      { id: 'wh-0016', workflowId: 'WF-2022-001', dateTime: '05/20/2024 09:55', status: 'Financial Processing', stage: 'Finance Journal Entry', actionTaken: 'Stage Advanced', performedBy: 'T. Williams', documentCount: 2, isActive: false },
      { id: 'wh-0017', workflowId: 'WF-2022-001', dateTime: '07/08/2024 11:30', status: 'Financial Processing', stage: 'Proceeds Notice', actionTaken: 'Notice Sent', performedBy: 'T. Williams', documentCount: 3, isActive: false },
      { id: 'wh-0018', workflowId: 'WF-2022-001', dateTime: '09/15/2024 10:00', status: 'Complete', stage: 'Move to Treasurer', actionTaken: 'Case Closed', performedBy: 'R. Patel', documentCount: 4, notes: 'All proceeds verified. Ready for treasurer transfer.', isActive: true },
    ],
  },
  {
    parcelNumber: '01-122-01-101-004',
    entries: [
      { id: 'wh-1001', workflowId: 'WF-2023-088', dateTime: '03/01/2023 08:00', status: 'Delinquent', stage: 'Initial Delinquency', actionTaken: 'Case Opened', performedBy: 'A. Chen', documentCount: 1, isActive: false },
      { id: 'wh-1002', workflowId: 'WF-2023-088', dateTime: '04/15/2023 09:30', status: 'Delinquent', stage: 'Early Notice Issued', actionTaken: 'Notice Sent', performedBy: 'A. Chen', documentCount: 2, isActive: false },
      { id: 'wh-1003', workflowId: 'WF-2023-088', dateTime: '06/20/2023 14:00', status: 'Delinquent', stage: 'Final Notice Issued', actionTaken: 'Notice Sent', performedBy: 'M. Johnson', documentCount: 3, isActive: false },
      { id: 'wh-1004', workflowId: 'WF-2023-088', dateTime: '09/05/2023 11:15', status: 'Delinquent', stage: '90-Day Expiration Window', actionTaken: 'Stage Advanced', performedBy: 'M. Johnson', documentCount: 1, isActive: false },
      { id: 'wh-1005', workflowId: 'WF-2023-088', dateTime: '12/01/2023 10:00', status: 'Early Enforcement', stage: 'Title Search', actionTaken: 'Title Search Completed', performedBy: 'D. Brown', documentCount: 4, isActive: false },
      { id: 'wh-1006', workflowId: 'WF-2023-088', dateTime: '02/14/2024 13:45', status: 'Early Enforcement', stage: 'Letter of Affidavit', actionTaken: 'Document Uploaded', performedBy: 'D. Brown', documentCount: 2, isActive: false },
      { id: 'wh-1007', workflowId: 'WF-2023-088', dateTime: '04/30/2024 09:00', status: 'Early Enforcement', stage: 'Owner/Occupant Notification', actionTaken: 'Notice Sent', performedBy: 'L. Garcia', documentCount: 3, notes: 'Certified mail sent. Awaiting confirmation.', isActive: true },
    ],
  },
  {
    parcelNumber: '01-122-01-101-005',
    entries: [
      { id: 'wh-2001', workflowId: 'WF-2024-211', dateTime: '01/10/2024 08:45', status: 'Delinquent', stage: 'Initial Delinquency', actionTaken: 'Case Opened', performedBy: 'J. Martinez', documentCount: 1, isActive: false },
      { id: 'wh-2002', workflowId: 'WF-2024-211', dateTime: '02/28/2024 10:00', status: 'Delinquent', stage: 'Early Notice Issued', actionTaken: 'Notice Sent', performedBy: 'J. Martinez', documentCount: 2, isActive: false },
      { id: 'wh-2003', workflowId: 'WF-2024-211', dateTime: '04/15/2024 15:30', status: 'On Hold', stage: 'Bankruptcy', actionTaken: 'Hold Applied', performedBy: 'S. Kowalski', documentCount: 5, isActive: true },
    ],
  },
  {
    parcelNumber: '01-122-01-101-006',
    entries: [
      { id: 'wh-3001', workflowId: 'WF-2023-145', dateTime: '05/01/2023 09:00', status: 'Delinquent', stage: 'Initial Delinquency', actionTaken: 'Case Opened', performedBy: 'R. Patel', documentCount: 1, isActive: false },
      { id: 'wh-3002', workflowId: 'WF-2023-145', dateTime: '06/12/2023 11:00', status: 'Delinquent', stage: 'Early Notice Issued', actionTaken: 'Notice Sent', performedBy: 'R. Patel', documentCount: 2, isActive: false },
      { id: 'wh-3003', workflowId: 'WF-2023-145', dateTime: '08/20/2023 14:30', status: 'Delinquent', stage: 'Final Notice Issued', actionTaken: 'Notice Sent', performedBy: 'T. Williams', documentCount: 3, isActive: false },
      { id: 'wh-3004', workflowId: 'WF-2023-145', dateTime: '11/01/2023 10:15', status: 'Payment Plan', stage: 'In Payment Plan', actionTaken: 'Payment Received', performedBy: 'T. Williams', documentCount: 4, isActive: false },
      { id: 'wh-3005', workflowId: 'WF-2023-145', dateTime: '03/15/2024 09:30', status: 'Early Enforcement', stage: 'Title Search', actionTaken: 'Title Search Completed', performedBy: 'A. Chen', documentCount: 2, isActive: true },
    ],
  },
  {
    parcelNumber: '01-122-01-101-007',
    entries: [
      { id: 'wh-4001', workflowId: 'WF-2024-302', dateTime: '07/01/2024 08:00', status: 'Delinquent', stage: 'Initial Delinquency', actionTaken: 'Case Opened', performedBy: 'M. Johnson', documentCount: 1, isActive: false },
      { id: 'wh-4002', workflowId: 'WF-2024-302', dateTime: '08/15/2024 10:45', status: 'Delinquent', stage: 'Early Notice Issued', actionTaken: 'Notice Sent', performedBy: 'M. Johnson', documentCount: 2, isActive: true },
    ],
  },
];
