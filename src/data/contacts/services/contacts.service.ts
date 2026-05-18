import { CONTACTS_DUMMY_DATA } from '../data/contacts-dummy-data';
import type { ParcelContact } from '../types';
import { fakeDelay } from '@/lib/api';

export const contactsService = {
  async getByParcelNumber(parcelNumber: string): Promise<ParcelContact[]> {
    await fakeDelay();
    const entry = CONTACTS_DUMMY_DATA.find((p) => p.parcelNumber === parcelNumber);
    return entry?.contacts ?? [];
  },
};
