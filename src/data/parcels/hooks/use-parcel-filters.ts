import { useState, useEffect } from 'react';
import { VisibilityState, functionalUpdate, OnChangeFn } from '@tanstack/react-table';
import { DEFAULT_COLUMN_VISIBILITY } from '../types';

export type LegalStatus = 'all' | 'isDelinquent' | 'isInRem' | 'isBankruptcy' | 'isDeeded';

type UseParcelFiltersResult = {
  search: string;
  debouncedSearch: string;
  legalStatus: LegalStatus;
  municipalityCode: string;
  pageSize: number;
  pageNumber: number;
  columnVisibility: VisibilityState;
  setSearch: (value: string) => void;
  setLegalStatus: (value: LegalStatus) => void;
  setMunicipalityCode: (value: string) => void;
  setPageSize: (value: number) => void;
  setPageNumber: (value: number) => void;
  setColumnVisibility: OnChangeFn<VisibilityState>;
  reset: () => void;
};

export function useParcelFilters(): UseParcelFiltersResult {
  const [search, setSearchRaw] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [legalStatus, setLegalStatusRaw] = useState<LegalStatus>('all');
  const [municipalityCode, setMunicipalityCodeRaw] = useState('');
  const [pageSize, setPageSizeRaw] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(DEFAULT_COLUMN_VISIBILITY);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPageNumber(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  function setSearch(value: string) {
    setSearchRaw(value);
  }

  function setLegalStatus(value: LegalStatus) {
    setLegalStatusRaw(value);
    setPageNumber(1);
  }

  function setMunicipalityCode(value: string) {
    setMunicipalityCodeRaw(value);
    setPageNumber(1);
  }

  function setPageSize(value: number) {
    setPageSizeRaw(value);
    setPageNumber(1);
  }

  const reset = () => {
    setSearchRaw('');
    setDebouncedSearch('');
    setLegalStatusRaw('all');
    setMunicipalityCodeRaw('');
    setPageSizeRaw(10);
    setPageNumber(1);
    setColumnVisibility(DEFAULT_COLUMN_VISIBILITY);
  };

  return {
    search,
    debouncedSearch,
    legalStatus,
    municipalityCode,
    pageSize,
    pageNumber,
    columnVisibility,
    setSearch,
    setLegalStatus,
    setMunicipalityCode,
    setPageSize,
    setPageNumber,
    setColumnVisibility: (updater) =>
      setColumnVisibility((old) => functionalUpdate(updater, old)),
    reset,
  };
}
