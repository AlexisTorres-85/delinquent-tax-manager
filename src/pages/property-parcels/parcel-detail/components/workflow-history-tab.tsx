import { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    type SortingState,
    type ColumnFiltersState,
} from '@tanstack/react-table';
import { History } from 'lucide-react';
import { useWorkflowHistory } from '@/data/workflow-history/hooks/use-workflow-history';
import type { ParcelWorkflowEntry, WorkflowStatus } from '@/data/workflow-history/types';
import { TabLayout, type FilterConfig } from './tab-layout';
import { createWorkflowHistoryColumns } from '../table-columns/workflow-history.columns';
import { MoveToNextStageModal } from './move-to-next-stage-modal';

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
    entries: import('@/data/workflow-history/types').ParcelWorkflowEntry[];
    isLoading: boolean;
    lastUpdated: Date | null;
    onRefresh?: () => void;
    parcelNumber: string;
    stickyTop?: number;
}

function WorkflowHistoryTable({ entries, isLoading, lastUpdated, onRefresh, parcelNumber, stickyTop = 0 }: WorkflowHistoryTableProps) {
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

export function WorkflowHistoryTab({ parcelNumber, stickyTop }: WorkflowHistoryTabProps) {
    const { entries, isRefreshing, lastUpdated, refetch } = useWorkflowHistory(parcelNumber);

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
