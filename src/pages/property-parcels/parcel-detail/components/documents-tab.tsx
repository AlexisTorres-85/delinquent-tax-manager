import { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    type SortingState,
    type ColumnFiltersState,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { FilePlus, ScanLine, FileText } from 'lucide-react';
import { useDocuments } from '@/data/documents/hooks/use-documents';
import type { ParcelDocument, DocumentType } from '@/data/documents/types';
import { TabLayout, type FilterConfig } from './tab-layout';
import { documentColumns } from '../table-columns/documents.columns';

// ─── Document types list ──────────────────────────────────────────────────────

const DOCUMENT_TYPES: DocumentType[] = [
    'Signed Payment Plan Agreement',
    'Last Letter',
    'Final Notice',
    'Homestead Letter',
    'Delinquency Notice',
    'Tax Lien Certificate',
    'Foreclosure Notice',
    'Bankruptcy Filing',
    'Deed Transfer',
    'Assessment Appeal',
];

// ─── Inner table component ────────────────────────────────────────────────────

interface DocumentsTableProps {
    documents: ParcelDocument[];
    isLoading: boolean;
    lastUpdated: Date | null;
    onRefresh?: () => void;
    parcelNumber: string;
    stickyTop?: number;
}

function DocumentsTable({ documents, isLoading, lastUpdated, onRefresh, parcelNumber, stickyTop = 0 }: DocumentsTableProps) {
    const [sorting, setSorting] = useState<SortingState>([{ id: 'createdDate', desc: true }]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [typeFilter, setTypeFilter] = useState('all');

    const uniqueTypes = useMemo(
        () => [...new Set(documents.map((d) => d.type))].sort(),
        [documents],
    );

    function handleTypeChange(val: string) {
        setTypeFilter(val);
        setColumnFilters((prev) => {
            const next = prev.filter((f) => f.id !== 'type');
            if (val !== 'all') next.push({ id: 'type', value: val });
            return next;
        });
    }

    const hasActiveFilters = typeFilter !== 'all';

    function clearFilters() {
        setTypeFilter('all');
        setColumnFilters([]);
    }

    const table = useReactTable({
        data: documents,
        columns: documentColumns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state: { sorting, columnFilters },
        initialState: { pagination: { pageSize: 10 } },
    });

    const typeOptions: FilterConfig['options'] = [
        { value: 'all', label: 'All Types' },
        ...(uniqueTypes.length > 0
            ? uniqueTypes.map((t) => ({ value: t, label: t }))
            : DOCUMENT_TYPES.map((t) => ({ value: t, label: t }))),
    ];

    const filters: FilterConfig[] = [
        {
            value: typeFilter,
            onChange: handleTypeChange,
            placeholder: 'All Types',
            options: typeOptions,
        },
    ];

    const extraToolbarButtons = (
        <>
            <div className='h-5 w-px bg-divider shrink-0 mx-2' />
            <Button variant='outline' size='sm' className='gap-1.5 shrink-0' disabled={isLoading}>
                <FilePlus className='h-3.5 w-3.5' />
                <span className='text-xs'>Add Document</span>
            </Button>
            <Button variant='outline' size='sm' className='gap-1.5 shrink-0' disabled={isLoading}>
                <ScanLine className='h-3.5 w-3.5' />
                <span className='text-xs'>View Incoming Scans</span>
            </Button>
        </>
    );

    return (
        <TabLayout
            stickyTop={stickyTop}
            title="Documents"
            parcelNumber={parcelNumber}
            description="Uploaded documents and scanned records associated with this parcel."
            icon={<FileText className="h-8 w-8" />}
            lastUpdated={lastUpdated}
            hideSearch={true}
            globalFilter=""
            onGlobalFilterChange={() => undefined}
            filters={filters}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            extraToolbarButtons={extraToolbarButtons}
            onRefresh={onRefresh}
            table={table}
            recordCount={table.getFilteredRowModel().rows.length}
            isLoading={isLoading}
        />
    );
}

// ─── Tab entry point ──────────────────────────────────────────────────────────

interface DocumentsTabProps {
    parcelNumber: string;
    stickyTop?: number;
}

export function DocumentsTab({ parcelNumber, stickyTop }: DocumentsTabProps) {
    const { documents, isLoading, isRefreshing, lastUpdated, refetch } = useDocuments(parcelNumber);

    return (
        <DocumentsTable
            documents={documents}
            isLoading={isRefreshing}
            lastUpdated={lastUpdated}
            onRefresh={refetch}
            parcelNumber={parcelNumber}
            stickyTop={stickyTop}
        />
    );
}
