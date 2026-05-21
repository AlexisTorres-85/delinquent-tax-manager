import { API_BASE, apiFetch } from '@/lib/api';
import type { InternalNote } from '../types';

export const notesService = {
  async getByParcelId(parcelId: number): Promise<InternalNote[]> {
    return apiFetch<InternalNote[]>(`${API_BASE}/api/InternalNotes/parcel/${parcelId}`);
  },
};
