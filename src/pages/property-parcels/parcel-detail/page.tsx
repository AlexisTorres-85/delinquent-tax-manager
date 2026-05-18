import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useParcelDetail } from '@/data/parcels/hooks/use-parcel-detail';
import { useCase } from '@/data/parcels/hooks/use-case';
import { ArrowLeft, LandPlotIcon, Printer, Download, Mail, RefreshCw, Info } from 'lucide-react';
import type { Parcel, ParcelStatus } from '@/data/parcels/types';
import { LifecycleHelpDrawer } from './components/lifecycle-help-drawer';
import { TaxPaymentsTab } from './components/tabs/tax-payments-tab';
import { PaymentScheduleTab } from './components/tabs/payment-schedule-tab';
import { DocumentsTab } from './components/tabs/documents-tab';
import { ContactsTab } from './components/tabs/contacts-tab';
import { CaseStageHistoryTab } from './components/tabs/case-stage-history-tab';
import { NotesTab } from './components/tabs/notes-tab';
import { ExpensesTab } from './components/tabs/expenses-tab';
import { LegalDescriptionTab } from './components/tabs/legal-description-tab';
import { OverviewTab } from './components/tabs/overview-tab';
import { UpdateStatusForm, CURRENT_YEAR } from './components/update-status-form';

function UpdateStatusPopover({ parcel }: { parcel: Parcel }) {
  const isNewCase = !parcel.activeCase;
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<ParcelStatus | ''>(parcel.activeCase?.status ?? '');
  const [stage, setStage] = useState<string>(parcel.activeCase?.stage ?? '');
  const [note, setNote] = useState('');
  const [selectedYears, setSelectedYears] = useState<number[]>([CURRENT_YEAR - 1]);
  const { statuses, isLoading: caseLoading } = useCase();

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      setNote('');
      if (isNewCase) setSelectedYears([CURRENT_YEAR - 1]);
    }
    setOpen(newOpen);
  }

  function handleYearToggle(year: number, checked: boolean) {
    setSelectedYears((prev) =>
      checked ? [...prev, year].sort((a, b) => a - b) : prev.filter((y) => y !== year)
    );
  }

  function handleStatusChange(newStatus: ParcelStatus) {
    setStatus(newStatus);
    const firstStage = statuses.find((s) => s.name === newStatus)?.stages[0]?.name ?? '';
    setStage(firstStage);
  }

  function handleSave() {
    const finalStatus = isNewCase ? 'Delinquent' : status;
    const finalStage = isNewCase ? 'Initial Delinquency' : stage;
    // TODO: wire to API - parcelService.updateStatus(parcel.id, { status: finalStatus, stage: finalStage, note, taxYears: selectedYears })
    console.log('Update case status:', { status: finalStatus, stage: finalStage, note, taxYears: isNewCase ? selectedYears : undefined });
    setNote('');
    if (isNewCase) setSelectedYears([CURRENT_YEAR - 1]);
    setOpen(false);
  }

  const availableStages = statuses.find((s) => s.name === status)?.stages ?? [];

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {isNewCase ? (
          <Button variant="primary" size="sm">
            <RefreshCw className="h-4 w-4" />
            Start Delinquent Process
          </Button>
        ) : (
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
            Update Case Status
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-100 p-0 rounded-xl border-r-4 border-r-app-secondary/50 overflow-hidden shadow-xl shadow-black/15" align="end">
        <UpdateStatusForm
          isNewWorkflow={isNewCase}
          status={status}
          stage={stage}
          note={note}
          selectedYears={selectedYears}
          availableStages={availableStages}
          workflowLoading={caseLoading}
          statuses={statuses}
          onStatusChange={handleStatusChange}
          onStageChange={setStage}
          onNoteChange={setNote}
          onYearToggle={handleYearToggle}
          onCancel={() => handleOpenChange(false)}
          onSave={handleSave}
        />
      </PopoverContent>
    </Popover>
  );
}

const TABS = [
  'Overview',
  'Tax Payments',
  'Payment Plan Schedule',
  'Documents',
  'Contacts',
  'Case Stage History',
  'Notes',
  'Expenses',
  'Legal Description',
] as const;

type Tab = typeof TABS[number];

const TAB_TO_SLUG: Record<Tab, string> = {
  'Overview': 'overview',
  'Tax Payments': 'tax-payments',
  'Payment Plan Schedule': 'payment-plan-schedule',
  'Documents': 'documents',
  'Contacts': 'contacts',
  'Case Stage History': 'case-stage-history',
  'Notes': 'notes',
  'Expenses': 'expenses',
  'Legal Description': 'legal-description',
};

const SLUG_TO_TAB: Record<string, Tab> = Object.fromEntries(
  Object.entries(TAB_TO_SLUG).map(([tab, slug]) => [slug, tab as Tab]),
);

