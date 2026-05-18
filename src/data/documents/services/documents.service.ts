import { DOCUMENTS_DUMMY_DATA } from '../data/documents-dummy-data';
import type { ParcelDocument } from '../types';
import { fakeDelay } from '@/lib/api';

export const documentsService = {
  async getByParcelNumber(parcelNumber: string): Promise<ParcelDocument[]> {
    await fakeDelay();
    const entry = DOCUMENTS_DUMMY_DATA.find((p) => p.parcelNumber === parcelNumber);
    return entry?.documents ?? [];
  },
};
