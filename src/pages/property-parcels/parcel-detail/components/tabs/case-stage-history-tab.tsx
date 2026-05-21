import { useState, useMemo, useCallback } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    type SortingState,
    type ColumnFiltersState,
} from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import { useCaseStageHistory } from '@/data/cases/case-stage-history/hooks/use-case-stage-history';
import type { ParcelCaseStageHistory, CaseStatus } from '@/data/cases/case-stage-history/types';
import { TabLayout, type FilterConfig } from '@/components/ui/tab-layout';
import type { ParcelStatus, ParcelStage } from '@/data/parcels/types';
import { createCaseStageHistoryColumns } from '../../table-columns/case-stage-history.columns';
import { MoveToNextStageDialog } from '../dialogs/move-to-next-stage-dialog';
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
    currentStatus?: ParcelStatus;
    currentStage?: ParcelStage;
}

function CaseStageHistoryTable({ entries, isLoading, lastUpdated, onRefresh, parcelNumber, stickyTop = 0, hideHeader = false, currentStatus, currentStage }: CaseStageHistoryTableProps) {
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
                icon="/images/icons/contacts-icon.png"
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
                currentStatus={currentStatus}
                currentStage={currentStage}
            />
            {modalEntry && (
                <MoveToNextStageDialog
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
    currentStatus?: ParcelStatus;
    currentStage?: ParcelStage;
}

export function CaseStageHistoryTab({ parcelNumber, stickyTop = 0, initialEntries, initialCases, currentStatus, currentStage }: CaseStageHistoryTabProps) {
    const { entries: fetchedEntries, isLoading: hookLoading, isRefreshing: hookRefreshing, lastUpdated, refetch } = useCaseStageHistory(
        initialEntries ? '' : parcelNumber,
    );

    const entries = initialEntries ?? fetchedEntries;
    const isLoading = initialEntries ? false : hookLoading;
    const isRefreshing = initialEntries ? false : hookRefreshing;

    const [outerHeaderHeight, setOuterHeaderHeight] = useState(0);
    const handleHeaderHeightChange = useCallback((h: number) => setOuterHeaderHeight(h), []);

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
                currentStatus={currentStatus}
                currentStage={currentStage}
            />
        );
    }

    return (
        <TabLayout
            stickyTop={stickyTop}
            title="Case Stage History"
            parcelNumber={parcelNumber}
            headerClassName='border-b border-divider'
            description="Full audit trail of status changes, stage transitions, and actions taken on this parcel."
            icon="/images/icons/case-stages-icon.png"
            lastUpdated={lastUpdated}
            onRefresh={refetch}
            isLoading={isLoading || isRefreshing}
            onHeaderHeightChange={handleHeaderHeightChange}
            currentStatus={currentStatus}
            currentStage={currentStage}
        >
            <Accordion type="single" collapsible defaultValue={defaultOpen} indicator="none">
                {cases.map((parcelCase) => {
                    const caseEntries = entriesByCaseId[parcelCase.caseId] ?? [];
                    const yearsLabel = parcelCase.taxYears.length === 1
                        ? `Tax Year ${parcelCase.taxYears[0]}`
                        : `Tax Years ${parcelCase.taxYears.join(', ')}`;

                    return (
                        <AccordionItem key={parcelCase.caseId} value={parcelCase.caseId}>
                            <AccordionTrigger className="px-6 justify-start gap-3 border-b border-divider [&:has([data-state=open])]:bg-muted">
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
                                    isLoading={isLoading || isRefreshing}
                                    lastUpdated={lastUpdated}
                                    onRefresh={refetch}
                                    parcelNumber={parcelNumber}
                                    stickyTop={stickyTop + outerHeaderHeight}
                                    hideHeader
                                />
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </TabLayout>
    );
}
