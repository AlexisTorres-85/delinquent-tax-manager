import { useQuery } from '@tanstack/react-query';
import { API_BASE, unwrapApiResponse } from '@/lib/api';
import type { ApiParcelData, CatalisParcelInformation } from '../api-types';
import type { Parcel } from '../types';
import type { ParcelWorkflowEntry, ParcelWorkflow } from '@/data/workflow/workflow-history/types';
import type { ParcelStatus, ParcelStage } from '@/data/workflow/workflow-status-definitions';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Trim and title-case a raw Catalis string field. */
function clean(s: string | undefined | null): string {
  return (s ?? '').trim();
}

/** Convert ISO datetime "2026-05-15T07:38:54.666" → "05/15/2026 07:38 AM" for display. */
function formatIsoDatetime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  let h = d.getHours();
  const min = String(d.getMinutes()).padStart(2, '0');
  const meridiem = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${mm}/${dd}/${yyyy} ${String(h).padStart(2, '0')}:${min} ${meridiem}`;
}

/** Build a formatted owner name from Catalis name fields. */
function buildOwnerName(c: CatalisParcelInformation): string {
  const parts = [
    clean(c.firstName1),
    clean(c.middleName1),
    clean(c.lastName1),
    clean(c.nameExtension1),
  ].filter(Boolean);

  const name2Parts = [
    clean(c.firstName2),
    clean(c.middleName2),
    clean(c.lastName2),
    clean(c.nameExtension2),
  ].filter(Boolean);

  const name1 = parts.join(' ');
  const name2 = name2Parts.join(' ');
  return [name1, name2].filter(Boolean).join(' & ');
}

/** Build a formatted property address from Catalis address fields. */
function buildPropertyAddress(c: CatalisParcelInformation): string {
  const num = clean(c.houseNumber) + clean(c.houseNumberSuffix);
  const dir = clean(c.prefixDirection);
  const street = clean(c.streetName);
  const type = clean(c.streetType);
  const sufDir = clean(c.suffixDirection);
  const unit = [clean(c.unitType), clean(c.unitNumber)].filter(Boolean).join(' ');

  const line1 = [num, dir, street, type, sufDir, unit ? `#${unit}` : '']
    .map((s) => s.trim())
    .filter(Boolean)
    .join(' ');

  const line2 = [clean(c.city), clean(c.state), clean(c.zipCode)]
    .filter(Boolean)
    .join(', ');

  return [line1, line2].filter(Boolean).join(', ');
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

/**
 * Maps the raw API parcel data onto our local `Parcel` shape.
 * Fields not yet returned by the API retain their dummy-data values if a
 * base parcel is supplied, otherwise fall back to sensible defaults.
 */
