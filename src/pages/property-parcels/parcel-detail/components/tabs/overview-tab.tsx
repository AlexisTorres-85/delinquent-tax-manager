import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BadgeDollarSign,
  CalendarDays,
  Flag,
  LandPlotIcon,
  MapPinned,
  UserCircle2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from '@/components/ui/dialog';
import { StatusBadge, StageBadge } from '@/components/ui/parcel-badges';
import { PageSection } from '@/components/layout/page-section';
import { TaxYearBreakdown } from '../tax-year-breakdown';
import { PaymentPlanSection } from '../payment-plan-section';
import { useTaxYearBalances } from '@/data/tax-payments/hooks/use-tax-year-balances';
import type { Parcel, ParcelFlags } from '@/data/parcels/types';
import { EditFlagsDialog } from '../dialogs/edit-flags-dialog';
import { SummaryCard } from '@/components/ui/summary-card';

// ─── Flag definitions ─────────────────────────────────────────────────────────

const ALL_FLAGS: { key: keyof ParcelFlags; label: string; description: string }[] = [
  {
    key: 'isBankruptcy',
    label: 'Bankruptcy',
    description:
      'The property owner has an active or pending bankruptcy filing, which may impose an automatic stay on collection actions and require court approval before proceeding.',
  },
  {
    key: 'isFloodPlain',
    label: 'Flood Plain',
    description:
      'The parcel is located within a FEMA-designated flood plain zone. Special flood insurance requirements and development restrictions may apply.',
  },
  {
    key: 'isInRem',
    label: 'In Rem',
    description:
      'An in rem tax foreclosure action has been initiated against this property. The proceeding is directed at the property itself rather than a specific individual.',
  },
  {
    key: 'isOutlot',
    label: 'Outlot',
    description:
      'The parcel is classified as an outlot — a reserved or residual land parcel that is not part of a standard lot subdivision, often used for common areas or future development.',
  },
  {
    key: 'isContaminated',
    label: 'Contaminated',
    description:
      'The property has confirmed environmental contamination such as hazardous materials, chemicals, or pollutants on-site. Remediation may be required before transfer or redevelopment.',
  },
  {
    key: 'hasHistoricalContamination',
    label: 'Historical Contamination',
    description:
      'There is a documented history of environmental contamination on this property. The site may have been remediated, but historical records indicate prior pollution events.',
  },
  {
    key: 'isDeeded',
    label: 'Deeded',
    description:
      'The property has been formally transferred via deed through the tax foreclosure process. Ownership has been conveyed to the acquiring entity.',
  },
  {
    key: 'isEnvironmentalIssue',
    label: 'Environmental Issue',
    description:
      'An active environmental concern or regulatory issue has been flagged for this property. This may include open violations, ongoing investigations, or pending remediation orders.',
  },
  {
    key: 'isRazingOrder',
    label: 'Razing Order',
    description:
      'A municipal or court-issued order requires the demolition of structures on this property due to safety hazards, code violations, or structural instability.',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(value: number) {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-divider bg-muted p-2">
      <p className="text-sm font-semibold uppercase text-muted-foreground">
        {label}
      </p>

      <div className="text-sm font-medium text-foreground">
        {value || '—'}
      </div>
    </div>
  );
}

function FlagPill({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-md border px-3 py-2 transition-colors ${active
        ? 'border-amber-300 bg-amber-50 text-amber-900'
        : 'border-divider bg-muted text-muted-foreground'
        }`}
    >
      <span className="truncate text-xs font-medium">{label}</span>

      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${active
          ? 'bg-amber-500 text-white'
          : 'bg-muted text-muted-foreground'
          }`}
      >
        {active ? 'On' : 'Off'}
      </span>
    </div>
  );
}

function FlagsInfoModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader
          icon={<Flag />}
          subtitle="Reference guide for all parcel condition flags used in the system."
        >
          <DialogTitle>Parcel Flag Definitions</DialogTitle>
        </DialogHeader>

        <DialogBody className="p-6">
          <div className="grid gap-3 md:grid-cols-2">
            {ALL_FLAGS.map(({ key, label, description }) => (
              <div
                key={key}
                className="rounded-xl border border-divider bg-muted/20 p-4"
              >
                <p className="text-sm font-semibold text-foreground">{label}</p>

                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-divider bg-background p-3">
            <p className="text-xs italic text-muted-foreground">
              Note: This guide provides general definitions for each flag. Specific
              criteria for when flags are applied may vary based on local policies
              and case circumstances.
            </p>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

interface OverviewTabProps {
  parcel: Parcel;
  onTabChange: (tab: string) => void;
}

export function OverviewTab({ parcel, onTabChange }: OverviewTabProps) {
  const [flagsInfoOpen, setFlagsInfoOpen] = useState(false);
  const [editFlagsOpen, setEditFlagsOpen] = useState(false);

  const taxYears = parcel.caseTaxYears.join(', ');

  const { totalDue, isLoading: totalDueLoading } = useTaxYearBalances(
    parcel.parcelNumber,
    parcel.caseTaxYears.length > 0 ? parcel.caseTaxYears : undefined,
  );

  return (
    <div className="min-h-full">
      {/* Header */}
      <section
        className="relative overflow-hidden border-t-3 z-0 border-b-2 border-b-white shadow shadow-xl border-t-app-secondary px-6 py-6"
        style={{ background: 'var(--parcel-header-background)' }}
      >

        <div
          className="pointer-events-none h-94 absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'var(--parcel-header-texture)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="relative z-0 flex flex-col gap-5">

          <div className="flex flex-col gap-5">
            <div className="flex items-start justify-between gap-5">
              <div className="flex min-w-0 items-start gap-4 pt-1">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-md bg-white/15">
                  <UserCircle2 className="size-10 text-white" />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-xl font-semibold leading-tight text-white">
                    {parcel.ownerName}
                  </h2>

                  <p className="mt-2 flex items-center gap-1.5 truncate text-sm text-white/50">
                    <MapPinned className="size-4 shrink-0" />
                    {parcel.propertyAddress}
                  </p>

                  <p className="mt-1 text-xs text-white/50">
                    Parcel #{parcel.parcelNumber}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {parcel.activeCase ? (
                  <>
                    <StatusBadge status={parcel.activeCase.status} />
                    <StageBadge stage={parcel.activeCase.stage} />
                  </>
                ) : (
                  <span className="rounded-full border border-divider bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    No active case
                  </span>
                )}
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid gap-3 pt-1 md:grid-cols-2 xl:grid-cols-[1fr_1fr_0.75fr_0.75fr_1.5fr]">
              <SummaryCard
                icon={<MapPinned />}
                label="Municipality"
                value={parcel.municipality || '—'}
              />

              <SummaryCard
                icon={<CalendarDays />}
                label="Case Tax Years"
                value={taxYears || '—'}
              />

              <SummaryCard
                icon={<BadgeDollarSign />}
                label="Total Due"
                tone="danger"
                value={
                  totalDueLoading ? (
                    <span className="text-muted-foreground">—</span>
                  ) : (
                    formatCurrency(totalDue)
                  )
                }
              />

              <SummaryCard
                icon={<LandPlotIcon />}
                label="Assessed Value"
                value={formatCurrency(parcel.assessedValue)}
              />

              <SummaryCard
                icon={<BadgeDollarSign />}
                label="Current Payment Plan"
                value={
                  parcel.paymentPlan ? (
                    <button
                      type="button"
                      onClick={() => onTabChange('Payment Plan Schedule')}
                      className="block max-w-full truncate text-left text-sm font-semibold text-primary underline-offset-2 hover:underline"
                    >
                      {parcel.paymentPlan.paymentPlanDescription}
                    </button>
                  ) : (
                    <span className="text-muted-foreground">No payment plan</span>
                  )
                }
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-6 overflow-x-hidden pb-20 bg-app-primary/20">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,4fr)_minmax(0,6fr)]">
          {/* Left column */}
          <aside className="flex min-w-0 flex-col gap-6">
            <PageSection
              icon={<Flag className="size-5 text-muted-foreground" />}
              title="Flags"
              subtitle="Parcel conditions and review indicators"
              onHelperClick={() => setFlagsInfoOpen(true)}
              action={
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 text-xs"
                  onClick={() => setEditFlagsOpen(true)}
                >
                  Edit Flags
                </Button>
              }
            >
              <div className="grid grid-cols-3 gap-2">
                {ALL_FLAGS.map(({ key, label }) => (
                  <FlagPill
                    key={key}
                    label={label}
                    active={Boolean(parcel.flags[key])}
                  />
                ))}
              </div>
            </PageSection>

            <PageSection
              icon={<LandPlotIcon className="size-5 text-muted-foreground" />}
              title="Property Details"
              subtitle="Physical and plat information">
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <DetailItem label="Plat Type" value={parcel.platType ?? '—'} />
                  <DetailItem label="Plat Code" value={parcel.platCode ?? '—'} />
                </div>

                <DetailItem label="Plat Description" value={parcel.platDescription ?? '—'} />

                <div className="grid grid-cols-2 gap-3">
                  <DetailItem label="Lot Type" value={parcel.lotType ?? '—'} />
                  <DetailItem label="Lot" value={parcel.lot?.trim() || '—'} />
                </div>

                <DetailItem label="Block" value={parcel.block || '—'} />

                <div className="grid grid-cols-3 gap-3">
                  <DetailItem label="Acres" value={parcel.acres != null ? parcel.acres.toFixed(3) : '—'} />
                  <DetailItem label="Frontage (ft)" value={parcel.frontageFeet != null ? parcel.frontageFeet.toFixed(3) : '—'} />
                  <DetailItem label="Depth (ft)" value={parcel.depthFeet != null ? parcel.depthFeet.toFixed(3) : '—'} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <DetailItem label="Area (sq ft)" value={parcel.areaSquareFeet != null ? parcel.areaSquareFeet.toLocaleString() : '—'} />
                  <DetailItem label="Land Value" value={parcel.landValue != null ? formatCurrency(parcel.landValue) : '—'} />
                </div>
              </div>
            </PageSection>
          </aside>
          {/* Right column */}
          <main className="min-w-0">
            {parcel.activeCase === null ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-divider bg-background px-6 py-14 text-center shadow-sm">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <LandPlotIcon className="size-5 text-muted-foreground/70" />
                </div>

                <div className="mt-4">
                  <p className="text-sm font-semibold text-foreground">
                    No case data available
                  </p>

                  <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
                    Start a delinquency process and select the applicable tax
                    years to view the tax breakdown and payment plan information.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {parcel.paymentPlan && (
                  <PaymentPlanSection paymentPlan={parcel.paymentPlan} />
                )}

                <TaxYearBreakdown
                  parcelNumber={parcel.parcelNumber}
                  taxYears={parcel.caseTaxYears}
                  className="flex-1"
                />
              </div>
            )}
          </main>
        </div>
      </section>

      <FlagsInfoModal
        open={flagsInfoOpen}
        onOpenChange={setFlagsInfoOpen}
      />

      <EditFlagsDialog
        open={editFlagsOpen}
        onOpenChange={setEditFlagsOpen}
        parcelNumber={parcel.parcelNumber}
        currentFlags={parcel.flags}
      />
    </div>
  );
}