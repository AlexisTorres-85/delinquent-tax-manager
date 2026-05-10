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

function formatDate(iso: string) {
    const [year, month, day] = iso.split('-');
    return `${month}/${day}/${year}`;
}

// ─── Expanded detail panel ────────────────────────────────────────────────────

function TaxPaymentDetail({ row }: { row: TaxPayment }) {
    const fields: { label: string; value: string }[] = [
        { label: 'Property Tax', value: fmt(row.propertyTax) },
        { label: 'Delinquent Charges', value: fmt(row.delinquentCharges) },
        { label: 'Tax Penalty', value: fmt(row.taxPenalty) },
        { label: 'Total Payment', value: fmt(row.totalPayment) },
        { label: 'Payment Date', value: formatDate(row.paymentDate) },
        { label: 'Tax Year', value: String(row.taxYear) },
        { label: 'Special Assessments', value: fmt(row.specialAssessments) },
        { label: 'Tax Interest', value: fmt(row.taxInterest) },
        { label: 'Special Tax Penalty', value: fmt(row.specialTaxPenalty) },
        { label: 'Over-Payment', value: fmt(row.overPayment) },
        { label: 'Payment Type', value: row.paymentType },
        { label: 'Special Charges', value: fmt(row.specialCharges) },
        { label: 'Special Interest', value: fmt(row.specialInterest) },
        { label: 'Other Charges', value: fmt(row.otherCharges) },
        { label: 'Receipt Number', value: row.receiptNumber },
    ];

    return (
        <div className="px-16 py-6 bg-muted/30 border-t border-border">
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
            headerClassName: '!pl-6 !pr-6 !w-10',
            cellClassName: '!pl-6 !pr-6 !w-10',
            expandedContent: (row: TaxPayment) => <TaxPaymentDetail row={row} />,
            skeleton: <Skeleton className="h-4 w-4" />,
        },
    },
    {
        accessorKey: 'taxYear',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Tax Year" />,
        size: 100,
        filterFn: 'equals',
        meta: {
            headerClassName: '!pl-6',
            cellClassName: '!pl-6',
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
        accessorKey: 'certificationNumber',
        header: 'Certification #',
        size: 170,
        cell: ({ row }) => (
            <span className="font-mono text-xs">{row.original.certificationNumber}</span>
        ),
        meta: { skeleton: <Skeleton className="h-4 w-28" /> },
    },
    {
        accessorKey: 'receipt',
        header: 'Receipt',
        size: 130,
        cell: ({ row }) => (
            <span className="font-mono text-xs">{row.original.receipt}</span>
        ),
        meta: { skeleton: <Skeleton className="h-4 w-16" /> },
    },
    {
        accessorKey: 'type',
        header: 'Type',
        size: 120,
        filterFn: 'equals',
        cell: ({ row }) => (
            <Badge variant={row.original.type === 'Redemption' ? 'secondary' : 'outline'} className="text-xs">
                {row.original.type}
            </Badge>
        ),
        meta: { skeleton: <Skeleton className="h-5 w-20 rounded-full" /> },
    },
    {
        accessorKey: 'amountPaid',
        header: 'Amount Paid',
        size: 140,
        cell: ({ row }) => (
            <span className="font-semibold tabular-nums">{fmt(row.original.amountPaid)}</span>
        ),
        meta: { skeleton: <Skeleton className="h-4 w-20" /> },
    },
];
