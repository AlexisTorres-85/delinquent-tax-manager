/**
 * Workflow Service
 *
 * Fetches the list of valid parcel statuses and their associated stages.
 * When connecting to a real API, replace the implementations below —
 * the hooks and components above this layer need no changes.
 */

import { WORKFLOW_STATUS_DEFINITIONS } from '@/data/workflow/workflow-status-definitions';
import type { WorkflowStatusRecord } from '@/data/workflow/workflow-status-definitions';

export const workflowService = {
  /**
   * Fetch all statuses (each includes its ordered stages).
   * TODO: replace with → return fetch('/api/workflow/statuses').then(r => r.json())
   */
  async getStatuses(): Promise<WorkflowStatusRecord[]> {
    return Promise.resolve([...WORKFLOW_STATUS_DEFINITIONS] as WorkflowStatusRecord[]);
  },
};
