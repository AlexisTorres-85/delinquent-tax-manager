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
import { Skeleton } from '@/components/ui/skeleton';
import { usePaymentSchedule } from '@/data/payment-schedule/hooks/use-payment-schedule';
import type { PaymentScheduleEntry, PaymentPlanSummary } from '@/data/payment-schedule/types';
import { CalendarDays } from 'lucide-react';
import { ScheduleBanner } from './schedule-banner';
import { TabLayout, type FilterConfig } from './tab-layout';
import { paymentScheduleColumns } from '../table-columns/payment-schedule.columns';

// ─── Inner table component ────────────────────────────────────────────────────

interface PaymentScheduleTableProps {
    entries: PaymentScheduleEntry[];
    summary: PaymentPlanSummary;
    isLoading: boolean;
    lastUpdated: Date | null;
    stickyTop?: number;
    parcelNumber: string;
    onRefresh?: () => void;
}

function PaymentScheduleTable({ entries, summary, isLoading, lastUpdated, stickyTop = 0, parcelNumber, onRefresh }: PaymentScheduleTableProps) {    const [sorting, setSorting] = useState<SortingState>([{ id: 'dueDate', desc: false }]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [yearFilter, setYearFilter] = useState('all');

    const uniqueYears = useMemo(
        () => [...new Set(entries.map((e) => e.taxYear))].sort((a, b) => b - a),
        [entries],
    );

    function handleYearChange(val: string) {
        setYearFilter(val);
        setColumnFilters((prev) => {
            const next = prev.filter((f) => f.id !== 'taxYear');
            if (val !== 'all') next.push({ id: 'taxYear', value: Number(val) });
            return next;
        });
    }

    const hasActiveFilters = globalFilter !== '' || yearFilter !== 'all';

    function clearFilters() {
        setGlobalFilter('');
        setYearFilter('all');
        setColumnFilters([]);
    }

    const table = useReactTable({
        data: entries,
        columns: paymentScheduleColumns,
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
            value: yearFilter,
            onChange: handleYearChange,
            placeholder: 'All Years',
            options: [
                { value: 'all', label: 'All Years' },
                ...uniqueYears.map((y) => ({ value: String(y), label: String(y) })),
            ],
        },
    ];

    return (
        <TabLayout
            stickyTop={stickyTop}
            title="Payment Schedule"
            parcelNumber={parcelNumber}
            description="Scheduled tax installment due dates, charges, and payment for each delinquent tax year on this parcel."
            icon={<CalendarDays className="h-8 w-8" />}
            isCatalisData={true}
            lastUpdated={lastUpdated}
            searchPlaceholder="Search schedule..."
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            filters={filters}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            onRefresh={onRefresh}
            table={table}
            recordCount={table.getFilteredRowModel().rows.length}
            isLoading={isLoading}
            banner={<ScheduleBanner summary={summary} isLoading={isLoading} />}
        />
    );
}

// ─── Tab entry point ──────────────────────────────────────────────────────────

interface PaymentScheduleTabProps {
    parcelNumber: string;
    stickyTop?: number;
}

export function PaymentScheduleTab({ parcelNumber, stickyTop }: PaymentScheduleTabProps) {
    const { plan, isLoading, isRefreshing, lastUpdated, refetch } = usePaymentSchedule(parcelNumber);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-3 p-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
                No payment schedule on record for this parcel.
            </div>
        );
    }

    return (
        <PaymentScheduleTable
            entries={plan.paymentSchedule}
            summary={plan.paymentPlanSummary}
            isLoading={isRefreshing}
            lastUpdated={lastUpdated}
            stickyTop={stickyTop}
            parcelNumber={parcelNumber}
            onRefresh={refetch}
        />
    );
}
