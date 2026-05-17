import { useState, useMemo, useRef, useEffect } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    type SortingState,
    type ColumnFiltersState,
} from '@tanstack/react-table';
import { History, ChevronDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCaseStageHistory } from '@/data/cases/case-stage-history/hooks/use-case-stage-history';
import type { ParcelCaseStageHistory, CaseStatus } from '@/data/cases/case-stage-history/types';
import { TabLayout, type FilterConfig } from './tab-layout';
import { createCaseStageHistoryColumns } from '../table-columns/case-stage-history.columns';
import { MoveToNextStageModal } from './move-to-next-stage-modal';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

// ─── Active-first sort comparator ─────────────────────────────────────────────
//
// When no user sort is applied, the active stage always floats to the top.
// Once the user clicks a column header the normal sort takes over, but the
// active row still "wins" ties thanks to the secondary sort applied here.
function sortWithActivePinned(a: ParcelCaseStageHistory, b: ParcelCaseStageHistory): number {
    if (a.isActive && !b.isActive) return -1;
    if (!a.isActive && b.isActive) return 1;
    return 0;
}

// ─── Row className helper ─────────────────────────────────────────────────────

function getCaseRowClassName(row: unknown): string | undefined {
    const entry = row as ParcelCaseStageHistory;
    return entry.isActive
        ? 'active-case-row'
        : undefined;
}

const CASE_STATUSES: CaseStatus[] = [
    'Delinquent',
    'Payment Plan',
    'Early Enforcement',
    'Tax Deed Preparation',
    'Advertisement / Waiting',
    'Auction / Sale',
    'Post-Deed Processing',
    'Financial Processing',
    'On Hold',
    'Review',
    'Legal',
    'Complete',
];

// ─── Inner table component ────────────────────────────────────────────────────

interface CaseStageHistoryTableProps {
    entries: import('@/data/cases/case-stage-history/types').ParcelCaseStageHistory[];
    isLoading: boolean;
    lastUpdated: Date | null;
    onRefresh?: () => void;
    parcelNumber: string;
    stickyTop?: number;
    hideHeader?: boolean;
}

