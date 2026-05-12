import { LEGAL_REVIEW_DUMMY_DATA } from '../data/legal-review-dummy-data';
import type { LegalReview } from '../types';
import { FAKE_API_DELAY_MS } from '@/config/general.config';

export const legalReviewService = {
  async getByParcelNumber(parcelNumber: string): Promise<LegalReview[]> {
    await new Promise<void>((resolve) => setTimeout(resolve, FAKE_API_DELAY_MS));
    const entry = LEGAL_REVIEW_DUMMY_DATA.find((r) => r.parcelNumber === parcelNumber);
    return entry?.reviews ?? [];
  },
};
