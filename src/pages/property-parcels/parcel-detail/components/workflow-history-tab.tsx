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
import { useWorkflowHistory } from '@/data/workflow/workflow-history/hooks/use-workflow-history';
import type { ParcelWorkflowEntry, WorkflowStatus } from '@/data/workflow/workflow-history/types';
import { WORKFLOWS_DUMMY_DATA } from '@/data/workflow/workflow-history/data/workflows-dummy-data';
import { TabLayout, type FilterConfig } from './tab-layout';
import { createWorkflowHistoryColumns } from '../table-columns/workflow-history.columns';
import { MoveToNextStageModal } from './move-to-next-stage-modal';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

// ─── Active-first sort comparator ─────────────────────────────────────────────
//
// When no user sort is applied, the active stage always floats to the top.
// Once the user clicks a column header the normal sort takes over, but the
// active row still "wins" ties thanks to the secondary sort applied here.
function sortWithActivePinned(a: ParcelWorkflowEntry, b: ParcelWorkflowEntry): number {
    if (a.isActive && !b.isActive) return -1;
    if (!a.isActive && b.isActive) return 1;
    return 0;
}

// ─── Row className helper ─────────────────────────────────────────────────────

function getWorkflowRowClassName(row: unknown): string | undefined {
    const entry = row as ParcelWorkflowEntry;
    return entry.isActive
        ? 'active-workflow-row'
        : undefined;
}

const WORKFLOW_STATUSES: WorkflowStatus[] = [
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

interface WorkflowHistoryTableProps {
    entries: import('@/data/workflow/workflow-history/types').ParcelWorkflowEntry[];
    isLoading: boolean;
    lastUpdated: Date | null;
    onRefresh?: () => void;
    parcelNumber: string;
    stickyTop?: number;
    hideHeader?: boolean;
}

function WorkflowHistoryTable({ entries, isLoading, lastUpdated, onRefresh, parcelNumber, stickyTop = 0, hideHeader = false }: WorkflowHistoryTableProps) {
    // Default sort: active stage first, then most-recent date
    const [sorting, setSorting] = useState<SortingState>([{ id: 'dateTime', desc: true }]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [modalEntry, setModalEntry] = useState<ParcelWorkflowEntry | null>(null);

    const columns = useMemo(
        () => createWorkflowHistoryColumns((entry) => setModalEntry(entry)),
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
        initialState: { pagination: { pageSize: 10 } },
    });

    const filters: FilterConfig[] = [
        {
            value: statusFilter,
            onChange: handleStatusChange,
            placeholder: 'All Statuses',
            options: [
                { value: 'all', label: 'All Statuses' },
                ...WORKFLOW_STATUSES.map((s) => ({ value: s, label: s })),
            ],
        },
    ];

    return (
        <>
            <TabLayout
                stickyTop={stickyTop}
                title="Workflow History"
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
                getRowClassName={getWorkflowRowClassName}
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
        </>
    );
}

// ─── Tab entry point ──────────────────────────────────────────────────────────

interface WorkflowHistoryTabProps {
    parcelNumber: string;
    stickyTop?: number;
}

export function WorkflowHistoryTab({ parcelNumber, stickyTop = 0 }: WorkflowHistoryTabProps) {
    const { entries, isLoading, isRefreshing, lastUpdated, refetch } = useWorkflowHistory(parcelNumber);

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

    // Workflows for this parcel (synchronous — constant data)
    const workflows = useMemo(
        () => WORKFLOWS_DUMMY_DATA.filter((w) => w.parcelNumber === parcelNumber),
        [parcelNumber],
    );

    // Default open: the active workflow; fall back to the first one
    const defaultOpen = useMemo(
        () => (workflows.find((w) => w.isActive) ?? workflows[0])?.workflowId ?? '',
        [workflows],
    );

    // Group history entries by workflowId
    const entriesByWorkflowId = useMemo(() => {
        const map: Record<string, ParcelWorkflowEntry[]> = {};
        for (const entry of entries) {
            (map[entry.workflowId] ??= []).push(entry);
        }
        return map;
    }, [entries]);

    // No workflows — fall back to full table (shows empty state)
    if (workflows.length === 0) {
        return (
            <WorkflowHistoryTable
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
                        {isRefreshing ? 'Loading Workflow History...' : 'Workflow History'}
                    </h2>
                    <p className="text-sm -mt-1 text-muted-foreground">Full audit trail of status changes, stage transitions, and actions taken on this parcel.</p>
                </div>
            </div>

            {isLoading ? (
                // Skeleton accordion items shown during initial load
                <div>
                    {workflows.length > 0 ? workflows.map((workflow) => (
                        <div key={workflow.workflowId} className="border-b border-border">
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
                {workflows.map((workflow) => {
                    const workflowEntries = entriesByWorkflowId[workflow.workflowId] ?? [];
                    const yearsLabel = workflow.taxYears.length === 1
                        ? `Tax Year ${workflow.taxYears[0]}`
                        : `Tax Years ${workflow.taxYears.join(', ')}`;

                    return (
                        <AccordionItem key={workflow.workflowId} value={workflow.workflowId}>
                            <AccordionTrigger className="px-6 justify-start gap-3">
                                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                                <span className="font-semibold">{yearsLabel}</span>
                                <span className="text-xs text-muted-foreground font-mono">{workflow.workflowId}</span>
                                <Badge variant={workflow.isActive ? 'success' : 'secondary'} className="text-xs">
                                    {workflow.isActive ? 'Active' : 'Closed'}
                                </Badge>
                            </AccordionTrigger>
                            <AccordionContent className="p-0">
                                <WorkflowHistoryTable
                                    entries={workflowEntries}
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
