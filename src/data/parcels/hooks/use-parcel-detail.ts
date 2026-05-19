import { useQuery } from '@tanstack/react-query';
import { API_BASE, apiFetch } from '@/lib/api';
import type { ApiParcelData, CatalisParcelInformation } from '../api-types';
import type { Parcel } from '../types';
import type { ParcelCaseStageHistory, ParcelCase } from '@/data/cases/case-stage-history/types';
import type { ParcelStatus, ParcelStage } from '@/data/cases/case-status-definitions';

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

/** Parse the section number from a Catalis legal description string (e.g. "... SEC 11 ..."). */
function parseSectionFromLegal(legal: string): string | undefined {
  const m = legal.match(/\bSEC(?:TION)?\s+(\d+)/i);
  return m ? m[1] : undefined;
}

/** Parse the town-range from a Catalis legal description string (e.g. "... T1  R22 ..."). */
function parseTownRangeFromLegal(legal: string): string | undefined {
  const m = legal.match(/\b(T\d+[NSEW]?)\s+(R\d+[NSEW]?)\b/i);
  return m ? `${m[1]} ${m[2]}` : undefined;
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
    gcsLegal: c ? clean(c.legalDescription) || undefined : base?.gcsLegal,
    section: c ? parseSectionFromLegal(clean(c.legalDescription)) ?? base?.section : base?.section,
    townRange: c ? parseTownRangeFromLegal(clean(c.legalDescription)) ?? base?.townRange : base?.townRange,

    // Valuation
    landValue: c?.landValue ?? base?.landValue,
    improvementValue: c?.improvementValue ?? base?.improvementValue,

    // Carry-through defaults for non-API fields
    amountDue: base?.amountDue ?? 0,
    lastPaymentDate: base?.lastPaymentDate ?? null,
    phoneNumber: base?.phoneNumber ?? '',
    email: base?.email ?? '',
    lotSize: base?.lotSize ?? '',
    paymentHistory: base?.paymentHistory ?? [],

    // Case — mapped from the API activeCase object
    ...(() => {
      const ac = raw.activeCase;
      if (!ac) {
        return {
          activeCase: base?.activeCase ?? null,
          caseTaxYears: base?.caseTaxYears ?? [],
          activeCaseMeta: base?.activeCaseMeta ?? null,
          caseStageHistory: base?.caseStageHistory ?? [],
          paymentPlan: base?.paymentPlan ?? null,
        };
      }

      const caseId = String(ac.id);
      const caseTaxYears = ac.taxYears
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n))
        .sort((a, b) => a - b);

      const caseStageHistory: ParcelCaseStageHistory[] = ac.caseStageHistories.map((e) => ({
        id: String(e.id),
        caseId,
        dateTime: formatIsoDatetime(e.dateTime),
        status: e.caseStatusDefinitionName as ParcelStatus,
        stage: e.caseStageDefinitionName as ParcelStage,
        actionTaken: e.actionTaken as ParcelCaseStageHistory['actionTaken'],
        performedBy: e.performedBy,
        documentCount: 0,
        isActive: e.isActive,
      }));

      const activeEntry = caseStageHistory.find((e) => e.isActive) ?? caseStageHistory[0] ?? null;

      const activeCaseMeta: ParcelCase = {
        caseId,
        parcelNumber: raw.parcelNumber,
        taxYears: caseTaxYears,
        activeCaseStageHistoryId: activeEntry?.id ?? null,
        isActive: true,
      };

      const paymentPlan = ac.isInPaymentPlan && ac.paymentPlan
        ? {
            paymentPlanDescription: ac.paymentPlan.paymentPlanDescription,
            taxYearsCovered: ac.paymentPlan.taxYearsCovered,
            monthlyAmount: ac.paymentPlan.paymentPlanMonthlyAmount,
            numberOfPaymentsMade: ac.paymentPlan.numberOfPaymentsMade,
            planStartDate: ac.paymentPlan.planStartDate,
            expectedPayoffDate: ac.paymentPlan.expectedPayoffDate,
            expectedPayoffAmount: ac.paymentPlan.expectedPayoffAmount,
            totalDue: ac.paymentPlan.totalDue,
            lastPaymentDate: ac.paymentPlan.lastPaymentDate,
          }
        : null;

      return {
        activeCase: activeEntry,
        caseTaxYears,
        activeCaseMeta,
        caseStageHistory,
        paymentPlan,
      };
    })(),
  };
}

// ─── API fetch ────────────────────────────────────────────────────────────────

async function fetchParcelByNumber(parcelNumber: string): Promise<ApiParcelData> {
  const url = `${API_BASE}/api/parcels/by-number/${encodeURIComponent(parcelNumber)}?includeCatalisData=true`;
  return apiFetch<ApiParcelData>(url);
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
