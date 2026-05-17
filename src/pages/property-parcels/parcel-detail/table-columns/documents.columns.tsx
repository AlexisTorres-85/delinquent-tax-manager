import type { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Eye, Pencil } from 'lucide-react';
import type { ParcelDocument, DocumentType } from '@/data/documents/types';

export const documentColumns: ColumnDef<ParcelDocument>[] = [
    {
        accessorKey: 'uploadedAt',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Uploaded At" />,
        cell: ({ getValue }) => <span className="text-sm">{getValue<string>()}</span>,
        sortingFn: (a, b) => {
            const parse = (d: string) => {
                const [m, day, y] = d.split('/');
                return new Date(Number(y), Number(m) - 1, Number(day)).getTime();
            };
            return parse(a.original.uploadedAt) - parse(b.original.uploadedAt);
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
        accessorKey: 'workflowHistoryId',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Case Stage History ID" />,
        cell: ({ getValue }) => <span className="text-sm font-mono text-muted-foreground">{getValue<string>()}</span>,
        meta: { skeleton: <Skeleton className="h-4 w-24" /> },
    },
    {
        accessorKey: 'uploadedBy',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Uploaded By" />,
        cell: ({ getValue }) => <span className="text-sm">{getValue<string>()}</span>,
        meta: { skeleton: <Skeleton className="h-4 w-28" /> },
    },
    {
        accessorKey: 'notes',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Notes" />,
        cell: ({ getValue }) => {
            const v = getValue<string>();
            return v ? <span className="text-sm text-muted-foreground">{v}</span> : <span className="text-sm text-muted-foreground/40">—</span>;
        },
        meta: { skeleton: <Skeleton className="h-4 w-36" /> },
    },
   {
    id: 'actions',
    header: () => (
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"></span>
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
