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
import { Receipt, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useExpenses } from '@/data/expenses/hooks/use-expenses';
import type { ExpenseDepartment, ExpenseType } from '@/data/expenses/types';
import { TabLayout, type FilterConfig } from '@/components/ui/tab-layout';
import { expensesColumns } from '../../table-columns/expenses.columns';

// ─── Filter options ───────────────────────────────────────────────────────────

const DEPARTMENTS: ExpenseDepartment[] = [
    'Treasurer',
    'Legal',
    'Finance',
    'Assessment',
    'Compliance',
    'Environmental',
    'Enforcement',
];

const EXPENSE_TYPES: ExpenseType[] = [
    'Legal Fee',
    'Filing Fee',
    'Inspection Fee',
    'Publication Fee',
    'Mailing Cost',
    'Appraisal Fee',
    'Title Search',
    'Court Cost',
    'Demolition',
    'Environmental Remediation',
    'Administrative Fee',
];

// ─── Tab component ────────────────────────────────────────────────────────────

interface ExpensesTabProps {
    parcelNumber: string;
    stickyTop?: number;
}

export function ExpensesTab({ parcelNumber, stickyTop = 0 }: ExpensesTabProps) {
    const { expenses, isRefreshing, lastUpdated, refetch } = useExpenses(parcelNumber);

    const [sorting, setSorting] = useState<SortingState>([{ id: 'createdDate', desc: true }]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    function handleDepartmentChange(val: string) {
        setDepartmentFilter(val);
        setColumnFilters((prev) => {
            const next = prev.filter((f) => f.id !== 'department');
            if (val !== 'all') next.push({ id: 'department', value: val });
            return next;
        });
    }

    function handleTypeChange(val: string) {
        setTypeFilter(val);
        setColumnFilters((prev) => {
            const next = prev.filter((f) => f.id !== 'type');
            if (val !== 'all') next.push({ id: 'type', value: val });
            return next;
        });
    }

    const hasActiveFilters = globalFilter !== '' || departmentFilter !== 'all' || typeFilter !== 'all';

    function clearFilters() {
        setGlobalFilter('');
        setDepartmentFilter('all');
        setTypeFilter('all');
        setColumnFilters([]);
    }

    const table = useReactTable({
        data: expenses,
        columns: expensesColumns,
        getRowId: (row) => row.id,
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

    const filters: FilterConfig[] = useMemo(() => [
        {
            value: departmentFilter,
            onChange: handleDepartmentChange,
            placeholder: 'All Departments',
            options: [
                { value: 'all', label: 'All Departments' },
                ...DEPARTMENTS.map((d) => ({ value: d, label: d })),
            ],
        },
        {
            value: typeFilter,
            onChange: handleTypeChange,
            placeholder: 'All Types',
            options: [
                { value: 'all', label: 'All Types' },
                ...EXPENSE_TYPES.map((t) => ({ value: t, label: t })),
            ],
        },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ], [departmentFilter, typeFilter]);

    const addExpenseButton = (
        <Button variant="outline" size="sm" className="gap-1.5 shrink-0" disabled={isRefreshing}>
            <Plus className="size-3.5" />
            Add Expense
        </Button>
    );

    return (
        <TabLayout
            stickyTop={stickyTop}
            title="Expenses"
            parcelNumber={parcelNumber}
            description="All recorded expenses, invoices, and cost items associated with this parcel."
            icon="/images/icons/expenses-icon.png"
            lastUpdated={lastUpdated}
            searchPlaceholder="Search expenses..."
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            filters={filters}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            onRefresh={refetch}
            extraToolbarButtons={addExpenseButton}
            table={table}
            recordCount={table.getFilteredRowModel().rows.length}
            isLoading={isRefreshing}
        />
    );
}
