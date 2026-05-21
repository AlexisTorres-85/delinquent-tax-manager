import type { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { InternalNote } from '@/data/notes/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatIsoDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

// ─── Expanded note panel ──────────────────────────────────────────────────────

function NoteExpandedContent({ row }: { row: InternalNote }) {
    const actionTaken = row.caseInfo?.caseStageHistory?.actionTaken;
    return (
        <div className="px-16 py-5 border-t border-border">
            <div className="flex flex-col gap-2.5">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">Note</span>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{row.noteText}</p>
                {actionTaken && (
                    <Badge variant="secondary" appearance="light" className="text-xs w-fit">
                        {actionTaken}
                    </Badge>
                )}
            </div>
        </div>
    );
}

// ─── Column definitions ───────────────────────────────────────────────────────

export const notesColumns: ColumnDef<InternalNote>[] = [
    {
        id: 'expand',
        size: 20,
        minSize: 20,
        maxSize: 20,
        enableResizing: false,
        enableSorting: false,
        cell: ({ row }) => (
            <button
                onClick={(e) => { e.stopPropagation(); row.toggleExpanded(); }}
                className="p-1 rounded hover:bg-black/5 text-muted-foreground transition-colors"
            >
                {row.getIsExpanded()
                    ? <ChevronDown className="size-4" />
                    : <ChevronRight className="size-4" />}
            </button>
        ),
        meta: {
            expandedContent: (row: InternalNote) => <NoteExpandedContent row={row} />,
            skeleton: <Skeleton className="h-4 w-4" />,
            headerClassName: '!pr-0',
            cellClassName: '!pr-0',
        },
    },
    {
        id: 'date',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Date" />,
        accessorFn: (row) => row.caseInfo?.caseStageHistory?.dateTime ?? row.createdDate,
        cell: ({ row }) => {
            const iso = row.original.caseInfo?.caseStageHistory?.dateTime ?? row.original.createdDate;
            return <span className="text-sm tabular-nums">{formatIsoDate(iso)}</span>;
        },
        sortingFn: (a, b) => {
            const dateA = a.original.caseInfo?.caseStageHistory?.dateTime ?? a.original.createdDate;
            const dateB = b.original.caseInfo?.caseStageHistory?.dateTime ?? b.original.createdDate;
            return new Date(dateA).getTime() - new Date(dateB).getTime();
        },
        meta: {
            headerClassName: '!pl-0',
            cellClassName: '!pl-0',
            skeleton: <Skeleton className="h-4 w-24" />,
        },
    },
    {
        accessorKey: 'createdByName',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Created By" />,
        cell: ({ getValue }) => <span className="text-sm">{getValue<string>()}</span>,
        meta: { skeleton: <Skeleton className="h-4 w-28" /> },
    },
    {
        accessorKey: 'caseId',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Case ID" />,
        cell: ({ getValue }) => (
            <span className="text-sm tabular-nums text-muted-foreground">#{getValue<number>()}</span>
        ),
        meta: { skeleton: <Skeleton className="h-4 w-12" /> },
    },
    {
        id: 'statusDefinition',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Status" />,
        accessorFn: (row) => row.caseInfo?.caseStageHistory?.caseStatusDefinitionName ?? null,
        cell: ({ row }) => {
            const name = row.original.caseInfo?.caseStageHistory?.caseStatusDefinitionName;
            if (!name) return <span className="text-xs text-muted-foreground">—</span>;
            return (
                <Badge variant="secondary" appearance="light" className="text-xs whitespace-nowrap w-fit">
                    {name}
                </Badge>
            );
        },
        enableSorting: false,
        meta: { skeleton: <Skeleton className="h-5 w-28" /> },
    },
    {
        id: 'stageDefinition',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Stage" />,
        accessorFn: (row) => row.caseInfo?.caseStageHistory?.caseStageDefinitionName ?? null,
        cell: ({ row }) => {
            const name = row.original.caseInfo?.caseStageHistory?.caseStageDefinitionName;
            if (!name) return <span className="text-xs text-muted-foreground">—</span>;
            return <span className="text-sm text-foreground">{name}</span>;
        },
        enableSorting: false,
        meta: { skeleton: <Skeleton className="h-4 w-32" /> },
    },
];
