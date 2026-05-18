import { useState } from 'react';
import { Flag, LandPlotIcon, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { StatusBadge, StageBadge } from '@/components/ui/parcel-badges';
import { PageSection } from '@/components/layout/page-section';
import { TaxYearBreakdown } from '../tax-year-breakdown';
import { PaymentPlanSection } from '../payment-plan-section';
import { useTaxYearBalances } from '@/data/tax-payments/hooks/use-tax-year-balances';
import type { Parcel, ParcelFlags } from '@/data/parcels/types';
import { EditFlagsDialog } from '../dialogs/edit-flags-dialog';

// ─── Flag definitions ─────────────────────────────────────────────────────────

const ALL_FLAGS: { key: keyof ParcelFlags; label: string; description: string }[] = [
  {
    key: 'isBankruptcy',
    label: 'Bankruptcy',
    description: 'The property owner has an active or pending bankruptcy filing, which may impose an automatic stay on collection actions and require court approval before proceeding.',
  },
  {
    key: 'isFloodPlain',
    label: 'Flood Plain',
    description: 'The parcel is located within a FEMA-designated flood plain zone. Special flood insurance requirements and development restrictions may apply.',
  },
  {
    key: 'isInRem',
    label: 'In Rem',
    description: 'An in rem tax foreclosure action has been initiated against this property. The proceeding is directed at the property itself rather than a specific individual.',
  },
  {
    key: 'isOutlot',
    label: 'Outlot',
    description: 'The parcel is classified as an outlot — a reserved or residual land parcel that is not part of a standard lot subdivision, often used for common areas or future development.',
  },
  {
    key: 'isContaminated',
    label: 'Contaminated',
    description: 'The property has confirmed environmental contamination such as hazardous materials, chemicals, or pollutants on-site. Remediation may be required before transfer or redevelopment.',
  },
  {
    key: 'hasHistoricalContamination',
    label: 'Historical Contamination',
    description: 'There is a documented history of environmental contamination on this property. The site may have been remediated, but historical records indicate prior pollution events.',
  },
  {
    key: 'isDeeded',
    label: 'Deeded',
    description: 'The property has been formally transferred via deed through the tax foreclosure process. Ownership has been conveyed to the acquiring entity.',
  },
  {
    key: 'isEnvironmentalIssue',
    label: 'Environmental Issue',
    description: 'An active environmental concern or regulatory issue has been flagged for this property. This may include open violations, ongoing investigations, or pending remediation orders.',
  },
  {
    key: 'isRazingOrder',
    label: 'Razing Order',
    description: 'A municipal or court-issued order requires the demolition of structures on this property due to safety hazards, code violations, or structural instability.',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">{label}</span>
      <span className="text-sm font-semibold leading-tight">{value}</span>
    </div>
  );
}

function VDivider() {
  return <div className="self-stretch w-px mx-4 shrink-0 bg-divider" />;
}

function FlagsInfoModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl">
        <DialogHeader
          icon={<Flag />}
          subtitle="Reference guide for all parcel condition flags used in the system."
        >
          <DialogTitle>Parcel Flag Definitions</DialogTitle>
        </DialogHeader>
        <DialogBody className='p-6'>
          <div className="divide-y divide-divider">
            {ALL_FLAGS.map(({ key, label, description }) => (
              <div key={key} className="py-3 first:pt-0 last:pb-0">
                <p className="text-sm font-semibold mb-0.5">{label}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
            <br />
            <p className="text-xs text-muted-foreground italic">
              Note: This guide provides general definitions for each flag. Specific criteria for when flags are applied may vary based on local policies and case circumstances.
            </p>  <br />
            <p className="text-xs text-muted-foreground italic">
              Note: This guide provides general definitions for each flag. Specific criteria for when flags are applied may vary based on local policies and case circumstances.
            </p>  <br />
            <p className="text-xs text-muted-foreground italic">
              Note: This guide provides general definitions for each flag. Specific criteria for when flags are applied may vary based on local policies and case circumstances.
            </p>  <br />
            <p className="text-xs text-muted-foreground italic">
              Note: This guide provides general definitions for each flag. Specific criteria for when flags are applied may vary based on local policies and case circumstances.
            </p>  <br />
            <p className="text-xs text-muted-foreground italic">
              Note: This guide provides general definitions for each flag. Specific criteria for when flags are applied may vary based on local policies and case circumstances.
            </p>  <br />
            <p className="text-xs text-muted-foreground italic">
              Note: This guide provides general definitions for each flag. Specific criteria for when flags are applied may vary based on local policies and case circumstances.
            </p>  <br />
            <p className="text-xs text-muted-foreground italic">
              Note: This guide provides general definitions for each flag. Specific criteria for when flags are applied may vary based on local policies and case circumstances.
            </p>  <br />
            <p className="text-xs text-muted-foreground italic">
              Note: This guide provides general definitions for each flag. Specific criteria for when flags are applied may vary based on local policies and case circumstances.
            </p>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Close</Button>
          <Button size="sm">Download PDF</Button>
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
  const { totalDue, isLoading: totalDueLoading } = useTaxYearBalances(parcel.parcelNumber, parcel.caseTaxYears.length > 0 ? parcel.caseTaxYears : undefined);

  return (
    <div>
      <section className="bg-app-primary-toolbar-header px-6 pt-6 border-b border-divider">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-full bg-black/10 p-2 shrink-0">
              <UserCircle2 className="size-6 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold leading-tight">
                {parcel.ownerName}
              </h2>

              <p className="text-sm text-muted-foreground mt-0.5">
                {parcel.propertyAddress}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {parcel.activeCase ? (
              <>
                <span className="text-sm font-semibold">Status:</span>
                <StatusBadge status={parcel.activeCase.status} />
                <div className="w-px h-4 shrink-0 bg-divider" />
                <span className="text-sm font-semibold">Stage:</span>
                <StageBadge stage={parcel.activeCase.stage} />
              </>
            ) : (
              <span className="text-xs text-muted-foreground italic">No Case detected</span>
            )}
          </div>
        </div>

        <div className="flex items-stretch pb-6 overflow-x-auto">
          <InfoCard label="Municipality" value={parcel.municipality} />

          <VDivider />

          <InfoCard label="Current Workflow Tax Years" value={taxYears || '—'} />

          <VDivider />

          <InfoCard
            label="Total Due"
            value={
              totalDueLoading
                ? <span className="text-muted-foreground text-sm">—</span>
                : <span className="text-destructive font-semibold">
                  ${totalDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
            }
          />

          <VDivider />

          <InfoCard
            label="Current Assessed Value"
            value={`$${parcel.assessedValue.toLocaleString()}`}
          />

          <VDivider />

          <InfoCard
            label="Current Payment Plan"
            value={
              parcel.paymentPlan
                ? (
                  <button
                    type="button"
                    onClick={() => onTabChange('Payment Plan Schedule')}
                    className="text-sm font-semibold text-primary hover:underline underline-offset-2 text-left leading-tight"
                  >
                    {parcel.paymentPlan.paymentPlanDescription}
                  </button>
                )
                : <span className="text-muted-foreground text-sm">—</span>
            }
          />
        </div>
      </section>

      <section className='px-6 mb-10'>

        <div className="flex items-stretch gap-0 pt-6">
          {/* Left: Flags + Property Details */}
          <section className="flex flex-col gap-2 w-[40%] shrink-0 min-w-0">
            <PageSection
              icon={<Flag className="size-5 text-muted-foreground" />}
              title="Flags"
              subtitle="parcel conditions and review indicators"
              onHelperClick={() => setFlagsInfoOpen(true)}
              action={
                <Button variant="outline" size="sm" className="h-7 text-xs px-2.5" onClick={() => setEditFlagsOpen(true)}>
                  Edit Flags
                </Button>
              }
            >
              <div className="grid grid-cols-4 gap-x-3 gap-y-2.5">
                {ALL_FLAGS.map(({ key, label }) => {
                  const active = parcel.flags[key];

                  return (
                    <div key={key} className="flex items-center gap-2">
                      <div
                        className={`flex items-center justify-center rounded-full px-2.5 h-6 text-[10px] font-bold shrink-0 min-w-[34px] transition-colors ${active
                          ? 'bg-[var(--color-warning-accent,var(--color-yellow-500))] text-white'
                          : 'bg-muted text-muted-foreground'
                          }`}
                      >
                        {active ? 'On' : 'Off'}
                      </div>
                      <span className="text-xs font-medium text-foreground truncate leading-tight">{label}</span>
                    </div>
                  );
                })}
              </div>
            </PageSection>

            <FlagsInfoModal open={flagsInfoOpen} onOpenChange={setFlagsInfoOpen} />

            <EditFlagsDialog
              open={editFlagsOpen}
              onOpenChange={setEditFlagsOpen}
              parcelNumber={parcel.parcelNumber}
              currentFlags={parcel.flags}
            />

            <div className="my-1" />

            <PageSection
              icon={<LandPlotIcon className="size-5 text-muted-foreground" />}
              title="Property Details"
              subtitle="physical and plat information"
              className=""
              action={
                <Button variant="outline" size="sm" className="h-7 text-xs px-2.5">
                  View Property Details
                </Button>
              }
            >
              <div className="flex flex-col">
                <div className="flex pb-2">
                  <div className="flex flex-col gap-0.5 flex-1 border-b border-r border-divider pb-2 pr-4">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Block</span>
                    <span className="text-sm font-medium">{parcel.block ?? '—'}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 flex-1 border-b border-divider pb-2 pl-4">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Lot</span>
                    <span className="text-sm font-medium">{parcel.lot ?? '—'}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 pt-2">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Plat Description</span>
                  <span className="text-sm font-medium">{parcel.platDescription ?? '—'}</span>
                </div>
              </div>
            </PageSection>
          </section>

          <div className="mx-3" />

          <section className="flex-1 min-w-0 flex flex-col gap-6">
            {parcel.paymentPlan && <PaymentPlanSection paymentPlan={parcel.paymentPlan} />}
            <TaxYearBreakdown parcelNumber={parcel.parcelNumber} taxYears={parcel.caseTaxYears} className="flex-1" />
          </section>
        </div>
      </section>
    </div>
  );
}
