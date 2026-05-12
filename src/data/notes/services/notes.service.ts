import { NOTES_DUMMY_DATA } from '../data/notes-dummy-data';
import type { ParcelNote } from '../types';
import { FAKE_API_DELAY_MS } from '@/config/general.config';

export const notesService = {
  async getByParcelNumber(parcelNumber: string): Promise<ParcelNote[]> {
    await new Promise<void>((resolve) => setTimeout(resolve, FAKE_API_DELAY_MS));
    const entry = NOTES_DUMMY_DATA.find((p) => p.parcelNumber === parcelNumber);
    return entry?.notes ?? [];
  },
};
