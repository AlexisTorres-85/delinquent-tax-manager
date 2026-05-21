import type { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { TaxPayment } from '@/data/tax-payments/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(amount: number) {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function formatDate(iso: string | null): string {
    if (!iso) return '—';
    const [year, month, day] = iso.split('-');
    return `${month}/${day}/${year}`;
}

function typeVariant(desc: string): 'secondary' | 'destructive' | 'outline' {
    if (desc === 'Redemption') return 'destructive';
    if (desc === 'Lottery Credit') return 'secondary';
    return 'outline';
}

// ─── Expanded detail panel ────────────────────────────────────────────────────

function TaxPaymentDetail({ row }: { row: TaxPayment }) {
    const fields: { label: string; value: string }[] = [
        { label: 'General Property Tax', value: fmt(row.generalPropertyTax) },
        { label: 'Special Assessment', value: fmt(row.specialAssessment) },
        { label: 'Special Charge', value: fmt(row.specialCharge) },
        { label: 'Delinquent Utility Charge', value: fmt(row.delinquentUtilityCharge) },
        { label: 'Interest', value: fmt(row.interest) },
        { label: 'Penalty', value: fmt(row.penalty) },
        { label: 'GP Tax Interest', value: fmt(row.generalPropertyTaxInterest) },
        { label: 'Special Taxes Interest', value: fmt(row.specialTaxesInterest) },
        { label: 'GP Tax Penalty', value: fmt(row.generalPropertyTaxPenalty) },
        { label: 'Special Taxes Penalty', value: fmt(row.specialTaxesPenalty) },
        { label: 'Other Charge', value: fmt(row.otherCharge) },
        { label: 'Total Taxes', value: fmt(row.totalTaxes) },
        { label: 'Total Interest & Penalties', value: fmt(row.totalInterestAndPenalties) },
        { label: 'Receipt #', value: row.receiptNumber > 0 ? String(row.receiptNumber) : '—' },
        { label: 'Payment Source', value: row.paymentSourceDescription },
        { label: 'Tax Year', value: String(row.taxYear) },
    ];

    return (
        <div className="px-16 py-6 border-t border-border">
            <div className="grid grid-cols-5 gap-x-6 gap-y-3">
                {fields.map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">{label}</span>
                        <span className="text-sm font-medium text-foreground">{value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Column definitions ───────────────────────────────────────────────────────

export const taxPaymentsColumns: ColumnDef<TaxPayment>[] = [
    {
        id: 'expand',
        size: 20,
        minSize: 20,
        maxSize: 20,
        enableResizing: false,
        enableSorting: false,
        cell: ({ row }) => (
            <button
                onClick={(e) => { e.stopPropagation(); row.toggleExpanded(); }}
                className="p-1 rounded hover:bg-black/5 text-muted-foreground transition-colors"
            >
                {row.getIsExpanded()
                    ? <ChevronDown className="size-4" />
                    : <ChevronRight className="size-4" />}
            </button>
        ),
        meta: {
            expandedContent: (row: TaxPayment) => <TaxPaymentDetail row={row} />,
            skeleton: <Skeleton className="h-4 w-4" />,
            headerClassName: '!pr-0',
            cellClassName: '!pr-0',
        },
    },
    {
        accessorKey: 'taxYear',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Tax Year" />,
        size: 50,
        filterFn: 'equals',
        meta: {
            headerClassName: '!pl-0',
            cellClassName: '!pl-0',
            skeleton: <Skeleton className="h-4 w-12" />,
        },
    },
    {
        accessorKey: 'paymentDate',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Payment Date" />,
        size: 140,
        cell: ({ row }) => (
            <span className="text-muted-foreground">{formatDate(row.original.paymentDate)}</span>
        ),
        meta: { skeleton: <Skeleton className="h-4 w-20" /> },
    },
    {
        accessorKey: 'receiptNumber',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Receipt #" />,
        size: 120,
        cell: ({ row }) => (
            <span className="font-mono text-xs">
                {row.original.receiptNumber > 0 ? row.original.receiptNumber : '—'}
            </span>
        ),
        meta: { skeleton: <Skeleton className="h-4 w-16" /> },
    },
    {
        accessorKey: 'paymentTypeDescription',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Type" />,
        size: 140,
        filterFn: 'equals',
        cell: ({ row }) => (
            <Badge variant={typeVariant(row.original.paymentTypeDescription)} className="text-xs">
                {row.original.paymentTypeDescription}
            </Badge>
        ),
        meta: { skeleton: <Skeleton className="h-5 w-20 rounded-full" /> },
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Amount Paid" />,
        size: 140,
        cell: ({ row }) => (
            <span className="font-semibold tabular-nums">{fmt(row.original.amount)}</span>
        ),
        meta: { skeleton: <Skeleton className="h-4 w-20" /> },
    },
];
