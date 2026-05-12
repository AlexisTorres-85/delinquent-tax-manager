import type { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Pencil } from 'lucide-react';
import type { Expense, ExpenseDepartment, ExpenseType } from '@/data/expenses/types';

// ─── Badge config ─────────────────────────────────────────────────────────────

type BadgeVariant = 'destructive' | 'warning' | 'info' | 'secondary' | 'primary' | 'outline' | 'success';

const DEPARTMENT_VARIANT: Record<ExpenseDepartment, BadgeVariant> = {
    'Treasurer':    'primary',
    'Legal':        'destructive',
    'Finance':      'info',
    'Assessment':   'warning',
    'Compliance':   'secondary',
    'Environmental':'success',
    'Enforcement':  'outline',
};

const TYPE_VARIANT: Record<ExpenseType, BadgeVariant> = {
    'Legal Fee':                 'destructive',
    'Filing Fee':                'warning',
    'Inspection Fee':            'secondary',
    'Publication Fee':           'info',
    'Mailing Cost':              'outline',
    'Appraisal Fee':             'primary',
    'Title Search':              'info',
    'Court Cost':                'destructive',
    'Demolition':                'warning',
    'Environmental Remediation': 'success',
    'Administrative Fee':        'secondary',
};

// ─── Currency formatter ───────────────────────────────────────────────────────

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

// ─── Date sort helper ─────────────────────────────────────────────────────────

function parseDate(d: string) {
    const [m, day, y] = d.split('/');
    return new Date(`${y}-${m}-${day}`).getTime();
}

// ─── Column definitions ───────────────────────────────────────────────────────

export const expensesColumns: ColumnDef<Expense>[] = [
    {
        accessorKey: 'createdDate',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Created Date" />,
        cell: ({ getValue }) => <span className="text-sm tabular-nums">{getValue<string>()}</span>,
        sortingFn: (a, b) => parseDate(a.original.createdDate) - parseDate(b.original.createdDate),
        meta: { skeleton: <Skeleton className="h-4 w-24" /> },
    },
    {
        accessorKey: 'department',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Department" />,
        cell: ({ getValue }) => {
            const dept = getValue<ExpenseDepartment>();
            return (
                <Badge variant={DEPARTMENT_VARIANT[dept] ?? 'secondary'} appearance="light" className="text-xs whitespace-nowrap">
                    {dept}
                </Badge>
            );
        },
        filterFn: (row, columnId, filterValue) =>
            filterValue === 'all' || row.getValue(columnId) === filterValue,
        meta: { skeleton: <Skeleton className="h-5 w-24" /> },
    },
    {
        accessorKey: 'type',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Type" />,
        cell: ({ getValue }) => {
            const type = getValue<ExpenseType>();
            return (
                <Badge variant={TYPE_VARIANT[type] ?? 'secondary'} appearance="light" className="text-xs whitespace-nowrap">
                    {type}
                </Badge>
            );
        },
        filterFn: (row, columnId, filterValue) =>
            filterValue === 'all' || row.getValue(columnId) === filterValue,
        meta: { skeleton: <Skeleton className="h-5 w-28" /> },
    },
    {
        accessorKey: 'invoiceNumber',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Invoice Number" />,
        cell: ({ getValue }) => (
            <span className="text-sm font-mono text-muted-foreground">{getValue<string>()}</span>
        ),
        meta: { skeleton: <Skeleton className="h-4 w-28" /> },
    },
    {
        accessorKey: 'invoiceDate',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Invoice Date" />,
        cell: ({ getValue }) => <span className="text-sm tabular-nums">{getValue<string>()}</span>,
        sortingFn: (a, b) => parseDate(a.original.invoiceDate) - parseDate(b.original.invoiceDate),
        meta: { skeleton: <Skeleton className="h-4 w-24" /> },
    },
    {
        accessorKey: 'invoiceAmount',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Invoice Amount" />,
        cell: ({ getValue }) => (
            <span className="text-sm tabular-nums font-medium">{usd.format(getValue<number>())}</span>
        ),
        meta: { skeleton: <Skeleton className="h-4 w-20" /> },
    },
    {
        id: 'actions',
        header: () => null,
        size: 56,
        minSize: 56,
        maxSize: 56,
        enableResizing: false,
        enableSorting: false,
        enableGlobalFilter: false,
        cell: () => (
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                title="Edit expense"
            >
                <Pencil className="size-3.5" />
            </Button>
        ),
        meta: {
            headerClassName: '!pr-4 !w-14',
            cellClassName: '!pr-4 !w-14',
            skeleton: <Skeleton className="h-7 w-7 rounded" />,
        },
    },
];
