/**
 * Catalis Service
 *
 * All Catalis API access goes through here.
 * Currently uses dummy data — replace `search()` with a real HTTP call
 * when the Catalis API is available. Hooks above this layer need no changes.
 */

import type { CatalisParcel, CatalisSearchParams } from '../types';
import { CATALIS_DUMMY_PARCELS } from '../data/catalis-dummy-data';

function normalize(s: string) {
  return s.toLowerCase().trim();
}

function matchesQuery(parcel: CatalisParcel, query: string, field: CatalisSearchParams['searchField']): boolean {
  if (!query) return true;
  const q = normalize(query);
  switch (field) {
    case 'parcelNumber':
      return normalize(parcel.parcelNumber).includes(q);
    case 'ownerName':
      return normalize(parcel.owner).includes(q);
    case 'address':
      return normalize(parcel.address).includes(q) || normalize(parcel.city).includes(q);
    case 'all':
    default:
      return (
        normalize(parcel.parcelNumber).includes(q) ||
        normalize(parcel.owner).includes(q) ||
        normalize(parcel.address).includes(q) ||
        normalize(parcel.city).includes(q) ||
        normalize(parcel.zip).includes(q)
      );
  }
}

async function search(params: CatalisSearchParams): Promise<CatalisParcel[]> {
  // Simulate async network latency
  await new Promise((resolve) => setTimeout(resolve, 400));

  let results = CATALIS_DUMMY_PARCELS;

  // Main query
  results = results.filter((p) => matchesQuery(p, params.query, params.searchField));

  // Quick filters
  if (params.municipality && params.municipality !== 'any') {
    results = results.filter((p) => p.municipalityCode === params.municipality);
  }
  if (params.taxYear && params.taxYear.length > 0 && !params.taxYear.includes('all')) {
    const years = params.taxYear.map(Number);
    results = results.filter((p) => years.includes(p.taxYear));
  }

  // Advanced filters
  if (params.parcelNumber) {
    results = results.filter((p) => normalize(p.parcelNumber) === normalize(params.parcelNumber!));
  }
  if (params.ownerFirstName) {
    const fn = normalize(params.ownerFirstName);
    results = results.filter((p) => normalize(p.owner).includes(fn));
  }
  if (params.ownerLastName) {
    const ln = normalize(params.ownerLastName);
    results = results.filter((p) => normalize(p.owner).includes(ln));
  }
  if (params.addressLine1) {
    results = results.filter((p) => normalize(p.address).includes(normalize(params.addressLine1!)));
  }
  if (params.city) {
    results = results.filter((p) => normalize(p.city).includes(normalize(params.city!)));
  }
  if (params.zip) {
    results = results.filter((p) => p.zip.startsWith(params.zip!));
  }
  if (params.minTaxAmount) {
    results = results.filter((p) => p.taxDue >= Number(params.minTaxAmount));
  }
  if (params.maxTaxAmount) {
    results = results.filter((p) => p.taxDue <= Number(params.maxTaxAmount));
  }
  if (params.delinquencyStatus && params.delinquencyStatus !== 'any') {
    results = results.filter((p) => normalize(p.delinquencyStatus) === normalize(params.delinquencyStatus!));
  }

  return results;
}

export const catalisService = { search };