function ParcelDetailContent({ parcel, isError, error, parcelNumber, activeTab, onTabChange }: { parcel: Parcel | null | undefined; isError: boolean; error: unknown; parcelNumber: string; activeTab: Tab; onTabChange: (tab: Tab) => void }) {
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

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2 text-muted-foreground">
        <p className="text-sm font-medium text-destructive">Failed to load parcel data from API.</p>
        <p className="text-xs">{error instanceof Error ? error.message : 'An unexpected error occurred.'}</p>
      </div>
    );
  }

  if (!parcel) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2 text-muted-foreground">
        <p className="text-sm font-medium">Parcel not found.</p>
        <p className="text-xs">No record exists for &quot;{parcelNumber}&quot;.</p>
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as Tab)} className="flex flex-col">
      <div ref={tabsBarRef} className="sticky top-0 z-10 shrink-0">
        <TabsList variant="app-primary" className="px-6 w-full justify-start">
          {TABS.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              <div className='pt-2 pb-2'>{tab}</div>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="Overview" className="mt-0">
        <OverviewTab parcel={parcel} onTabChange={onTabChange as (tab: string) => void} />
      </TabsContent>

      <TabsContent value="Tax Payments" className="mt-0">
        <TaxPaymentsTab parcelNumber={parcel.parcelNumber} stickyTop={stickyTop} taxYears={parcel.caseTaxYears} />
      </TabsContent>

      <TabsContent value="Payment Plan Schedule" className="mt-0">
        <PaymentScheduleTab parcelNumber={parcel.parcelNumber} stickyTop={stickyTop} taxYears={parcel.caseTaxYears} />
      </TabsContent>

      <TabsContent value="Documents" className="mt-0">
        <DocumentsTab parcelNumber={parcel.parcelNumber} stickyTop={stickyTop} />
      </TabsContent>

      <TabsContent value="Contacts" className="mt-0">
        <ContactsTab parcelNumber={parcel.parcelNumber} stickyTop={stickyTop} />
      </TabsContent>

      <TabsContent value="Case Stage History" className="mt-0">
        <CaseStageHistoryTab
          parcelNumber={parcel.parcelNumber}
          stickyTop={stickyTop}
          initialEntries={parcel.caseStageHistory}
          initialCases={parcel.activeCaseMeta ? [parcel.activeCaseMeta] : undefined}
        />
      </TabsContent>

      <TabsContent value="Notes" className="mt-0">
        <NotesTab parcelNumber={parcel.parcelNumber} stickyTop={stickyTop} />
      </TabsContent>

      <TabsContent value="Expenses" className="mt-0">
        <ExpensesTab parcelNumber={parcel.parcelNumber} stickyTop={stickyTop} />
      </TabsContent>

      <TabsContent value="Legal Description" className="mt-0">
        <LegalDescriptionTab parcel={parcel} parcelNumber={parcel.parcelNumber} isLoading={false} stickyTop={stickyTop} />
      </TabsContent>

      {TABS.filter((tab) => tab !== 'Overview' && tab !== 'Tax Payments' && tab !== 'Payment Plan Schedule' && tab !== 'Documents' && tab !== 'Contacts' && tab !== 'Case Stage History' && tab !== 'Notes' && tab !== 'Expenses' && tab !== 'Legal Description').map((tab) => (
        <TabsContent key={tab} value={tab} className="p-6 mt-0">
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            {tab}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

export function ParcelDetailPage() {
  const { parcelNumber, tab } = useParams<{ parcelNumber: string; tab: string }>();
  const navigate = useNavigate();
  const { parcel, isLoading, isError: apiError, error: apiErr } = useParcelDetail(parcelNumber ?? '');
  const [helpOpen, setHelpOpen] = useState(false);

  const taxYearsSubtitle = parcel && parcel.caseTaxYears.length > 0
    ? `Current Case Tax Years: ${parcel.caseTaxYears.join(', ')}`
    : undefined;

  const activeTab: Tab = (tab && SLUG_TO_TAB[tab]) ? SLUG_TO_TAB[tab] : 'Overview';

  function handleTabChange(newTab: Tab) {
    navigate(
      `/property-parcels/delinquent-parcel-cases/${parcelNumber}/${TAB_TO_SLUG[newTab]}`,
      { replace: true },
    );
  }

  return (
    <ContentWrapper
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Property Parcels', href: '/property-parcels/delinquent-parcel-cases' },
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
        subtitle: taxYearsSubtitle,
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
      isLoading={isLoading}
      main={
        <ParcelDetailContent
          parcel={parcel}
          isError={apiError}
          error={apiErr}
          parcelNumber={parcelNumber ?? ''}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      }
    />
  );
}
