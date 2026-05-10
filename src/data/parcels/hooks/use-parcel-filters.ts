import { useState } from 'react';
import { VisibilityState, functionalUpdate, OnChangeFn } from '@tanstack/react-table';
import type { ParcelFilters, ParcelStatus } from '../types';
import { DEFAULT_COLUMN_VISIBILITY } from '../types';

type UseParcelFiltersResult = {
  filters: ParcelFilters;
  pageSize: number;
  columnVisibility: VisibilityState;
  setSearch: (value: string) => void;
  setStatus: (value: ParcelStatus | 'all') => void;
  setMinAmountDue: (value: number) => void;
  setOnlyNoPayment: (value: boolean) => void;
  setPageSize: (value: number) => void;
  setColumnVisibility: OnChangeFn<VisibilityState>;
  reset: () => void;
};

/**
 * Manages all parcel grid filter state in one place.
 * Pass `filters` directly to `useParcels()` and the individual setters to GridControls.
 */
export function useParcelFilters(): UseParcelFiltersResult {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ParcelStatus | 'all'>('all');
  const [minAmountDue, setMinAmountDue] = useState(0);
  const [onlyNoPayment, setOnlyNoPayment] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(DEFAULT_COLUMN_VISIBILITY);

  const reset = () => {
    setSearch('');
    setStatus('all');
    setMinAmountDue(0);
    setOnlyNoPayment(false);
    setPageSize(10);
    setColumnVisibility(DEFAULT_COLUMN_VISIBILITY);
  };

  return {
    filters: { search, status, minAmountDue, onlyNoPayment },
    pageSize,
    columnVisibility,
    setSearch,
    setStatus,
    setMinAmountDue,
    setOnlyNoPayment,
    setPageSize,
    setColumnVisibility: (updater) =>
      setColumnVisibility((old) => functionalUpdate(updater, old)),
    reset,
  };
}
