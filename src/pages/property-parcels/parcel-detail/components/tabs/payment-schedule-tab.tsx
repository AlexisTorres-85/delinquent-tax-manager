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
import { usePaymentSchedule } from '@/data/payment-schedule/hooks/use-payment-schedule';
import type { PaymentScheduleEntry } from '@/data/payment-schedule/types';
import { TabLayout, type FilterConfig } from '@/components/ui/tab-layout';
import type { ParcelStatus, ParcelStage } from '@/data/parcels/types';
import { paymentScheduleColumns } from '../../table-columns/payment-schedule.columns';

// ─── Inner table component ────────────────────────────────────────────────────

interface PaymentScheduleTableProps {
    entries: PaymentScheduleEntry[];
    isLoading: boolean;
    lastUpdated: Date | null;
    stickyTop?: number;
    parcelNumber: string;
    onRefresh?: () => void;
    currentStatus?: ParcelStatus;
    currentStage?: ParcelStage;
}

function PaymentScheduleTable({ entries, isLoading, lastUpdated, stickyTop = 0, parcelNumber, onRefresh, currentStatus, currentStage }: PaymentScheduleTableProps) {    const [sorting, setSorting] = useState<SortingState>([{ id: 'dueDate', desc: false }]);
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
        initialState: { pagination: { pageSize: 20 } },
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
        <div>
        <TabLayout
            stickyTop={stickyTop}
            title="Payment Plan Schedule"
            parcelNumber={parcelNumber}
            description="Scheduled tax installment due dates, charges, and payment for each delinquent tax year on this parcel."
            icon="/images/icons/payment-plan-schedule-icon.png"
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
            currentStatus={currentStatus}
            currentStage={currentStage}
        />
        </div>
    );
}

// ─── Tab entry point ──────────────────────────────────────────────────────────

interface PaymentScheduleTabProps {
    parcelNumber: string;
    stickyTop?: number;
    taxYears?: number[];
    currentStatus?: ParcelStatus;
    currentStage?: ParcelStage;
}

export function PaymentScheduleTab({ parcelNumber, stickyTop, taxYears, currentStatus, currentStage }: PaymentScheduleTabProps) {
    const { plan, isRefreshing, lastUpdated, refetch } = usePaymentSchedule(parcelNumber, taxYears);

    return (
        <PaymentScheduleTable
            entries={plan?.paymentSchedule ?? []}
            isLoading={isRefreshing}
            lastUpdated={lastUpdated}
            stickyTop={stickyTop}
            parcelNumber={parcelNumber}
            onRefresh={refetch}
            currentStatus={currentStatus}
            currentStage={currentStage}
        />
    );
}
