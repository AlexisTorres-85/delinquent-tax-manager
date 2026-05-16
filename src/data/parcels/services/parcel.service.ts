/**
 * Parcel Service
 *
 * All data access for parcels goes through here.
 * When connecting to a real API, replace the implementations below —
 * the hooks and components above this layer need no changes.
 */

import type { Parcel, ParcelFilters } from '../types';

export const parcelService = {
  async getAll(): Promise<Parcel[]> {
    return [];
  },

  async getById(_id: string): Promise<Parcel | undefined> {
    return undefined;
  },

  async getByParcelNumber(_parcelNumber: string): Promise<Parcel | undefined> {
    return undefined;
  },

  filterLocally(parcels: Parcel[], filters: ParcelFilters): Parcel[] {
    const search = filters.search.trim().toLowerCase();
    return parcels.filter((p) => {
      if (filters.status !== 'all' && p.activeCase?.status !== filters.status) return false;
      if (search) {
        const haystack = `${p.parcelNumber} ${p.ownerName} ${p.propertyAddress}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    });
  },
};
