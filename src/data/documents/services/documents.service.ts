import { DOCUMENTS_DUMMY_DATA } from '../data/documents-dummy-data';
import type { ParcelDocument } from '../types';
import { FAKE_API_DELAY_MS } from '@/config/general.config';

export const documentsService = {
  async getByParcelNumber(parcelNumber: string): Promise<ParcelDocument[]> {
    await new Promise<void>((resolve) => setTimeout(resolve, FAKE_API_DELAY_MS));
    const entry = DOCUMENTS_DUMMY_DATA.find((p) => p.parcelNumber === parcelNumber);
    return entry?.documents ?? [];
  },
};
