import { LEGAL_REVIEW_DUMMY_DATA } from '../data/legal-review-dummy-data';
import type { LegalReview } from '../types';
import { fakeDelay } from '@/lib/api';

export const legalReviewService = {
  async getByParcelNumber(parcelNumber: string): Promise<LegalReview[]> {
    await fakeDelay();
    const entry = LEGAL_REVIEW_DUMMY_DATA.find((r) => r.parcelNumber === parcelNumber);
    return entry?.reviews ?? [];
  },
};
