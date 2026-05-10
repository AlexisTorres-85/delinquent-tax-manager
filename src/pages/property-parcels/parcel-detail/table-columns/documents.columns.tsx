import type { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Eye, Pencil } from 'lucide-react';
import type { ParcelDocument, DocumentType } from '@/data/documents/types';

export const documentColumns: ColumnDef<ParcelDocument>[] = [
    {
        accessorKey: 'createdDate',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Created Date" />,
        cell: ({ getValue }) => <span className="text-sm">{getValue<string>()}</span>,
        sortingFn: (a, b) => {
            const parse = (d: string) => {
                const [m, day, y] = d.split('/');
                return new Date(Number(y), Number(m) - 1, Number(day)).getTime();
            };
            return parse(a.original.createdDate) - parse(b.original.createdDate);
        },
        meta: { skeleton: <Skeleton className="h-4 w-20" /> },
    },
    {
        accessorKey: 'documentName',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Document Name" />,
        cell: ({ getValue }) => <span className="text-sm font-medium">{getValue<string>()}</span>,
        meta: { skeleton: <Skeleton className="h-4 w-40" /> },
    },
    {
        accessorKey: 'type',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Type" />,
        cell: ({ getValue }) => <span className="text-sm text-muted-foreground">{getValue<DocumentType>()}</span>,
        filterFn: (row, columnId, filterValue) =>
            filterValue === 'all' || row.getValue(columnId) === filterValue,
        meta: { skeleton: <Skeleton className="h-4 w-36" /> },
    },
   {
    id: 'actions',
    header: () => (
        <div className="flex justify-end pr-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                
            </span>
        </div>
    ),
    size: 120,
    cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1.5">
            <Button
                variant="outline"
                size="sm"
                title="View document"
                onClick={() => window.open(row.original.filePath, '_blank')}
            >
                <Eye />
                <span className="sr-only">View</span>
            </Button>

            <Button
                variant="outline"
                size="sm"
                title="Edit document"
            >
                <Pencil />
                <span className="sr-only">Edit</span>
            </Button>
        </div>
    ),
    enableSorting: false,
    meta: {
        cellClassName: 'text-right',
        skeleton: (
            <div className="flex justify-end gap-1.5">
                <Skeleton className="h-7 w-7 rounded" />
                <Skeleton className="h-7 w-7 rounded" />
            </div>
        ),
    },
},
];
