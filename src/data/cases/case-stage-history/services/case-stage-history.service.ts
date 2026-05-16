import type { ParcelCaseStageHistory } from '../types';

export const caseStageHistoryService = {
  async getByParcelNumber(_parcelNumber: string): Promise<ParcelCaseStageHistory[]> {
    // Case stage history is now sourced directly from the parcel detail API response.
    // This method is retained as a no-op for compatibility but should not be called
    // in normal flows (CaseStageHistoryTab receives initialEntries from the parcel).
    return [];
  },
};
