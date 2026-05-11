import { WORKFLOW_HISTORY_DUMMY_DATA } from '../data/workflow-history-dummy-data';
import type { ParcelWorkflowEntry } from '../types';
import { FAKE_API_DELAY_MS } from '@/config/general.config';

export const workflowHistoryService = {
  async getByParcelNumber(parcelNumber: string): Promise<ParcelWorkflowEntry[]> {
    await new Promise<void>((resolve) => setTimeout(resolve, FAKE_API_DELAY_MS));
    const entry = WORKFLOW_HISTORY_DUMMY_DATA.find((p) => p.parcelNumber === parcelNumber);
    return entry?.entries ?? [];
  },
};
