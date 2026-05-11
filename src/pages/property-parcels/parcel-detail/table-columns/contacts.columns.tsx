import type { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Pencil } from 'lucide-react';
import type { ParcelContact, ContactStatus } from '@/data/contacts/types';

const STATUS_VARIANT: Record<ContactStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    'Current Owner': 'default',
    'Co-Owner': 'default',
    'Former Owner': 'secondary',
    'Attorney': 'outline',
    'Lien Holder': 'destructive',
    'Tenant': 'secondary',
    'Estate Representative': 'outline',
    'Authorized Agent': 'outline',
    'Bankruptcy Trustee': 'destructive',
    'Interest Party': 'secondary',
};

export const contactColumns: ColumnDef<ParcelContact>[] = [
    {
        accessorKey: 'fullName',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Full Name" />,
        cell: ({ getValue }) => <span className="text-sm font-medium">{getValue<string>()}</span>,
        meta: { skeleton: <Skeleton className="h-4 w-40" /> },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Status" />,
        cell: ({ getValue }) => {
            const status = getValue<ContactStatus>();
            return <Badge variant={STATUS_VARIANT[status] ?? 'secondary'}>{status}</Badge>;
        },
        filterFn: (row, columnId, filterValue) =>
            filterValue === 'all' || row.getValue(columnId) === filterValue,
        meta: { skeleton: <Skeleton className="h-5 w-28" /> },
    },
    {
        accessorKey: 'phone',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Phone" />,
        cell: ({ getValue }) => (
            <a href={`tel:${getValue<string>()}`} className="text-sm text-primary hover:underline">
                {getValue<string>()}
            </a>
        ),
        meta: { skeleton: <Skeleton className="h-4 w-28" /> },
    },
    {
        accessorKey: 'email',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Email" />,
        cell: ({ getValue }) => (
            <a href={`mailto:${getValue<string>()}`} className="text-sm text-primary hover:underline truncate block max-w-[220px]">
                {getValue<string>()}
            </a>
        ),
        meta: { skeleton: <Skeleton className="h-4 w-44" /> },
    },
    {
        id: 'actions',
        header: () => (
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</span>
        ),
        size: 100,
        cell: () => (
            <div className="flex items-center justify-end gap-1.5">
                <Button variant="outline" size="sm" title="View contact">
                    <Eye />
                    <span className="sr-only">View</span>
                </Button>
                <Button variant="outline" size="sm" title="Edit contact">
                    <Pencil />
                    <span className="sr-only">Edit</span>
                </Button>
            </div>
        ),
        meta: { skeleton: <Skeleton className="h-8 w-20" /> },
    },
];
