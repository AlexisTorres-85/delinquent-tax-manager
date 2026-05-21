import { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    type SortingState,
    type ColumnFiltersState,
} from '@tanstack/react-table';
import { useTaxPayments } from '@/data/tax-payments/hooks/use-tax-payments';
import type { TaxPayment } from '@/data/tax-payments/types';
import { TabLayout, type FilterConfig } from '@/components/ui/tab-layout';
import type { ParcelStatus, ParcelStage } from '@/data/parcels/types';
import { taxPaymentsColumns } from '../../table-columns/tax-payments.columns';


interface TaxPaymentsTableProps {
    payments: TaxPayment[];
    isLoading: boolean;
    lastUpdated: Date | null;
    stickyTop?: number;
    parcelNumber: string;
    onRefresh?: () => void;
    taxYears?: number[];
    currentStatus?: ParcelStatus;
    currentStage?: ParcelStage;
}

function TaxPaymentsTable({ payments, isLoading, lastUpdated, stickyTop = 0, parcelNumber, onRefresh, taxYears: _taxYears, currentStatus, currentStage }: TaxPaymentsTableProps) {
    const [sorting, setSorting] = useState<SortingState>([{ id: 'paymentDate', desc: true }]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [yearFilter, setYearFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    const uniqueYears = useMemo(
        () => [...new Set(payments.map((p) => p.taxYear))].sort((a, b) => b - a),
        [payments],
    );

    function handleYearChange(val: string) {
        setYearFilter(val);
        setColumnFilters((prev) => {
            const next = prev.filter((f) => f.id !== 'taxYear');
            if (val !== 'all') next.push({ id: 'taxYear', value: Number(val) });
            return next;
        });
    }

    function handleTypeChange(val: string) {
        setTypeFilter(val);
        setColumnFilters((prev) => {
            const next = prev.filter((f) => f.id !== 'paymentTypeDescription');
            if (val !== 'all') next.push({ id: 'paymentTypeDescription', value: val });
            return next;
        });
    }

    const hasActiveFilters = globalFilter !== '' || yearFilter !== 'all' || typeFilter !== 'all';

    function clearFilters() {
        setGlobalFilter('');
        setYearFilter('all');
        setTypeFilter('all');
        setColumnFilters([]);
    }

    const table = useReactTable({
        data: payments,
        columns: taxPaymentsColumns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
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
        {
            value: typeFilter,
            onChange: handleTypeChange,
            placeholder: 'All Types',
            options: [
                { value: 'all', label: 'All Types' },
                { value: 'Tax', label: 'Tax' },
                { value: 'Redemption', label: 'Redemption' },
                { value: 'Lottery Credit', label: 'Lottery Credit' },
            ],
        },
    ];

    return (
        <TabLayout
            stickyTop={stickyTop}
            title='Tax Payments'
            parcelNumber={parcelNumber}
            isCatalisData={true}
            icon="/images/icons/tax-payments-icon.png"
            lastUpdated={lastUpdated}
            description='View parcel tax payment activity, charges, adjustments, and payment allocations by tax year.'
            searchPlaceholder='Search payments...'
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            filters={filters}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            onRefresh={onRefresh}
            table={table}
            recordCount={table.getFilteredRowModel().rows.length}
            isLoading={isLoading}
            allowView
            allowEdit
            allowDelete
            onView={(row) => console.log('view', row)}
            onEdit={(row) => console.log('edit', row)}
            onDelete={(row) => console.log('delete', row)}
            currentStatus={currentStatus}
            currentStage={currentStage}
        />
    );
}

// ─── Tab entry point ──────────────────────────────────────────────────────────

interface TaxPaymentsTabProps {
    parcelNumber: string;
    stickyTop?: number;
    taxYears?: number[];
    currentStatus?: ParcelStatus;
    currentStage?: ParcelStage;
}

export function TaxPaymentsTab({ parcelNumber, stickyTop, taxYears, currentStatus, currentStage }: TaxPaymentsTabProps) {
    const { payments, isRefreshing, lastUpdated, refetch } = useTaxPayments(parcelNumber, taxYears);

    return <TaxPaymentsTable payments={payments} isLoading={isRefreshing} lastUpdated={lastUpdated} stickyTop={stickyTop} parcelNumber={parcelNumber} onRefresh={refetch} taxYears={taxYears} currentStatus={currentStatus} currentStage={currentStage} />;
}
