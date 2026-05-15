import { useState } from 'react';
import { Link } from 'react-router';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  OnChangeFn,
  PaginationState,
} from '@tanstack/react-table';
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Parcel } from '@/data/parcels/types';
import { StatusBadge, StageBadge } from '@/components/ui/parcel-badges';

export type { Parcel } from '@/data/parcels/types';

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value ?? '—'}</span>
    </div>
  );
}

const FLAG_LABELS: { key: keyof typeof dummyFlags; label: string }[] = [
  { key: 'isBankruptcy', label: 'Bankruptcy' },
  { key: 'isFloodPlain', label: 'Flood Plain' },
  { key: 'isInRem', label: 'In Rem' },
  { key: 'isOutlot', label: 'Outlot' },
  { key: 'isContaminated', label: 'Contaminated' },
  { key: 'hasHistoricalContamination', label: 'Historical Contamination' },
  { key: 'isDeeded', label: 'Deeded' },
  { key: 'isEnvironmentalIssue', label: 'Environmental Issue' },
  { key: 'isRazingOrder', label: 'Razing Order' },
];
const dummyFlags = { isBankruptcy: false, isFloodPlain: false, isInRem: false, isOutlot: false, isContaminated: false, hasHistoricalContamination: false, isDeeded: false, isEnvironmentalIssue: false, isRazingOrder: false };

function fmt(n: number | undefined) {
  return n != null ? `$${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—';
}

function ParcelExpandedDetail({ parcel }: { parcel: Parcel }) {
  const activeFlags = FLAG_LABELS.filter(({ key }) => parcel.flags[key]);

  return (
    <div className="px-8 py-5 bg-muted/30 border-t border-border">
      <div className="grid grid-cols-3 gap-x-8 gap-y-4">
        {/* Col 1: Location */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-divider pb-1">Location</p>
          <DetailField label="Property Address" value={parcel.propertyAddress} />
          <DetailField label="Municipality" value={parcel.municipality} />
          <DetailField label="Lot Size" value={parcel.lotSize || '—'} />
        </div>

        {/* Col 2: Valuation */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-divider pb-1">Valuation</p>
          <DetailField label="Total Assessed Value" value={fmt(parcel.assessedValue)} />
          <DetailField label="Land Value" value={fmt(parcel.landValue)} />
          <DetailField label="Improvement Value" value={fmt(parcel.improvementValue)} />
        </div>

        {/* Col 3: Flags */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-divider pb-1">Active Flags</p>
          {activeFlags.length === 0 ? (
            <span className="text-sm text-muted-foreground italic">No flags set</span>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {activeFlags.map(({ key, label }) => (
                <span key={key} className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold bg-destructive/10 text-destructive border border-destructive/20">
                  {label}
                </span>
              ))}
            </div>
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
        to={`/property-parcels/delinquent-parcel-cases/${encodeURIComponent(row.original.parcelNumber)}`}
        className="font-medium text-primary hover:underline"
      >
        {row.original.parcelNumber}
      </Link>
    ),
  },
  {
    accessorKey: 'ownerName', header: 'Owner Name', size: 200, cell: ({ row }) => (
      <span className="block truncate max-w-[200px]" title={row.original.ownerName ?? ''}>{row.original.ownerName ?? '—'}</span>
    )
  },
  {
    accessorKey: 'propertyAddress', header: 'Property Address', size: 280, cell: ({ row }) => (
      <span className="block truncate max-w-[280px]" title={row.original.propertyAddress ?? ''}>{row.original.propertyAddress ?? '—'}</span>
    )
  },
  {
    accessorKey: 'municipality',
    header: 'Municipality',
    size: 180,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.municipality || '—'}</span>
    ),
  },
  {
    accessorKey: 'activeWorkflow',
    header: 'Status / Stage',
    size: 320,
    cell: ({ row }) => {
      const wf = row.original.activeWorkflow;
      if (!wf) {
        return <span className="text-xs text-muted-foreground italic">No Workflow detected</span>;
      }
      return (
        <div className="flex items-center gap-2">
          <StatusBadge status={wf.status} />
          <div className="self-stretch w-px shrink-0 bg-border" />
          <StageBadge stage={wf.stage} />
        </div>
      );
    },
  },
];

interface ParcelsTableProps {
  data: Parcel[];
  pageSize?: number;
  pageNumber?: number;
  totalCount?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  isLoading?: boolean;
  isFetching?: boolean;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
}

export function ParcelsTable({
  data,
  pageSize = 10,
  pageNumber = 1,
  totalCount = 0,
  totalPages = 1,
  onPageChange,
  onPageSizeChange,
  isLoading,
  isFetching,
  columnVisibility,
  onColumnVisibilityChange,
}: ParcelsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const pagination: PaginationState = {
    pageIndex: pageNumber - 1,
    pageSize,
  };

  const table = useReactTable({
    data,
    columns: parcelColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange,
    // Server-side pagination
    manualPagination: true,
    pageCount: totalPages,
    onPaginationChange: (updater) => {
      const next = typeof updater === 'function' ? updater(pagination) : updater;
      if (next.pageIndex !== pagination.pageIndex) {
        onPageChange?.(next.pageIndex + 1);
      }
      if (next.pageSize !== pagination.pageSize) {
        onPageSizeChange?.(next.pageSize);
      }
    },
    state: {
      sorting,
      columnFilters,
      pagination,
      ...(columnVisibility !== undefined ? { columnVisibility } : {}),
    },
    autoResetAll: false,
  });

  return (
    <div className="w-full min-w-[980px]">
      <DataGridContainer>
        <div className={`transition-opacity duration-200 ${isFetching && !isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <DataGrid tableLayout={{ keepColumnsLeft: true }}
            table={table}
            recordCount={totalCount}
            isLoading={isLoading}
            loadingMode="skeleton"
            skeletonRowCount={4}
          >
            <DataGridTable />
            <div className="pt-4">
              <DataGridPagination showRowsPerPage={false} showInfo={false} className="justify-center" />
            </div>
          </DataGrid>
        </div>
      </DataGridContainer>
    </div>
  );
}