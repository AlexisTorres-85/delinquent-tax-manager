import { CONTACTS_DUMMY_DATA } from '../data/contacts-dummy-data';
import type { ParcelContact } from '../types';
import { FAKE_API_DELAY_MS } from '@/config/general.config';

export const contactsService = {
  async getByParcelNumber(parcelNumber: string): Promise<ParcelContact[]> {
    await new Promise<void>((resolve) => setTimeout(resolve, FAKE_API_DELAY_MS));
    const entry = CONTACTS_DUMMY_DATA.find((p) => p.parcelNumber === parcelNumber);
    return entry?.contacts ?? [];
  },
};