export function mapApiParcelToParcel(raw: ApiParcelData, base?: Parcel): Parcel {
  const c = raw.catalisParcelInformation;

  return {
    // Merge base so non-API fields (amountDue, workflow, payment history…) are kept
    ...(base ?? {}),

    // Identity
    id: String(raw.id),
    parcelNumber: raw.parcelNumber,

    // Owner / address — prefer Catalis data when available
    ownerName: c ? buildOwnerName(c) : base?.ownerName ?? '',
    propertyAddress: c ? buildPropertyAddress(c) : base?.propertyAddress ?? '',

    // Municipality
    municipality: c?.municipalityDescription
      ? `${c.municipalityDescription} (${c.municipalityCode})`
      : raw.municipalityDescription ?? raw.municipalityCode,

    // Financial
    assessedValue: c?.currentAssessedValue ?? base?.assessedValue ?? 0,

    // Flags — sourced from the API parcel root (not Catalis)
    flags: {
      isBankruptcy: raw.isBankruptcy,
      isFloodPlain: raw.isFloodPlain,
      isInRem: raw.isInRem,
      isOutlot: raw.isOutlot,
      isContaminated: raw.isContaminated,
      hasHistoricalContamination: raw.hasHistoricalContamination,
      isDeeded: raw.isDeeded,
      isEnvironmentalIssue: raw.isEnvironmentalIssue,
      isRazingOrder: raw.isRazingOrder,
    },

    // Property / plat details from Catalis
    platType: c ? clean(c.platType) || undefined : base?.platType,
    platCode: c ? clean(c.platCode) || undefined : base?.platCode,
    platDescription: c ? clean(c.platDescription) || undefined : base?.platDescription,
    block: c ? clean(c.block) || undefined : base?.block,
    lotType: c ? clean(c.lotType) || undefined : base?.lotType,
    lot: c ? clean(c.lot) || undefined : base?.lot,
    acres: c?.acres ?? base?.acres,
    frontageFeet: c?.frontageFeet ?? base?.frontageFeet,
    depthFeet: c?.depthFeet ?? base?.depthFeet,
    areaSquareFeet: c?.areaSquareFeet ?? base?.areaSquareFeet,

    // Legal description
    legalDescription: c ? clean(c.legalDescription) : base?.legalDescription ?? '',

    // Carry-through defaults for non-API fields
    amountDue: base?.amountDue ?? 0,
    lastPaymentDate: base?.lastPaymentDate ?? null,
    phoneNumber: base?.phoneNumber ?? '',
    email: base?.email ?? '',
    lotSize: base?.lotSize ?? '',
    paymentHistory: base?.paymentHistory ?? [],

    // Workflow — mapped from the API activeWorkflow object
    ...(() => {
      const aw = raw.activeWorkflow;
      if (!aw) {
        return {
          activeWorkflow: base?.activeWorkflow ?? null,
          workflowTaxYears: base?.workflowTaxYears ?? [],
          activeWorkflowMeta: base?.activeWorkflowMeta ?? null,
          workflowHistory: base?.workflowHistory ?? [],
        };
      }

      const workflowId = String(aw.id);
      const workflowTaxYears = aw.taxYears
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n))
        .sort((a, b) => a - b);

      const workflowHistory: ParcelWorkflowEntry[] = aw.workflowHistoryEntries.map((e) => ({
        id: String(e.id),
        workflowId,
        dateTime: formatIsoDatetime(e.dateTime),
        status: e.workflowStatusDefinitionName as ParcelStatus,
        stage: e.workflowStageDefinitionName as ParcelStage,
        actionTaken: e.actionTaken as ParcelWorkflowEntry['actionTaken'],
        performedBy: e.performedBy,
        documentCount: 0,
        isActive: e.isActive,
      }));

      const activeEntry = workflowHistory.find((e) => e.isActive) ?? workflowHistory[0] ?? null;

      const activeWorkflowMeta: ParcelWorkflow = {
        workflowId,
        parcelNumber: raw.parcelNumber,
        taxYears: workflowTaxYears,
        activeWorkflowHistoryId: activeEntry?.id ?? null,
        isActive: true,
      };

      return {
        activeWorkflow: activeEntry,
        workflowTaxYears,
        activeWorkflowMeta,
        workflowHistory,
      };
    })(),
  };
}

// ─── API fetch ────────────────────────────────────────────────────────────────

async function fetchParcelByNumber(parcelNumber: string): Promise<ApiParcelData> {
  const url = `${API_BASE}/api/parcels/by-number/${encodeURIComponent(parcelNumber)}?includeCatalisData=true`;
  const res = await fetch(url);
  return unwrapApiResponse<ApiParcelData>(res);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const PARCEL_QUERY_KEY = (parcelNumber: string) =>
  ['parcel', 'by-number', parcelNumber] as const;

/**
 * Fetches full parcel detail from the API and maps it to the local `Parcel` shape.
 *
 * @param parcelNumber - The parcel number to fetch (e.g. "01-122-01-207-016").
 * @param base         - Optional existing local parcel to merge non-API fields from.
 */
export function useParcelDetail(parcelNumber: string, base?: Parcel) {
  const query = useQuery({
    queryKey: PARCEL_QUERY_KEY(parcelNumber),
    queryFn: () => fetchParcelByNumber(parcelNumber),
    enabled: Boolean(parcelNumber),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  const parcel = query.data ? mapApiParcelToParcel(query.data, base) : null;

  return {
    parcel,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
