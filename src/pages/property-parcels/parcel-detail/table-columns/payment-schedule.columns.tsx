import type { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import type { PaymentScheduleEntry } from '@/data/payment-schedule/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(amount: number) {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function formatDate(iso: string) {
    const [year, month, day] = iso.split('-');
    return `${month}/${day}/${year}`;
}

// ─── Column definitions ───────────────────────────────────────────────────────

export const paymentScheduleColumns: ColumnDef<PaymentScheduleEntry>[] = [
    {
        accessorKey: 'dueDate',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Due Date" />,
        cell: ({ getValue }) => <span className="text-sm">{formatDate(getValue<string>())}</span>,
        sortingFn: 'alphanumeric',
        meta: { skeleton: <Skeleton className="h-4 w-20" /> },
    },
    {
        accessorKey: 'taxYear',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Tax Year" />,
        cell: ({ getValue }) => <span className="text-sm">{getValue<number>()}</span>,
        filterFn: (row, columnId, filterValue) => row.getValue(columnId) === filterValue,
        meta: { skeleton: <Skeleton className="h-4 w-12" /> },
    },
    {
        accessorKey: 'tax',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Tax" />,
        cell: ({ getValue }) => <span className="text-sm">{fmt(getValue<number>())}</span>,
        meta: { skeleton: <Skeleton className="h-4 w-20" /> },
    },
    {
        accessorKey: 'interest',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Interest" />,
        cell: ({ getValue }) => <span className="text-sm">{fmt(getValue<number>())}</span>,
        meta: { skeleton: <Skeleton className="h-4 w-20" /> },
    },
    {
        accessorKey: 'penalty',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Penalty" />,
        cell: ({ getValue }) => <span className="text-sm">{fmt(getValue<number>())}</span>,
        meta: { skeleton: <Skeleton className="h-4 w-20" /> },
    },
    {
        accessorKey: 'total',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Total" />,
        cell: ({ getValue }) => <span className="text-sm font-medium">{fmt(getValue<number>())}</span>,
        meta: { skeleton: <Skeleton className="h-4 w-20" /> },
    },
    {
        accessorKey: 'totalPaid',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Total Paid" />,
        cell: ({ getValue }) => {
            const v = getValue<number>();
            return <span className={`text-sm font-medium ${v > 0 ? 'text-emerald-700' : 'text-muted-foreground'}`}>{fmt(v)}</span>;
        },
        meta: { skeleton: <Skeleton className="h-4 w-20" /> },
    },
];
