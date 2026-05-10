import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Button } from '@/components/ui/button';
import { Download, FileText, LandPlotIcon, SlidersHorizontal } from 'lucide-react';
import { ParcelsTable } from './components/parcels-table';
import { GridControls } from './components/grid-controls';
import { useParcelFilters } from '@/data/parcels/hooks/use-parcel-filters';
import { useParcels } from '@/data/parcels/hooks/use-parcels';

export function ParcelsPage() {
  const {
    filters,
    pageSize,
    columnVisibility,
    setSearch,
    setStatus,
    setMinAmountDue,
    setOnlyNoPayment,
    setPageSize,
    setColumnVisibility,
    reset,
  } = useParcelFilters();

  const { filtered } = useParcels(filters);

  return (
    <ContentWrapper
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Property Parcels', href: '/property-parcels' },
        { label: 'Parcel Lookup' },
      ]}
      actions={
        <>
          <Button variant="secondary">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="primary">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
        </>
      }
      mainHeader={{
        icon: <LandPlotIcon className="h-6 w-6" />,
        title: 'Property Parcel Lookup',
        subtitle: 'Access parcel records and account details',
      }}
      leftHeader={{
        icon: <SlidersHorizontal className="h-6 w-6" />,
        title: 'Grid Controls',
        subtitle: 'Control columns, filters, and data layout',
      }}
      leftWidth="30%"
      mainWidth="70%"
      leftClassName="bg-white"
      mainClassName="p-0"
      allowCollapseLeft
      left={
        <GridControls
          search={filters.search}
          onSearchChange={setSearch}
          statusFilter={filters.status}
          onStatusFilterChange={setStatus}
          minAmountDue={filters.minAmountDue}
          onMinAmountDueChange={setMinAmountDue}
          onlyNoPayment={filters.onlyNoPayment}
          onOnlyNoPaymentChange={setOnlyNoPayment}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          onReset={reset}
        />
      }
      main={
        <div className="h-full">
          <div className='pb-20'>
            <ParcelsTable
              data={filtered}
              pageSize={pageSize}
              columnVisibility={columnVisibility}
              onColumnVisibilityChange={setColumnVisibility}
            />
          </div>
        </div>
      }
    />
  );
}
