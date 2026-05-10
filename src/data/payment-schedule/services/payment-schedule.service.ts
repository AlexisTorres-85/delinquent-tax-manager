import type { ParcelPaymentPlan } from '../types';
import { PAYMENT_PLAN_DATA } from '../data/payment-schedule-dummy-data';

export const paymentScheduleService = {
  /**
   * Fetch the payment plan for a given parcel number.
   * TODO: replace with → return fetch(`/api/parcels/${parcelNumber}/payment-schedule`).then(r => r.json())
   */
  async getByParcelNumber(parcelNumber: string): Promise<ParcelPaymentPlan | null> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return PAYMENT_PLAN_DATA.find((p) => p.parcelNumber === parcelNumber) ?? null;
  },
};
