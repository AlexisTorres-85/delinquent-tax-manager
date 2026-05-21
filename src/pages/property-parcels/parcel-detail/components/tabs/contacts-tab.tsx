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
import { UserPlus } from 'lucide-react';
import { useContacts } from '@/data/contacts/hooks/use-contacts';
import { useContactTypes } from '@/data/lookup/use-contact-types';
import type { ParcelContact } from '@/data/contacts/types';
import { TabLayout, type FilterConfig } from '@/components/ui/tab-layout';
import type { ParcelStatus, ParcelStage } from '@/data/parcels/types';
import { createContactColumns } from '../../table-columns/contacts.columns';
import { ContactDialog } from '../dialogs/add-contact-dialog';

// ─── Inner table component ────────────────────────────────────────────────────

interface ContactsTableProps {
    contacts: ParcelContact[];
    isLoading: boolean;
    isLoadingTable?: boolean;
    lastUpdated: Date | null;
    onRefresh?: () => void;
    parcelId: number;
    parcelNumber: string;
    stickyTop?: number;
    currentStatus?: ParcelStatus;
    currentStage?: ParcelStage;
}

function ContactsTable({ contacts, isLoading, isLoadingTable, lastUpdated, onRefresh, parcelId, parcelNumber, stickyTop = 0, currentStatus, currentStage }: ContactsTableProps) {
    const [sorting, setSorting] = useState<SortingState>([{ id: 'fullName', desc: false }]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [typeFilter, setTypeFilter] = useState('all');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editContact, setEditContact] = useState<ParcelContact | null>(null);

    const { contactTypes } = useContactTypes();

    function handleEdit(contact: ParcelContact) {
        setEditContact(contact);
        setDialogOpen(true);
    }

    function handleAddNew() {
        setEditContact(null);
        setDialogOpen(true);
    }

    function handleTypeChange(val: string) {
        setTypeFilter(val);
        setColumnFilters((prev) => {
            const next = prev.filter((f) => f.id !== 'contactTypeName');
            if (val !== 'all') next.push({ id: 'contactTypeName', value: val });
            return next;
        });
    }

    const hasActiveFilters = globalFilter !== '' || typeFilter !== 'all';

    function clearFilters() {
        setGlobalFilter('');
        setTypeFilter('all');
        setColumnFilters([]);
    }

    const columns = useMemo(() => createContactColumns(handleEdit), []);

    const table = useReactTable({
        data: contacts,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        state: { sorting, globalFilter, columnFilters },
        initialState: { pagination: { pageSize: 20 } },
    });

    const filters: FilterConfig[] = [
        {
            value: typeFilter,
            onChange: handleTypeChange,
            placeholder: 'All Types',
            options: [
                { value: 'all', label: 'All Types' },
                ...contactTypes.map((t) => ({ value: t.name, label: t.name })),
            ],
        },
    ];

    const extraToolbarButtons = (
        <>
            <div className='h-5 w-px bg-divider shrink-0 mx-2' />
            <Button variant='outline' size='sm' className='gap-1.5 shrink-0' disabled={isLoading} onClick={handleAddNew}>
                <UserPlus className='h-3.5 w-3.5' />
                <span className='text-xs'>Add Contact</span>
            </Button>
        </>
    );

    return (
        <>
        <TabLayout
            stickyTop={stickyTop}
            title="Contacts"
            parcelNumber={parcelNumber}
            description="Owners, attorneys, lien holders, and other parties associated with this parcel."
            icon="/images/icons/contacts-icon.png"
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
            isLoadingTable={isLoadingTable}
            currentStatus={currentStatus}
            currentStage={currentStage}
        />
        <ContactDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            parcelId={parcelId}
            parcelNumber={parcelNumber}
            editContact={editContact}
        />
        </>
    );
}

// ─── Tab entry point ──────────────────────────────────────────────────────────

interface ContactsTabProps {
    parcelId: number;
    parcelNumber: string;
    stickyTop?: number;
    currentStatus?: ParcelStatus;
    currentStage?: ParcelStage;
}

export function ContactsTab({ parcelId, parcelNumber, stickyTop, currentStatus, currentStage }: ContactsTabProps) {
    const { contacts, isLoading, isRefreshing, lastUpdated, refetch } = useContacts(parcelId);

    return (
        <ContactsTable
            contacts={contacts}
            isLoading={isLoading}
            isLoadingTable={isRefreshing}
            lastUpdated={lastUpdated}
            onRefresh={refetch}
            parcelId={parcelId}
            parcelNumber={parcelNumber}
            stickyTop={stickyTop}
            currentStatus={currentStatus}
            currentStage={currentStage}
        />
    );
}

