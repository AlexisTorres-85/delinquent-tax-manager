import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, Filter, FileText, Flag, DollarSign } from 'lucide-react';
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
  const variants: Record<Parcel['status'], 'default' | 'destructive' | 'warning' | 'success'> = {
    Delinquent: 'destructive',
    'In Plan': 'warning',
    Foreclosure: 'destructive',
    Flagged: 'warning',
    Current: 'success',
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
}

export function ParcelsTable({ data, filterStatus }: ParcelsTableProps) {
  const [parcels] = useState<Parcel[]>(() => data || generateDummyParcels(50));
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Filter data based on status if provided
  const filteredData = filterStatus
    ? parcels.filter((parcel) => parcel.status === filterStatus)
    : parcels;

  const table = useReactTable({
    data: filteredData,
    columns: parcelColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="w-full">
      {/* Toolbar with search and action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white border-b p-4">
        <div className="flex-1 w-full sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search parcels by owner, address, or parcel number..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Report
          </Button>
          <Button variant="default" size="sm">
            <Flag className="h-4 w-4 mr-2" />
            Flag Selected
          </Button>
          <Button variant="default" size="sm">
            <DollarSign className="h-4 w-4 mr-2" />
            Create Plan
          </Button>
        </div>
      </div>

      {/* Data Grid Table */}
      <DataGridContainer>
        <DataGrid table={table} recordCount={filteredData.length}>
          <DataGridTable />
          <DataGridPagination />
        </DataGrid>
      </DataGridContainer>

      {/* Results summary */}
      <div className="text-sm text-muted-foreground px-2">
        Showing {table.getRowModel().rows.length} of {filteredData.length} parcels
        {filterStatus && ` with status: ${filterStatus}`}
      </div>
    </div>
  );
}
