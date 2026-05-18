import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { API_BASE, apiFetch } from '@/lib/api';
import type { ApiParcelListItem, ApiParcelPage } from '../api-types';
import type { Parcel, ParcelStatus, ParcelStage } from '../types';
import type { ParcelCaseStageHistory } from '@/data/cases/case-stage-history/types';

// ─── Mapper ───────────────────────────────────────────────────────────────────

/** Maps a list-endpoint item to the local `Parcel` shape. */
export function mapApiListItemToParcel(item: ApiParcelListItem): Parcel {
  return {
    id: String(item.id),
    parcelNumber: item.parcelNumber,
    ownerName: item.ownerName ?? '',
    propertyAddress: [item.propertyAddress, item.postOffice, item.zipCode]
      .filter(Boolean)
      .join(', '),
    municipality: item.municipalityDescription ?? item.municipalityCode,
    amountDue: 0, // not in list payload — populated by detail view
    assessedValue: item.totalValue,
    landValue: item.landValue,
    improvementValue: item.improvementValue,
    activeCase: item.activeCase
      ? ({
          id: String(item.activeCase.id),
          caseId: String(item.activeCase.id),
          dateTime: item.activeCase.currentStageDateTime,
          status: item.activeCase.currentStatusDefinitionName as ParcelStatus,
          stage: item.activeCase.currentStageDefinitionName as ParcelStage,
          actionTaken: 'Case Opened',
          performedBy: '',
          documentCount: 0,
          isActive: true,
        } satisfies ParcelCaseStageHistory)
      : null,
    activeCaseMeta: item.activeCase
      ? {
          caseId: String(item.activeCase.id),
          parcelNumber: item.parcelNumber,
          taxYears: item.activeCase.taxYears
            .split(',')
            .map((y) => parseInt(y.trim(), 10))
            .filter((n) => !isNaN(n)),
          activeCaseStageHistoryId: String(item.activeCase.id),
          isActive: true,
        }
      : null,
    caseTaxYears: item.activeCase
      ? item.activeCase.taxYears
          .split(',')
          .map((y) => parseInt(y.trim(), 10))
          .filter((n) => !isNaN(n))
      : [],
    caseStageHistory: [],
    paymentPlan: null,
    flags: {
      isBankruptcy: item.isBankruptcy,
      isFloodPlain: item.isFloodPlain,
      isInRem: item.isInRem,
      isOutlot: item.isOutlot,
      isContaminated: item.isContaminated,
      hasHistoricalContamination: item.hasHistoricalContamination,
      isDeeded: item.isDeeded,
      isEnvironmentalIssue: item.isEnvironmentalIssue,
      isRazingOrder: item.isRazingOrder,
    },
    lastPaymentDate: null,
    phoneNumber: '',
    email: '',
    legalDescription: item.legalDescription ?? '',
    lotSize: item.valuationAcres ? `${item.valuationAcres} acres` : '',
    paymentHistory: [],
    isInPaymentPlan: item.isInPaymentPlan ?? false,
    delinquentYears: item.delinquentYears ?? '',
    totalYearsDelinquent: item.totalYearsDelinquent ?? 0,
  };
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

export interface ParcelsListParams {
  pageNumber: number;
  pageSize: number;
  search?: string;
  isDelinquent?: boolean;
  isInRem?: boolean;
  isBankruptcy?: boolean;
  isDeeded?: boolean;
  municipalityCode?: string;
  isInPaymentPlan?: boolean;
  /** Range as [minYear, maxYear] — sent as "2020-2022" */
  delinquentTaxYears?: [number, number];
}

async function fetchParcels(params: ParcelsListParams): Promise<ApiParcelPage> {
  const url = new URL(`${API_BASE}/api/parcels`);
  url.searchParams.set('pageNumber', String(params.pageNumber));
  url.searchParams.set('pageSize', String(params.pageSize));
  if (params.search) url.searchParams.set('search', params.search);
  if (params.isDelinquent !== undefined) url.searchParams.set('isDelinquent', String(params.isDelinquent));
  if (params.isInRem !== undefined) url.searchParams.set('isInRem', String(params.isInRem));
  if (params.isBankruptcy !== undefined) url.searchParams.set('isBankruptcy', String(params.isBankruptcy));
  if (params.isDeeded !== undefined) url.searchParams.set('isDeeded', String(params.isDeeded));
  if (params.municipalityCode) url.searchParams.set('municipalityCode', params.municipalityCode);
  if (params.isInPaymentPlan !== undefined) url.searchParams.set('isInPaymentPlan', String(params.isInPaymentPlan));
  if (params.delinquentTaxYears) url.searchParams.set('delinquentTaxYears', `${params.delinquentTaxYears[0]}-${params.delinquentTaxYears[1]}`);
  return apiFetch<ApiParcelPage>(url.toString());
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const PARCELS_LIST_QUERY_KEY = (params: ParcelsListParams) =>
  ['parcels', 'list', params] as const;

export interface UseParcelsApiResult {
  parcels: Parcel[];
  totalCount: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  delinquentInScope: number;
  inRemCount: number;
  bankruptcyCount: number;
  contaminatedCount: number;
  razingOrderCount: number;
  environmentalIssueCount: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetching: boolean;
}

export function useParcelsApi(params: ParcelsListParams): UseParcelsApiResult {
  const query = useQuery({
    queryKey: PARCELS_LIST_QUERY_KEY(params),
    queryFn: () => fetchParcels(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });

  const page = query.data;
  const parcels = page ? page.items.map(mapApiListItemToParcel) : [];

  return {
    parcels,
    totalCount: page?.totalCount ?? 0,
    totalPages: page?.totalPages ?? 0,
    pageNumber: page?.pageNumber ?? params.pageNumber,
    pageSize: page?.pageSize ?? params.pageSize,
    delinquentInScope: page?.delinquentInScope ?? 0,
    inRemCount: page?.inRemCount ?? 0,
    bankruptcyCount: page?.bankruptcyCount ?? 0,
    contaminatedCount: page?.contaminatedCount ?? 0,
    razingOrderCount: page?.razingOrderCount ?? 0,
    environmentalIssueCount: page?.environmentalIssueCount ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    isFetching: query.isFetching,
  };
}
