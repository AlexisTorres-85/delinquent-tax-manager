import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  OnChangeFn,
} from '@tanstack/react-table';
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, Mail, MapPin, Phone } from 'lucide-react';
import type { Parcel } from '@/data/parcels/types';
import { StatusBadge, StageBadge } from '@/components/ui/parcel-badges';
import { ScopeSnapshot } from './scope-snapshot';

export type { Parcel } from '@/data/parcels/types';

function ParcelExpandedDetail({ parcel }: { parcel: Parcel }) {
  return (
    <div className="px-6 py-4 bg-muted/30 border-t border-border">
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-3">
          <p className="font-semibold text-foreground">Property Details</p>
          <div className="space-y-1.5 text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="size-3.5 shrink-0" />
              <span>{parcel.propertyAddress}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="size-3.5 shrink-0" />
              <span>{parcel.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="size-3.5 shrink-0" />
              <span>{parcel.email}</span>
            </div>
          </div>
          <div className="pt-1 space-y-1 text-muted-foreground">
            <div><span className="font-medium text-foreground">Legal: </span>{parcel.legalDescription}</div>
            <div><span className="font-medium text-foreground">Lot Size: </span>{parcel.lotSize}</div>
            <div><span className="font-medium text-foreground">Assessed Value: </span>${parcel.assessedValue.toLocaleString()}</div>
          </div>
        </div>
        <div className="col-span-2 space-y-3">
          <p className="font-semibold text-foreground">Payment History</p>
          {parcel.paymentHistory.length === 0 ? (
            <p className="text-muted-foreground italic">No payment history on record.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="pb-1.5 font-medium">Date</th>
                  <th className="pb-1.5 font-medium">Amount</th>
                  <th className="pb-1.5 font-medium">Method</th>
                  <th className="pb-1.5 font-medium">Receipt #</th>
                </tr>
              </thead>
              <tbody>
                {parcel.paymentHistory.map((p, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-1.5 text-muted-foreground">{p.date}</td>
                    <td className="py-1.5 font-medium">${p.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="py-1.5 text-muted-foreground">{p.method}</td>
                    <td className="py-1.5 text-muted-foreground">{p.receiptNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}


export const parcelColumns: ColumnDef<Parcel>[] = [
  {
    id: 'expand',
    size: 40,
    cell: ({ row }) => (
      <button
        onClick={(e) => { e.stopPropagation(); row.toggleExpanded(); }}
        className="p-1 rounded hover:bg-black/5 text-muted-foreground transition-colors"
      >
        {row.getIsExpanded() ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
      </button>
    ),
    meta: {
      expandedContent: (row: Parcel) => <ParcelExpandedDetail parcel={row} />,
    },
  },
  {
    accessorKey: 'parcelNumber',
    header: 'Parcel #',
    size: 150,
    cell: ({ row }) => (
      <Link
        to={`/property-parcels/${encodeURIComponent(row.original.parcelNumber)}`}
        className="font-medium text-primary hover:underline"
      >
        {row.original.parcelNumber}
      </Link>
    ),
  },
  { accessorKey: 'ownerName', header: 'Owner Name', size: 200 },
  { accessorKey: 'propertyAddress', header: 'Property Address', size: 280 },
  {
    accessorKey: 'taxYear',
    header: 'Tax Year',
    size: 100,
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.taxYear}</span>,
  },
  {
    accessorKey: 'amountDue',
    header: 'Amount Due',
    size: 130,
    cell: ({ row }) => (
      <span className="font-semibold text-destructive">
        ${row.original.amountDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status / Stage',
    size: 260,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 flex-wrap">
        <StatusBadge status={row.original.status} />
        <StageBadge stage={row.original.stage} />
      </div>
    ),
  },
  {
    accessorKey: 'lastPaymentDate',
    header: 'Last Payment',
    size: 130,
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.lastPaymentDate || 'No payment'}</span>
    ),
  },
];

interface ParcelsTableProps {
  data: Parcel[];
  pageSize?: number;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
}

export function ParcelsTable({ data, pageSize = 10, columnVisibility, onColumnVisibilityChange }: ParcelsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns: parcelColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange,
    state: {
      sorting,
      columnFilters,
      ...(columnVisibility !== undefined ? { columnVisibility } : {}),
    },
    autoResetPageIndex: true,
    autoResetAll: false,
    initialState: { pagination: { pageSize } },
  });

  useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize]);

  return (
    <div className="w-full min-w-[980px]">
      <ScopeSnapshot
        scopedCount={data.length}
        delinquentCount={data.filter((p) => p.status === 'Delinquent').length}
        noPaymentCount={data.filter((p) => p.lastPaymentDate === null).length}
        totalDue={data.reduce((sum, p) => sum + p.amountDue, 0)}
      />
      <DataGridContainer>
        <DataGrid table={table} recordCount={data.length}>
          <DataGridTable />
          <div className="pt-4">
            <DataGridPagination showRowsPerPage={false} showInfo={false} className="justify-center" />
          </div>
        </DataGrid>
      </DataGridContainer>
    </div>
  );
}