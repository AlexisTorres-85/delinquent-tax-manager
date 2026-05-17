import { useState, useEffect } from 'react';
import { VisibilityState, functionalUpdate, OnChangeFn } from '@tanstack/react-table';
import { DEFAULT_COLUMN_VISIBILITY } from '../types';

export type LegalStatus = 'all' | 'isDelinquent' | 'isInRem' | 'isBankruptcy' | 'isDeeded';

export type PaymentPlanFilter =
  | 'all'
  | 'inPlan'
  | 'notInPlan'
  | 'activePlan'
  | 'brokenPlan'
  | 'coversCaseTaxYears'
  | 'partiallyCoversCaseTaxYears'
  | 'historicalOnly';

type UseParcelFiltersResult = {
  search: string;
  debouncedSearch: string;
  legalStatus: LegalStatus;
  municipalityCode: string;
  pageSize: number;
  pageNumber: number;
  columnVisibility: VisibilityState;
  paymentPlanFilter: PaymentPlanFilter;
  delinquentYearRange: [number, number] | null;
  flagIsDelinquent: boolean;
  flagIsInRem: boolean;
  flagIsBankruptcy: boolean;
  flagIsDeeded: boolean;
  setSearch: (value: string) => void;
  setLegalStatus: (value: LegalStatus) => void;
  setMunicipalityCode: (value: string) => void;
  setPageSize: (value: number) => void;
  setPageNumber: (value: number) => void;
  setColumnVisibility: OnChangeFn<VisibilityState>;
  setPaymentPlanFilter: (value: PaymentPlanFilter) => void;
  setDelinquentYearRange: (value: [number, number] | null) => void;
  setFlagIsDelinquent: (value: boolean) => void;
  setFlagIsInRem: (value: boolean) => void;
  setFlagIsBankruptcy: (value: boolean) => void;
  setFlagIsDeeded: (value: boolean) => void;
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
  const [paymentPlanFilter, setPaymentPlanFilterRaw] = useState<PaymentPlanFilter>('all');
  const [delinquentYearRange, setDelinquentYearRangeRaw] = useState<[number, number] | null>(null);
  const [flagIsDelinquent, setFlagIsDelinquentRaw] = useState(false);
  const [flagIsInRem, setFlagIsInRemRaw] = useState(false);
  const [flagIsBankruptcy, setFlagIsBankruptcyRaw] = useState(false);
  const [flagIsDeeded, setFlagIsDeedRaw] = useState(false);

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

  function setPaymentPlanFilter(value: PaymentPlanFilter) {
    setPaymentPlanFilterRaw(value);
    setPageNumber(1);
  }

  function setDelinquentYearRange(value: [number, number] | null) {
    setDelinquentYearRangeRaw(value);
    setPageNumber(1);
  }

  function setFlagIsDelinquent(value: boolean) { setFlagIsDelinquentRaw(value); setPageNumber(1); }
  function setFlagIsInRem(value: boolean) { setFlagIsInRemRaw(value); setPageNumber(1); }
  function setFlagIsBankruptcy(value: boolean) { setFlagIsBankruptcyRaw(value); setPageNumber(1); }
  function setFlagIsDeeded(value: boolean) { setFlagIsDeedRaw(value); setPageNumber(1); }

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
    setPaymentPlanFilterRaw('all');
    setDelinquentYearRangeRaw(null);
    setFlagIsDelinquentRaw(false);
    setFlagIsInRemRaw(false);
    setFlagIsBankruptcyRaw(false);
    setFlagIsDeedRaw(false);
  };

  return {
    search,
    debouncedSearch,
    legalStatus,
    municipalityCode,
    pageSize,
    pageNumber,
    columnVisibility,
    paymentPlanFilter,
    delinquentYearRange,
    flagIsDelinquent,
    flagIsInRem,
    flagIsBankruptcy,
    flagIsDeeded,
    setSearch,
    setLegalStatus,
    setMunicipalityCode,
    setPageSize,
    setPageNumber,
    setPaymentPlanFilter,
    setDelinquentYearRange,
    setFlagIsDelinquent,
    setFlagIsInRem,
    setFlagIsBankruptcy,
    setFlagIsDeeded,
    setColumnVisibility: (updater) =>
      setColumnVisibility((old) => functionalUpdate(updater, old)),
    reset,
  };
}
