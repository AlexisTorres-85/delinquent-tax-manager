import { NOTES_DUMMY_DATA } from '../data/notes-dummy-data';
import type { ParcelNote } from '../types';
import { fakeDelay } from '@/lib/api';

export const notesService = {
  async getByParcelNumber(parcelNumber: string): Promise<ParcelNote[]> {
    await fakeDelay();
    const entry = NOTES_DUMMY_DATA.find((p) => p.parcelNumber === parcelNumber);
    return entry?.notes ?? [];
  },
};
