import type { ParcelWorkflow } from '../types';

/**
 * WORKFLOWS — the actual parcel cases.
 * Each record represents an open (or closed) enforcement workflow for a specific parcel,
 * tracking which tax years are in scope and pointing to the current active history entry.
 *
 * Relationship:
 *   Workflow → references activeWorkflowHistoryId in WORKFLOW_HISTORY_DUMMY_DATA
 *   Workflow ← referenced by parcelNumber from PARCELS_DUMMY_DATA
 */
export const WORKFLOWS_DUMMY_DATA: ParcelWorkflow[] = [
  {
    workflowId: 'WF-2019-042',
    parcelNumber: '01-122-01-101-001',
    taxYears: [2018, 2019],
    activeWorkflowHistoryId: 'wh-0023',
    isActive: false, // completed — paid in full
  },
  {
    workflowId: 'WF-2021-115',
    parcelNumber: '01-122-01-101-001',
    taxYears: [2020, 2021],
    activeWorkflowHistoryId: 'wh-0030',
    isActive: false, // completed — moved to treasurer
  },
  {
    workflowId: 'WF-2022-001',
    parcelNumber: '01-122-01-101-001',
    taxYears: [2021, 2022],
    activeWorkflowHistoryId: 'wh-0018',
    isActive: true,
  },
  {
    workflowId: 'WF-2023-088',
    parcelNumber: '01-122-01-101-004',
    taxYears: [2022, 2023],
    activeWorkflowHistoryId: 'wh-1007',
    isActive: true,
  },
  {
    workflowId: 'WF-2024-211',
    parcelNumber: '01-122-01-101-005',
    taxYears: [2023, 2024],
    activeWorkflowHistoryId: 'wh-2003',
    isActive: true,
  },
  {
    workflowId: 'WF-2023-145',
    parcelNumber: '01-122-01-101-006',
    taxYears: [2022, 2023],
    activeWorkflowHistoryId: 'wh-3005',
    isActive: true,
  },
  {
    workflowId: 'WF-2024-302',
    parcelNumber: '01-122-01-101-007',
    taxYears: [2024],
    activeWorkflowHistoryId: 'wh-4002',
    isActive: true,
  },
];
