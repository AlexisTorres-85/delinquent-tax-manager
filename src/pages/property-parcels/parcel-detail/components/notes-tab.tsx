import { useState, useEffect, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getExpandedRowModel,
    type SortingState,
    type ColumnFiltersState,
    type ExpandedState,
} from '@tanstack/react-table';
import { StickyNote } from 'lucide-react';
import { useNotes } from '@/data/notes/hooks/use-notes';
import type { NoteMessageType } from '@/data/notes/types';
import { TabLayout, type FilterConfig } from './tab-layout';
import { notesColumns } from '../table-columns/notes.columns';

// ─── All message types ────────────────────────────────────────────────────────

const NOTE_MESSAGE_TYPES: NoteMessageType[] = [
    'Payment Problems',
    'Call',
    'Tax Deeded Note',
    'Bankruptcy Note',
    'Legal Note',
    'General Note',
    'Status Update',
    'Owner Contact',
    'Attorney Communication',
];

// ─── Tab component ────────────────────────────────────────────────────────────

interface NotesTabProps {
    parcelNumber: string;
    stickyTop?: number;
}

export function NotesTab({ parcelNumber, stickyTop = 0 }: NotesTabProps) {
    const { notes, isLoading, isRefreshing, lastUpdated, refetch } = useNotes(parcelNumber);

    const [sorting, setSorting] = useState<SortingState>([{ id: 'createdDate', desc: true }]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [messageTypeFilter, setMessageTypeFilter] = useState('all');
    // All rows expanded by default; keyed by note id so individual rows can be collapsed
    const [expanded, setExpanded] = useState<ExpandedState>({});

    // When notes load (or reload), expand all rows by default
    useEffect(() => {
        setExpanded(Object.fromEntries(notes.map((n) => [n.id, true])));
    }, [notes]);

    function handleMessageTypeChange(val: string) {
        setMessageTypeFilter(val);
        setColumnFilters((prev) => {
            const next = prev.filter((f) => f.id !== 'messageType');
            if (val !== 'all') next.push({ id: 'messageType', value: val });
            return next;
        });
    }

    const hasActiveFilters = globalFilter !== '' || messageTypeFilter !== 'all';

    function clearFilters() {
        setGlobalFilter('');
        setMessageTypeFilter('all');
        setColumnFilters([]);
    }

    const table = useReactTable({
        data: notes,
        columns: notesColumns,
        getRowId: (row) => row.id,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        onExpandedChange: setExpanded,
        state: { sorting, globalFilter, columnFilters, expanded },
        initialState: { pagination: { pageSize: 10 } },
    });

    const filters: FilterConfig[] = useMemo(() => [
        {
            value: messageTypeFilter,
            onChange: handleMessageTypeChange,
            placeholder: 'All Message Types',
            options: [
                { value: 'all', label: 'All Message Types' },
                ...NOTE_MESSAGE_TYPES.map((t) => ({ value: t, label: t })),
            ],
        },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ], [messageTypeFilter]);

    return (
        <TabLayout
            stickyTop={stickyTop}
            title="Notes"
            parcelNumber={parcelNumber}
            description="All case notes, call logs, and communications recorded on this parcel."
            icon={<StickyNote className="h-8 w-8" />}
            lastUpdated={lastUpdated}
            searchPlaceholder="Search notes..."
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            filters={filters}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            onRefresh={refetch}
            table={table}
            recordCount={table.getFilteredRowModel().rows.length}
            isLoading={isRefreshing}
        />
    );
}
