/**
 * Case Service
 *
 * Fetches the list of valid parcel statuses and their associated stages.
 * When connecting to a real API, replace the implementations below —
 * the hooks and components above this layer need no changes.
 */

import { CASE_STATUS_DEFINITIONS } from '@/data/cases/case-status-definitions';
import type { CaseStatusRecord } from '@/data/cases/case-status-definitions';

export const caseService = {
  /**
   * Fetch all statuses (each includes its ordered stages).
   * TODO: replace with → return fetch('/api/cases/statuses').then(r => r.json())
   */
  async getStatuses(): Promise<CaseStatusRecord[]> {
    return Promise.resolve([...CASE_STATUS_DEFINITIONS] as CaseStatusRecord[]);
  },
};
