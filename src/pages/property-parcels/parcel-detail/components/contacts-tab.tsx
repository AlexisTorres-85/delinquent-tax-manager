import { useState } from 'react';
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
import { UserPlus, Users } from 'lucide-react';
import { useContacts } from '@/data/contacts/hooks/use-contacts';
import type { ContactStatus } from '@/data/contacts/types';
import { TabLayout, type FilterConfig } from './tab-layout';
import { contactColumns } from '../table-columns/contacts.columns';

// ─── All contact statuses ─────────────────────────────────────────────────────

const CONTACT_STATUSES: ContactStatus[] = [
    'Current Owner',
    'Co-Owner',
    'Former Owner',
    'Attorney',
    'Lien Holder',
    'Tenant',
    'Estate Representative',
    'Authorized Agent',
    'Bankruptcy Trustee',
    'Interest Party',
];

// ─── Inner table component ────────────────────────────────────────────────────

interface ContactsTableProps {
    contacts: import('@/data/contacts/types').ParcelContact[];
    isLoading: boolean;
    lastUpdated: Date | null;
    onRefresh?: () => void;
    parcelNumber: string;
    stickyTop?: number;
}

function ContactsTable({ contacts, isLoading, lastUpdated, onRefresh, parcelNumber, stickyTop = 0 }: ContactsTableProps) {
    const [sorting, setSorting] = useState<SortingState>([{ id: 'fullName', desc: false }]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [statusFilter, setStatusFilter] = useState('all');

    function handleStatusChange(val: string) {
        setStatusFilter(val);
        setColumnFilters((prev) => {
            const next = prev.filter((f) => f.id !== 'status');
            if (val !== 'all') next.push({ id: 'status', value: val });
            return next;
        });
    }

    const hasActiveFilters = globalFilter !== '' || statusFilter !== 'all';

    function clearFilters() {
        setGlobalFilter('');
        setStatusFilter('all');
        setColumnFilters([]);
    }

    const table = useReactTable({
        data: contacts,
        columns: contactColumns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        state: { sorting, globalFilter, columnFilters },
        initialState: { pagination: { pageSize: 10 } },
    });

    const filters: FilterConfig[] = [
        {
            value: statusFilter,
            onChange: handleStatusChange,
            placeholder: 'All Statuses',
            options: [
                { value: 'all', label: 'All Statuses' },
                ...CONTACT_STATUSES.map((s) => ({ value: s, label: s })),
            ],
        },
    ];

    const extraToolbarButtons = (
        <>
            <div className='h-5 w-px bg-divider shrink-0 mx-2' />
            <Button variant='outline' size='sm' className='gap-1.5 shrink-0' disabled={isLoading}>
                <UserPlus className='h-3.5 w-3.5' />
                <span className='text-xs'>Add Contact</span>
            </Button>
        </>
    );

    return (
        <TabLayout
            stickyTop={stickyTop}
            title="Contacts"
            parcelNumber={parcelNumber}
            description="Owners, attorneys, lien holders, and other parties associated with this parcel."
            icon={<Users className="h-8 w-8" />}
            lastUpdated={lastUpdated}
            searchPlaceholder="Search contacts..."
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
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

interface ContactsTabProps {
    parcelNumber: string;
    stickyTop?: number;
}

export function ContactsTab({ parcelNumber, stickyTop }: ContactsTabProps) {
    const { contacts, isRefreshing, lastUpdated, refetch } = useContacts(parcelNumber);

    return (
        <ContactsTable
            contacts={contacts}
            isLoading={isRefreshing}
            lastUpdated={lastUpdated}
            onRefresh={refetch}
            parcelNumber={parcelNumber}
            stickyTop={stickyTop}
        />
    );
}
