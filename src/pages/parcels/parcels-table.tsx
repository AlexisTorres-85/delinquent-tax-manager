import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { Button } from '@/components/ui/button';
import { Download, FileText, FolderOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Parcel data type
export type Parcel = {
  id: string;
  parcelNumber: string;
  ownerName: string;
  propertyAddress: string;
  taxYear: number;
  amountDue: number;
  status: 'Delinquent' | 'In Plan' | 'Foreclosure' | 'Flagged' | 'Current';
  lastPaymentDate: string | null;
  phoneNumber: string;
  email: string;
};

// Generate dummy data
export function generateDummyParcels(count: number = 50): Parcel[] {
  const statuses: Parcel['status'][] = ['Delinquent', 'In Plan', 'Foreclosure', 'Flagged', 'Current'];
  const streets = ['Main St', 'Oak Ave', 'Maple Dr', 'Elm Blvd', 'Pine Rd', 'Cedar Ln', 'Birch Way', 'Willow Ct'];
  const firstNames = ['John', 'Jane', 'Robert', 'Mary', 'Michael', 'Patricia', 'David', 'Jennifer', 'William', 'Linda'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const streetNumber = Math.floor(Math.random() * 9999) + 1;
    const street = streets[Math.floor(Math.random() * streets.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const hasPayment = Math.random() > 0.3;

    return {
      id: `parcel-${i + 1}`,
      parcelNumber: `${String(Math.floor(Math.random() * 99) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`,
      ownerName: `${firstName} ${lastName}`,
      propertyAddress: `${streetNumber} ${street}, Kenosha, WI`,
      taxYear: 2024 - Math.floor(Math.random() * 3),
      amountDue: Math.floor(Math.random() * 50000) + 500,
      status,
      lastPaymentDate: hasPayment
        ? new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
        : null,
      phoneNumber: `(262) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    };
  });
}

// Status badge component
function StatusBadge({ status }: { status: Parcel['status'] }) {
  const variants: Record<Parcel['status'], 'destructive' | 'warning' | 'success' | 'secondary'> = {
    Delinquent: 'destructive',
    'In Plan': 'warning',
    Foreclosure: 'destructive',
    Flagged: 'warning',
    Current: 'secondary',
  };

  return <Badge variant={variants[status]}>{status}</Badge>;
}

// Define columns
export const parcelColumns: ColumnDef<Parcel>[] = [
  {
    accessorKey: 'parcelNumber',
    header: 'Parcel #',
    size: 150,
    cell: ({ row }) => <span className="font-medium">{row.original.parcelNumber}</span>,
  },
  {
    accessorKey: 'ownerName',
    header: 'Owner Name',
    size: 200,
  },
  {
    accessorKey: 'propertyAddress',
    header: 'Property Address',
    size: 280,
  },
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
    header: 'Status',
    size: 130,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'lastPaymentDate',
    header: 'Last Payment',
    size: 130,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.lastPaymentDate || 'No payment'}
      </span>
    ),
  },
];

// Parcels Table Component
interface ParcelsTableProps {
  data?: Parcel[];
  filterStatus?: Parcel['status'];
  externalSearch?: string;
  minAmountDue?: number;
  onlyNoPayment?: boolean;
  pageSize?: number;
  dense?: boolean;
}

export function ParcelsTable({
  data,
  filterStatus,
  externalSearch,
  minAmountDue = 0,
  onlyNoPayment = false,
  pageSize = 10,
  dense = false,
}: ParcelsTableProps) {
  const [parcels] = useState<Parcel[]>(() => data || generateDummyParcels(50));
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const normalizedExternalSearch = (externalSearch ?? '').trim().toLowerCase();

  const filteredData = parcels.filter((parcel) => {
    if (filterStatus && parcel.status !== filterStatus) {
      return false;
    }

    if (parcel.amountDue < minAmountDue) {
      return false;
    }

    if (onlyNoPayment && parcel.lastPaymentDate !== null) {
      return false;
    }

    if (!normalizedExternalSearch) {
      return true;
    }

    const searchable = `${parcel.parcelNumber} ${parcel.ownerName} ${parcel.propertyAddress}`.toLowerCase();
    return searchable.includes(normalizedExternalSearch);
  });

  const table = useReactTable({
    data: filteredData,
    columns: parcelColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
    autoResetPageIndex: true,
    autoResetAll: false,
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return (
    <div className="w-full min-w-[980px]">
      {/* Toolbar with search and action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white border-b p-4">
        <div className="flex-1 w-full sm:max-w-md">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-base font-semibold text-foreground">All Parcels</span>
              <span className="text-xs text-muted-foreground -mt-1">Browse and manage all parcels</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Data Grid Table */}
      <DataGridContainer>
        <DataGrid key={`parcels-grid-${pageSize}`} table={table} recordCount={filteredData.length} tableLayout={{ dense }}>
          <DataGridTable />
          <DataGridPagination showRowsPerPage={false} showInfo={false} className="justify-center" />
        </DataGrid>
      </DataGridContainer>
    </div>
  );
}
