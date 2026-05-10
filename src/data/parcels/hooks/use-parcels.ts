import { useEffect, useState } from 'react';
import { parcelService } from '../services/parcel.service';
import type { Parcel, ParcelFilters } from '../types';

type UseParcelsResult = {
  /** All parcels (unfiltered) */
  parcels: Parcel[];
  /** Parcels after applying the provided filters */
  filtered: Parcel[];
  isLoading: boolean;
};

/**
 * Fetches all parcels and applies local filters.
 *
 * When the API is ready, `parcelService.getAll()` handles the remote call —
 * this hook stays the same.
 */
export function useParcels(filters: ParcelFilters): UseParcelsResult {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    parcelService.getAll().then((data) => {
      setParcels(data);
      setIsLoading(false);
    });
  }, []);

  const filtered = parcelService.filterLocally(parcels, filters);

  return { parcels, filtered, isLoading };
}
