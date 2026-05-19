import { API_BASE, apiFetch } from '@/lib/api';
import type { ParcelContact, CreateContactPayload, UpdateContactPayload } from '../types';

export const contactsService = {
  async getByParcelId(parcelId: number): Promise<ParcelContact[]> {
    return apiFetch<ParcelContact[]>(`${API_BASE}/api/Contacts/parcel/${parcelId}`);
  },

  async getById(id: number): Promise<ParcelContact> {
    return apiFetch<ParcelContact>(`${API_BASE}/api/Contacts/${id}`);
  },

  async create(payload: CreateContactPayload): Promise<ParcelContact> {
    return apiFetch<ParcelContact>(`${API_BASE}/api/Contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },

  async update(id: number, payload: UpdateContactPayload): Promise<ParcelContact> {
    return apiFetch<ParcelContact>(`${API_BASE}/api/Contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },
};
