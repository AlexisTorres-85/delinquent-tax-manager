/**
 * Parcel Service
 *
 * All data access for parcels goes through here.
 * When connecting to a real API, replace the implementations below —
 * the hooks and components above this layer need no changes.
 */

import type { Parcel, ParcelFilters } from '../types';
import { PARCELS_DUMMY_DATA } from '../data/parcels-dummy-data';

// ---------------------------------------------------------------------------
// Service methods
// Replace these with real fetch/axios calls when the API is ready.
// ---------------------------------------------------------------------------

const DUMMY_PARCELS: Parcel[] = PARCELS_DUMMY_DATA;

export const parcelService = {
  /**
   * Fetch all parcels.
   * TODO: replace with → return fetch('/api/parcels').then(r => r.json())
   */
  async getAll(): Promise<Parcel[]> {
    return Promise.resolve(DUMMY_PARCELS);
  },

  /**
   * Fetch a single parcel by id.
   * TODO: replace with → return fetch(`/api/parcels/${id}`).then(r => r.json())
   */
  async getById(id: string): Promise<Parcel | undefined> {
    const all = await parcelService.getAll();
    return all.find((p) => p.id === id);
  },

  /**
   * Fetch a single parcel by parcel number.
   * TODO: replace with → return fetch(`/api/parcels/by-number/${encodeURIComponent(parcelNumber)}`).then(r => r.json())
   */
  async getByParcelNumber(parcelNumber: string): Promise<Parcel | undefined> {
    const all = await parcelService.getAll();
    return all.find((p) => p.parcelNumber === parcelNumber);
  },

  /**
   * Apply filters client-side (move this logic to the server when API is ready).
   */
  filterLocally(parcels: Parcel[], filters: ParcelFilters): Parcel[] {
    const search = filters.search.trim().toLowerCase();
    return parcels.filter((p) => {
      if (filters.status !== 'all' && p.status !== filters.status) return false;
      if (p.amountDue < filters.minAmountDue) return false;
      if (filters.onlyNoPayment && p.lastPaymentDate !== null) return false;
      if (search) {
        const haystack = `${p.parcelNumber} ${p.ownerName} ${p.propertyAddress}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    });
  },
};
