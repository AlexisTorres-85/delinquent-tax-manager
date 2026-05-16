import type { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FileText,
  Star,
  ArrowRightCircle,
  MoreVertical,
  Eye,
  StickyNote,
  Paperclip,
  RotateCcw,
  Ban,
} from 'lucide-react';
import { StatusBadge, StageBadge } from '@/components/ui/parcel-badges';
import type { ParcelCaseStageHistory, CaseActionTaken } from '@/data/cases/case-stage-history/types';

export function createCaseStageHistoryColumns(
    onMoveToNextStage: (entry: ParcelCaseStageHistory) => void,
): ColumnDef<ParcelCaseStageHistory>[] {
  return [
  {
    id: 'activeStage',
    header: () => null,
    size: 10,
    enableSorting: false,
    enableGlobalFilter: false,
    cell: ({ row }) =>
      row.original.isActive ? (
        <div className="absolute left-0 top-0 h-full w-2 bg-[var(--color-active-workflow-side-line)]">
          <Star className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 fill-[var(--color-active-workflow-side-line)] text-[var(--color-active-workflow-side-line)]" />
        </div>
      ) : null,
    meta: {
      cellClassName: 'relative p-0 w-1',
      skeleton: <Skeleton className="h-4 w-1 rounded" />,
    },
  },
  {
    accessorKey: 'caseId',
    header: ({ column }) => <DataGridColumnHeader column={column} title="Case ID" />,
    cell: ({ getValue }) => (
      <span className="text-sm font-mono text-muted-foreground">{getValue<string>()}</span>
    ),
    meta: { skeleton: <Skeleton className="h-4 w-24" /> },
  },
  {
    accessorKey: 'dateTime',
    header: ({ column }) => <DataGridColumnHeader column={column} title="Date / Time" />,
    cell: ({ getValue }) => <span className="text-sm">{getValue<string>()}</span>,
    sortingFn: (a, b) => {
      const parse = (dt: string) => {
        const [datePart, timePart, meridiem] = dt.split(' ');
        const [m, d, y] = datePart.split('/');
        return new Date(`${y}-${m}-${d} ${timePart ?? '00:00'} ${meridiem ?? ''}`).getTime();
      };

      return parse(a.original.dateTime) - parse(b.original.dateTime);
    },
    meta: { skeleton: <Skeleton className="h-4 w-32" /> },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataGridColumnHeader column={column} title="Status" />,
    cell: ({ getValue }) => <StatusBadge status={getValue<ParcelCaseStageHistory['status']>()} />,
    filterFn: (row, columnId, filterValue) =>
      filterValue === 'all' || row.getValue(columnId) === filterValue,
    meta: { skeleton: <Skeleton className="h-5 w-32" /> },
  },
  {
    accessorKey: 'stage',
    header: ({ column }) => <DataGridColumnHeader column={column} title="Stage" />,
    cell: ({ getValue }) => <StageBadge stage={getValue<ParcelCaseStageHistory['stage']>()} />,
    filterFn: (row, columnId, filterValue) =>
      filterValue === 'all' || row.getValue(columnId) === filterValue,
    meta: { skeleton: <Skeleton className="h-5 w-36" /> },
  },
  {
    accessorKey: 'actionTaken',
    header: ({ column }) => <DataGridColumnHeader column={column} title="Action Taken" />,
    cell: ({ getValue }) => <span className="text-sm">{getValue<CaseActionTaken>()}</span>,
    meta: { skeleton: <Skeleton className="h-4 w-32" /> },
  },
  {
    accessorKey: 'performedBy',
    header: ({ column }) => <DataGridColumnHeader column={column} title="Performed By" />,
    cell: ({ getValue }) => <span className="text-sm">{getValue<string>()}</span>,
    meta: { skeleton: <Skeleton className="h-4 w-24" /> },
  },
  {
    accessorKey: 'documentCount',
    header: ({ column }) => <DataGridColumnHeader column={column} title="Documents" />,
    cell: ({ getValue }) => {
      const count = getValue<number>();

      return (
        <div className="flex items-center gap-1.5">
          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-sm tabular-nums">{count}</span>
        </div>
      );
    },
    meta: { skeleton: <Skeleton className="h-4 w-12" /> },
  },
  {
    id: 'actions',
    header: () => null,
    size: 160,
    enableSorting: false,
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const isActive = row.original.isActive;

      return (
        <div className="flex items-center justify-end gap-2">
          {isActive && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMoveToNextStage(row.original)}
            >
              <ArrowRightCircle  />
              Move to Next Stage
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <StickyNote className="mr-2 h-4 w-4" />
                Add Note
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Paperclip className="mr-2 h-4 w-4" />
                Attach Document
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={isActive}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reopen Case
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                <Ban className="mr-2 h-4 w-4" />
                Mark as Void
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    meta: {
      cellClassName: 'text-right',
      skeleton: (
        <div className="flex justify-end gap-2">
          <Skeleton className="h-7 w-28 rounded" />
          <Skeleton className="h-7 w-7 rounded" />
        </div>
      ),
    },
  },
  ];
}