import type { ParcelPaymentPlan } from '../types';
import { PAYMENT_PLAN_DATA } from '../data/payment-schedule-dummy-data';
import { FAKE_API_DELAY_MS } from '@/config/general.config';

export const paymentScheduleService = {
  /**
   * Fetch the payment plan for a given parcel number.
   * TODO: replace with → return fetch(`/api/parcels/${parcelNumber}/payment-schedule`).then(r => r.json())
   */
  async getByParcelNumber(parcelNumber: string): Promise<ParcelPaymentPlan | null> {
    await new Promise((resolve) => setTimeout(resolve, FAKE_API_DELAY_MS));
    return PAYMENT_PLAN_DATA.find((p) => p.parcelNumber === parcelNumber) ?? null;
  },
};
