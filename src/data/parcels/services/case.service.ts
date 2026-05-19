import { apiFetch, API_BASE } from '@/lib/api';
import type { CaseStatusRecord } from '@/data/cases/case-status-definitions';

export const caseService = {
  /**
   * Fetches all case statuses with their ordered stages from the lookup API.
   * Results are cached for 30 minutes via React Query — only one call per session.
   */
  async getStatuses(): Promise<CaseStatusRecord[]> {
    return apiFetch<CaseStatusRecord[]>(`${API_BASE}/api/lookup/case-statuses`);
  },
};