function CaseStageHistoryTable({ entries, isLoading, lastUpdated, onRefresh, parcelNumber, stickyTop = 0, hideHeader = false }: CaseStageHistoryTableProps) {
    // Default sort: active stage first, then most-recent date
    const [sorting, setSorting] = useState<SortingState>([{ id: 'dateTime', desc: true }]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [modalEntry, setModalEntry] = useState<ParcelCaseStageHistory | null>(null);

    const columns = useMemo(
        () => createCaseStageHistoryColumns((entry) => setModalEntry(entry)),
        [],
    );

    // Stable sorted data: active row always pinned first regardless of column sort
    const sortedEntries = useMemo(
        () => [...entries].sort(sortWithActivePinned),
        [entries],
    );

    function handleStatusChange(val: string) {
        setStatusFilter(val);
        setColumnFilters((prev) => {
            const next = prev.filter((f) => f.id !== 'status');
            if (val !== 'all') next.push({ id: 'status', value: val });
            return next;
        });
    }

    const hasActiveFilters = globalFilter !== '' || statusFilter !== 'all';

    function clearFilters() {
        setGlobalFilter('');
        setStatusFilter('all');
        setColumnFilters([]);
    }

    const table = useReactTable({
        data: sortedEntries,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        state: { sorting, globalFilter, columnFilters },
        initialState: { pagination: { pageSize: 20 } },
    });

    const filters: FilterConfig[] = [
        {
            value: statusFilter,
            onChange: handleStatusChange,
            placeholder: 'All Statuses',
            options: [
                { value: 'all', label: 'All Statuses' },
                ...CASE_STATUSES.map((s) => ({ value: s, label: s })),
            ],
        },
    ];

    return (
        <>
        <div>
            <TabLayout
                stickyTop={stickyTop}
                title="Case Stage History"
                parcelNumber={parcelNumber}
                description="Full audit trail of status changes, stage transitions, and actions taken on this parcel."
                icon={<History className="h-8 w-8" />}
                lastUpdated={lastUpdated}
                searchPlaceholder="Search history..."
                globalFilter={globalFilter}
                onGlobalFilterChange={setGlobalFilter}
                filters={filters}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={clearFilters}
                onRefresh={onRefresh}
                table={table}
                recordCount={table.getFilteredRowModel().rows.length}
                isLoading={isLoading}
                getRowClassName={getCaseRowClassName}
                hideHeader={hideHeader}
            />
            {modalEntry && (
                <MoveToNextStageModal
                    open={!!modalEntry}
                    onOpenChange={(open) => { if (!open) setModalEntry(null); }}
                    entry={modalEntry}
                    parcelNumber={parcelNumber}
                />
            )}
            </div>
        </>
    );
}

// ─── Tab entry point ──────────────────────────────────────────────────────────

interface CaseStageHistoryTabProps {
    parcelNumber: string;
    stickyTop?: number;
    initialEntries?: import('@/data/cases/case-stage-history/types').ParcelCaseStageHistory[];
    initialCases?: import('@/data/cases/case-stage-history/types').ParcelCase[];
}

export function CaseStageHistoryTab({ parcelNumber, stickyTop = 0, initialEntries, initialCases }: CaseStageHistoryTabProps) {
    const { entries: fetchedEntries, isLoading: hookLoading, isRefreshing: hookRefreshing, lastUpdated, refetch } = useCaseStageHistory(
        initialEntries ? '' : parcelNumber,
    );

    const entries = initialEntries ?? fetchedEntries;
    const isLoading = initialEntries ? false : hookLoading;
    const isRefreshing = initialEntries ? false : hookRefreshing;

    const sharedHeaderRef = useRef<HTMLDivElement>(null);
    const [sharedHeaderHeight, setSharedHeaderHeight] = useState(0);

    useEffect(() => {
        const el = sharedHeaderRef.current;
        if (!el) return;
        setSharedHeaderHeight(el.offsetHeight);
        const obs = new ResizeObserver(() => setSharedHeaderHeight(el.offsetHeight));
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    // Cases for this parcel — provided directly from the parcel API
    const cases = useMemo(
        () => initialCases ?? [],
        [initialCases],
    );

    // Default open: the active case; fall back to the first one
    const defaultOpen = useMemo(
        () => (cases.find((c) => c.isActive) ?? cases[0])?.caseId ?? '',
        [cases],
    );

    // Group history entries by caseId
    const entriesByCaseId = useMemo(() => {
        const map: Record<string, ParcelCaseStageHistory[]> = {};
        for (const entry of entries) {
            (map[entry.caseId] ??= []).push(entry);
        }
        return map;
    }, [entries]);

    // No cases — fall back to full table (shows empty state)
    if (cases.length === 0) {
        return (
            <CaseStageHistoryTable
                entries={entries}
                isLoading={isRefreshing}
                lastUpdated={lastUpdated}
                onRefresh={refetch}
                parcelNumber={parcelNumber}
                stickyTop={stickyTop}
            />
        );
    }

    return (
        <div>
            {/* Section header shared by all workflows */}
            <div ref={sharedHeaderRef} className="bg-app-primary-toolbar-header pl-6 pr-6 pt-4 pb-4 h-20 flex border-b border-divider items-center gap-2 sticky z-10" style={{ top: stickyTop }}>
                <div className="shrink-0 text-muted-foreground">
                    {isRefreshing
                        ? <img src='/images/loading.gif' className='h-8 w-8 object-contain' alt='Loading' />
                        : <History className="h-8 w-8" />}
                </div>
                <div className="flex flex-col">
                    <h2 className="text-lg font-semibold text-neutral-900">
                        {isRefreshing ? 'Loading Case Stage History...' : 'Case Stage History'}
                    </h2>
                    <p className="text-sm -mt-1 text-muted-foreground">Full audit trail of status changes, stage transitions, and actions taken on this parcel.</p>
                </div>
            </div>

            {isLoading ? (
                // Skeleton accordion items shown during initial load
                <div>
                    {cases.length > 0 ? cases.map((c) => (
                        <div key={c.caseId} className="border-b border-border">
                            <div className="flex items-center gap-3 px-6 py-4">
                                <Skeleton className="h-4 w-4 rounded" />
                                <Skeleton className="h-4 w-36" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-5 w-14 rounded-md" />
                            </div>
                        </div>
                    )) : Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="border-b border-border">
                            <div className="flex items-center gap-3 px-6 py-4">
                                <Skeleton className="h-4 w-4 rounded" />
                                <Skeleton className="h-4 w-36" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-5 w-14 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
            <Accordion type="single" collapsible defaultValue={defaultOpen} indicator="none">
                {cases.map((parcelCase) => {
                    const caseEntries = entriesByCaseId[parcelCase.caseId] ?? [];
                    const yearsLabel = parcelCase.taxYears.length === 1
                        ? `Tax Year ${parcelCase.taxYears[0]}`
                        : `Tax Years ${parcelCase.taxYears.join(', ')}`;

                    return (
                        <AccordionItem key={parcelCase.caseId} value={parcelCase.caseId}>
                            <AccordionTrigger className="px-6 justify-start gap-3">
                                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                                <span className="font-semibold">{yearsLabel}</span>
                                <span className="text-xs text-muted-foreground font-mono">{parcelCase.caseId}</span>
                                <Badge variant={parcelCase.isActive ? 'success' : 'secondary'} className="text-xs">
                                    {parcelCase.isActive ? 'Active' : 'Closed'}
                                </Badge>
                            </AccordionTrigger>
                            <AccordionContent className="p-0">
                                <CaseStageHistoryTable
                                    entries={caseEntries}
                                    isLoading={isRefreshing}
                                    lastUpdated={lastUpdated}
                                    onRefresh={refetch}
                                    parcelNumber={parcelNumber}
                                    stickyTop={stickyTop + sharedHeaderHeight}
                                    hideHeader
                                />
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
            )}
        </div>
    );
}
