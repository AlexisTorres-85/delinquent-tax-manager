import { useEffect, useState } from 'react';
import { parcelService } from '../services/parcel.service';
import type { Parcel } from '../types';

type UseParcelResult = {
  parcel: Parcel | null;
  isLoading: boolean;
  notFound: boolean;
};

export function useParcel(parcelNumber: string): UseParcelResult {
  const [parcel, setParcel] = useState<Parcel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setNotFound(false);
    parcelService.getByParcelNumber(parcelNumber).then((data) => {
      if (cancelled) return;
      if (data) {
        setParcel(data);
      } else {
        setNotFound(true);
      }
      setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, [parcelNumber]);

  return { parcel, isLoading, notFound };
}
