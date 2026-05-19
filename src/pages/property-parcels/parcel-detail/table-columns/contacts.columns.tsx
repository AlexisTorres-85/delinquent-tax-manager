import type { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import type { ParcelContact } from '@/data/contacts/types';

export function createContactColumns(
  onEdit: (contact: ParcelContact) => void,
): ColumnDef<ParcelContact>[] {
  return [
    {
      id: 'fullName',
      accessorFn: (row) => `${row.firstName} ${row.lastName}`.trim(),
      header: ({ column }) => <DataGridColumnHeader column={column} title="Full Name" />,
      cell: ({ getValue }) => (
        <span className="text-sm font-medium">{getValue<string>()}</span>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-40" /> },
    },
    {
      accessorKey: 'contactTypeName',
      header: ({ column }) => <DataGridColumnHeader column={column} title="Type" />,
      cell: ({ getValue }) => (
        <Badge variant="secondary">{getValue<string>()}</Badge>
      ),
      filterFn: (row, columnId, filterValue) =>
        filterValue === 'all' || row.getValue(columnId) === filterValue,
      meta: { skeleton: <Skeleton className="h-5 w-28" /> },
    },
    {
      id: 'isPrimary',
      accessorKey: 'isPrimary',
      header: ({ column }) => <DataGridColumnHeader column={column} title="Primary" />,
      cell: ({ getValue }) =>
        getValue<boolean>() ? (
          <Badge variant="success" appearance="light" className="text-xs">Primary</Badge>
        ) : null,
      meta: { skeleton: <Skeleton className="h-5 w-16" /> },
    },
    {
      accessorKey: 'phoneNumber',
      header: ({ column }) => <DataGridColumnHeader column={column} title="Phone" />,
      cell: ({ getValue }) => {
        const v = getValue<string | null>();
        return v ? (
          <a href={`tel:${v}`} className="text-sm text-primary hover:underline">{v}</a>
        ) : <span className="text-sm text-muted-foreground">—</span>;
      },
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
    },
    {
      accessorKey: 'email',
      header: ({ column }) => <DataGridColumnHeader column={column} title="Email" />,
      cell: ({ getValue }) => {
        const v = getValue<string | null>();
        return v ? (
          <a href={`mailto:${v}`} className="text-sm text-primary hover:underline truncate block max-w-[220px]">{v}</a>
        ) : <span className="text-sm text-muted-foreground">—</span>;
      },
      meta: { skeleton: <Skeleton className="h-4 w-44" /> },
    },
    {
      id: 'actions',
      header: () => <span />,
      size: 60,
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            title="Edit contact"
            onClick={() => onEdit(row.original)}
          >
            <Pencil />
            <span className="sr-only">Edit</span>
          </Button>
        </div>
      ),
      meta: { skeleton: <Skeleton className="h-8 w-10" /> },
    },
  ];
}
