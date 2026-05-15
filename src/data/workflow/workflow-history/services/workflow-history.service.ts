import type { ParcelWorkflowEntry } from '../types';

export const workflowHistoryService = {
  async getByParcelNumber(_parcelNumber: string): Promise<ParcelWorkflowEntry[]> {
    // Workflow history is now sourced directly from the parcel detail API response.
    // This method is retained as a no-op for compatibility but should not be called
    // in normal flows (WorkflowHistoryTab receives initialEntries from the parcel).
    return [];
  },
};
