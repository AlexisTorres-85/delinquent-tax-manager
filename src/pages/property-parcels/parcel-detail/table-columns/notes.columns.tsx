import type { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ParcelNote, NoteMessageType } from '@/data/notes/types';

// ─── Message type badge config ────────────────────────────────────────────────

type BadgeVariant = 'destructive' | 'warning' | 'info' | 'secondary' | 'primary' | 'outline' | 'success';

const MESSAGE_TYPE_VARIANT: Record<NoteMessageType, BadgeVariant> = {
    'Payment Problems':        'destructive',
    'Call':                    'secondary',
    'Tax Deeded Note':         'warning',
    'Bankruptcy Note':         'destructive',
    'Legal Note':              'info',
    'General Note':            'secondary',
    'Status Update':           'primary',
    'Owner Contact':           'success',
    'Attorney Communication':  'outline',
};

// ─── Expanded note panel ──────────────────────────────────────────────────────

function NoteExpandedContent({ row }: { row: ParcelNote }) {
    return (
        <div className="px-16 py-5 border-t border-border">
            <div className="flex flex-col gap-1.5">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">Note</span>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{row.note}</p>
            </div>
        </div>
    );
}

// ─── Column definitions ───────────────────────────────────────────────────────

export const notesColumns: ColumnDef<ParcelNote>[] = [
    {
        id: 'expand',
        header: () => null,
        size: 48,
        minSize: 48,
        maxSize: 48,
        enableResizing: false,
        enableSorting: false,
        enableGlobalFilter: false,
        cell: ({ row }) => (
            <button
                onClick={(e) => { e.stopPropagation(); row.toggleExpanded(); }}
                className="p-1 rounded hover:bg-black/5 text-muted-foreground transition-colors"
                title={row.getIsExpanded() ? 'Collapse note' : 'Expand note'}
            >
                {row.getIsExpanded()
                    ? <ChevronDown className="size-4" />
                    : <ChevronRight className="size-4" />}
            </button>
        ),
        meta: {
            headerClassName: '!pl-6 !pr-2 !w-12',
            cellClassName: '!pl-6 !pr-2 !w-12',
            expandedContent: (row: ParcelNote) => <NoteExpandedContent row={row} />,
            skeleton: <Skeleton className="h-4 w-4" />,
        },
    },
    {
        accessorKey: 'createdDate',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Created Date" />,
        cell: ({ getValue }) => <span className="text-sm tabular-nums">{getValue<string>()}</span>,
        sortingFn: (a, b) => {
            const parse = (d: string) => {
                const [m, day, y] = d.split('/');
                return new Date(`${y}-${m}-${day}`).getTime();
            };
            return parse(a.original.createdDate) - parse(b.original.createdDate);
        },
        meta: { skeleton: <Skeleton className="h-4 w-24" /> },
    },
    {
        accessorKey: 'createdBy',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Created By" />,
        cell: ({ getValue }) => <span className="text-sm">{getValue<string>()}</span>,
        meta: { skeleton: <Skeleton className="h-4 w-24" /> },
    },
    {
        accessorKey: 'taxYear',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Tax Year" />,
        cell: ({ getValue }) => <span className="text-sm tabular-nums">{getValue<number>()}</span>,
        meta: { skeleton: <Skeleton className="h-4 w-12" /> },
    },
    {
        accessorKey: 'workflowId',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Workflow ID" />,
        cell: ({ getValue }) => (
            <span className="text-sm font-mono text-muted-foreground">{getValue<string>()}</span>
        ),
        meta: { skeleton: <Skeleton className="h-4 w-24" /> },
    },
    {
        accessorKey: 'messageType',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Message Type" />,
        cell: ({ getValue }) => {
            const type = getValue<NoteMessageType>();
            return (
                <Badge variant={MESSAGE_TYPE_VARIANT[type] ?? 'secondary'} appearance="light" className="text-xs whitespace-nowrap">
                    {type}
                </Badge>
            );
        },
        filterFn: (row, columnId, filterValue) =>
            filterValue === 'all' || row.getValue(columnId) === filterValue,
        meta: { skeleton: <Skeleton className="h-5 w-32" /> },
    },
];
