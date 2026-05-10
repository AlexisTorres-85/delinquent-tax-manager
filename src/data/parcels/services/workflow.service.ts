/**
 * Workflow Service
 *
 * Fetches the list of valid parcel statuses and their associated stages.
 * When connecting to a real API, replace the implementations below —
 * the hooks and components above this layer need no changes.
 */

import { WORKFLOW_DUMMY_DATA } from '../data/workflow-dummy-data';
import type { WorkflowStatusRecord } from '../data/workflow-dummy-data';

export const workflowService = {
  /**
   * Fetch all statuses (each includes its ordered stages).
   * TODO: replace with → return fetch('/api/workflow/statuses').then(r => r.json())
   */
  async getStatuses(): Promise<WorkflowStatusRecord[]> {
    return Promise.resolve(WORKFLOW_DUMMY_DATA);
  },
};
