import type { TaxPayment } from '../types';
import { TAX_PAYMENTS_DUMMY_DATA } from '../data/tax-payments-dummy-data';
import { FAKE_API_DELAY_MS } from '@/config/general.config';

export const taxPaymentService = {
  /**
   * Fetch all tax payments for a given parcel number.
   * TODO: replace with → return fetch(`/api/parcels/${parcelNumber}/tax-payments`).then(r => r.json())
   */
  async getByParcelNumber(parcelNumber: string): Promise<TaxPayment[]> {
    await new Promise((resolve) => setTimeout(resolve, FAKE_API_DELAY_MS));
    return TAX_PAYMENTS_DUMMY_DATA.filter((p) => p.parcelNumber === parcelNumber);
  },
};
