import type { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
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
        id: 'view',
        header: () => <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">View</span>,
        cell: ({ row }) => (
            <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                title="View document"
                onClick={() => window.open(row.original.filePath, '_blank')}
            >
                <Eye className="h-4 w-4" />
                <span className="sr-only">View</span>
            </Button>
        ),
        enableSorting: false,
        meta: { skeleton: <Skeleton className="h-6 w-6 rounded" /> },
    },
];
