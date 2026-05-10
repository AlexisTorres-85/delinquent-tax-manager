import { DOCUMENTS_DUMMY_DATA } from '../data/documents-dummy-data';
import type { ParcelDocument } from '../types';

export const documentsService = {
  async getByParcelNumber(parcelNumber: string): Promise<ParcelDocument[]> {
    const entry = DOCUMENTS_DUMMY_DATA.find((p) => p.parcelNumber === parcelNumber);
    return entry?.documents ?? [];
  },
};
