import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useParcel } from '@/data/parcels/hooks/use-parcel';
import { useWorkflow } from '@/data/parcels/hooks/use-workflow';
import { ArrowLeft, LandPlotIcon, Printer, Download, Mail, RefreshCw, Info } from 'lucide-react';
import type { Parcel, ParcelFlag, ParcelStatus } from '@/data/parcels/types';
import { StatusBadge, StageBadge } from '@/components/ui/parcel-badges';
import { LifecycleHelpDrawer } from './components/lifecycle-help-drawer';
import { TaxPaymentsTab } from './components/tax-payments-tab';
import { PaymentScheduleTab } from './components/payment-schedule-tab';
import { DocumentsTab } from './components/documents-tab';

const ALL_FLAGS: ParcelFlag[] = ['Foreclosure', 'Deeded', 'Contaminated', 'Bankruptcy', 'Flood Plain', 'In Rem', 'Razing', 'Outlot'];

function UpdateStatusPopover({ parcel }: { parcel: Parcel }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<ParcelStatus>(parcel.status);
  const [stage, setStage] = useState<string>(parcel.stage);
  const [note, setNote] = useState('');
  const { statuses, isLoading: workflowLoading } = useWorkflow();

  function handleStatusChange(newStatus: ParcelStatus) {
    setStatus(newStatus);
    const firstStage = statuses.find((s) => s.name === newStatus)?.stages[0]?.name ?? '';
    setStage(firstStage);
  }

  function handleSave() {
    // TODO: wire to API � parcelService.updateStatus(parcel.id, { status, stage, note })
    console.log('Update case status:', { status, stage, note });
    setNote('');
    setOpen(false);
  }

  const availableStages = statuses.find((s) => s.name === status)?.stages ?? [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4" />
          Update Case Status
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <p className="text-sm font-semibold mb-4">Update Case Status</p>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Status</Label>
            <Select value={status} onValueChange={(v) => handleStatusChange(v as ParcelStatus)} disabled={workflowLoading}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Stage</Label>
            <Select value={stage} onValueChange={setStage} disabled={workflowLoading}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableStages.map((s) => (
                  <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Note <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Textarea
              className="text-sm resize-none"
              rows={2}
              placeholder="Reason for change�"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Save</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function InfoCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 min-w-[100px]">
      <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{label}</span>
      <span className="text-sm font-semibold leading-tight">{value}</span>
    </div>
  );
}

function VDivider() {
  return <div className="self-stretch w-px shrink-0 bg-divider" />;
}

function ParcelHeader({ parcel }: { parcel: Parcel }) {
  const yearsDelinquent = parcel.taxYears.length;

  return (
    <div className="px-6 py-6 border-b border-divider">
  {/* Owner row */}
  <div className="flex items-start justify-between gap-4 mb-4">
    <div>
      <h2 className="text-lg font-semibold leading-tight">
        {parcel.ownerName}
      </h2>

      <p className="text-sm text-muted-foreground mt-0.5">
        {parcel.propertyAddress}
      </p>
    </div>
    <div className="flex flex-col items-end gap-2 shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">Status:</span>
        <StatusBadge status={parcel.status} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">Stage:</span>
        <StageBadge stage={parcel.stage} />
      </div>
    </div>
  </div>

  {/* Summary row */}
  <div className="flex items-stretch gap-6 py-5 border-t border-divider overflow-x-auto">
    <InfoCard label="Municipality" value={parcel.municipality} />

    <VDivider />

    <InfoCard
      label="Total Due"
      value={
        <span className="text-destructive font-semibold">
          ${parcel.amountDue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
          })}
        </span>
      }
    />

    <VDivider />

    <InfoCard
      label="Assessed Value"
      value={`$${parcel.assessedValue.toLocaleString()}`}
    />

    <VDivider />

    <InfoCard
      label="Years Delinquent"
      value={
        yearsDelinquent > 0
          ? `${yearsDelinquent} yr${yearsDelinquent !== 1 ? 's' : ''}`
          : '—'
      }
    />

    <VDivider />

    <InfoCard
      label="Delinquent Years"
      value={parcel.taxYears.join(', ')}
    />

    <VDivider />

    <InfoCard label="Lot Size" value={parcel.lotSize} />

    <VDivider />

    <InfoCard
      label="Payment Plan"
      value={
         <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            Active
          </Badge>
      }
    />
  </div>

  {/* Flags row */}
  <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-divider">
    <span className="font-semibold text-sm shrink-0 mr-1">
      Flags:
    </span>

    {ALL_FLAGS.map((flag) => {
      const active = parcel.flags.includes(flag);

      return (
        <Badge
          key={flag}
          variant={active ? 'destructive' : 'secondary'}
          className={
            active
              ? 'px-2 py-1 font-medium'
              : 'px-2 py-1 font-medium bg-muted text-muted-foreground'
          }
        >
          {flag}
        </Badge>
      );
    })}
  </div>
</div>
  );
}

