import { useState, useEffect } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getExpandedRowModel,
    type SortingState,
    type ExpandedState,
} from '@tanstack/react-table';
import { useNotes } from '@/data/notes/hooks/use-notes';
import { TabLayout } from '@/components/ui/tab-layout';
import type { ParcelStatus, ParcelStage } from '@/data/parcels/types';
import { notesColumns } from '../../table-columns/notes.columns';

// ─── Tab component ────────────────────────────────────────────────────────────

interface NotesTabProps {
    parcelId: number;
    parcelNumber: string;
    stickyTop?: number;
    currentStatus?: ParcelStatus;
    currentStage?: ParcelStage;
}

export function NotesTab({ parcelId, parcelNumber, stickyTop = 0, currentStatus, currentStage }: NotesTabProps) {
    const { notes, isLoading, isRefreshing, lastUpdated, refetch } = useNotes(parcelId);

    const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }]);
    const [globalFilter, setGlobalFilter] = useState('');
    // All rows expanded by default; keyed by note id so individual rows can be collapsed
    const [expanded, setExpanded] = useState<ExpandedState>({});

    // When notes load (or reload), expand all rows by default
    useEffect(() => {
        setExpanded(Object.fromEntries(notes.map((n) => [String(n.id), true])));
    }, [notes]);

    const table = useReactTable({
        data: notes,
        columns: notesColumns,
        getRowId: (row) => String(row.id),
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onExpandedChange: setExpanded,
        state: { sorting, globalFilter, expanded },
        initialState: { pagination: { pageSize: 20 } },
    });

    return (
        <TabLayout
            stickyTop={stickyTop}
            title="Notes"
            parcelNumber={parcelNumber}
            description="All case notes, call logs, and communications recorded on this parcel."
            icon="/images/icons/notes-icon.png"
            lastUpdated={lastUpdated}
            searchPlaceholder="Search notes..."
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            hasActiveFilters={globalFilter !== ''}
            onClearFilters={() => setGlobalFilter('')}
            onRefresh={refetch}
            table={table}
            recordCount={table.getFilteredRowModel().rows.length}
            isLoading={isLoading || isRefreshing}
            currentStatus={currentStatus}
            currentStage={currentStage}
        />
    );
}