const TABS = [
  'Tax Payments',
  'Payment Schedule',
  'Documents',
  'Contacts',
  'Workflow History',
  'Notes',
  'Expenses',
  'Legal Description',
] as const;

function ParcelDetailContent({ parcel }: { parcel: Parcel }) {
  const tabsBarRef = useRef<HTMLDivElement>(null);
  const [stickyTop, setStickyTop] = useState(0);

  useEffect(() => {
    const el = tabsBarRef.current;
    if (!el) return;
    setStickyTop(el.offsetHeight);
    const obs = new ResizeObserver(() => setStickyTop(el.offsetHeight));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tabs defaultValue="Tax Payments" className="flex flex-col">
      <ParcelHeader parcel={parcel} />
      <div ref={tabsBarRef} className="sticky top-0 z-10 shrink-0">
        <TabsList variant="app-primary" className="px-6 w-full justify-start">
          {TABS.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              <div className='pt-1 pb-1'>{tab}</div>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="Tax Payments" className="mt-0">
        <TaxPaymentsTab parcelNumber={parcel.parcelNumber} stickyTop={stickyTop} />
      </TabsContent>

      <TabsContent value="Payment Schedule" className="mt-0">
        <PaymentScheduleTab parcelNumber={parcel.parcelNumber} stickyTop={stickyTop} />
      </TabsContent>

      <TabsContent value="Documents" className="mt-0">
        <DocumentsTab parcelNumber={parcel.parcelNumber} stickyTop={stickyTop} />
      </TabsContent>

      {TABS.filter((tab) => tab !== 'Tax Payments' && tab !== 'Payment Schedule' && tab !== 'Documents').map((tab) => (
        <TabsContent key={tab} value={tab} className="p-6 mt-0">
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            {tab}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex justify-between pb-4 border-b border-divider">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="grid grid-cols-5 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ParcelDetailPage() {
  const { parcelNumber } = useParams<{ parcelNumber: string }>();
  const navigate = useNavigate();
  const { parcel, isLoading, notFound } = useParcel(parcelNumber ?? '');
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <ContentWrapper
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Property Parcel Lookup', href: '/property-parcels' },
        { label: parcelNumber ?? 'Detail' },
      ]}
      actions={
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      }
      mainHeader={{
        icon: <LandPlotIcon />,
        title: parcelNumber ?? 'Parcel Detail',
        actions: (
          <>
            {parcel && (
              <>
                <UpdateStatusPopover parcel={parcel} />
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Lifecycle help" onClick={() => setHelpOpen(true)}>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </Button>
                <LifecycleHelpDrawer open={helpOpen} onClose={() => setHelpOpen(false)} />
                <div className="w-px h-4 shrink-0 mx-1 bg-divider" />
              </>
            )}
            <Button variant="outline" size="sm" title="Print Letters">
              <Mail className="h-4 w-4" />
              <span className="sr-only">Print Letters</span>
            </Button>
            <Button variant="outline" size="sm" title="Export">
              <Download className="h-4 w-4" />
              <span className="sr-only">Export</span>
            </Button>
            <Button variant="outline" size="sm" title="Print">
              <Printer className="h-4 w-4" />
              <span className="sr-only">Print</span>
            </Button>
          </>
        ),
      }}
      mainClassName="p-0"
      main={
        isLoading ? (
          <LoadingSkeleton />
        ) : notFound ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2 text-muted-foreground">
            <p className="text-sm font-medium">Parcel not found.</p>
            <p className="text-xs">No record exists for &quot;{parcelNumber}&quot;.</p>
          </div>
        ) : (
          <ParcelDetailContent parcel={parcel!} />
        )
      }
    />
  );
}
