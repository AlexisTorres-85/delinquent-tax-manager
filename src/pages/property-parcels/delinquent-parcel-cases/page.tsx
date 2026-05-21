import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, FileText, LandPlotIcon } from 'lucide-react';
import { ParcelsTable } from './components/parcels-table';
import { ScopeSnapshot } from './components/scope-snapshot';
import { GridControls } from './components/grid-controls';
import { useParcelFilters } from '@/data/parcels/hooks/use-parcel-filters';
import type { PaymentPlanFilter } from '@/data/parcels/hooks/use-parcel-filters';
import { useParcelsApi } from '@/data/parcels/hooks/use-parcels-api';

export function ParcelsPage() {
  const {
    search,
    debouncedSearch,
    legalStatus,
    municipalityCode,
    pageSize,
    pageNumber,
    columnVisibility,
    paymentPlanFilter,
    delinquentYearRange,
    setSearch,
    setLegalStatus,
    setMunicipalityCode,
    setPageSize,
    setPageNumber,
    setColumnVisibility,
    setPaymentPlanFilter,
    setDelinquentYearRange,
    reset,
  } = useParcelFilters();

  // Derive isInPaymentPlan API param from the richer PaymentPlanFilter value
  function toIsInPaymentPlan(f: PaymentPlanFilter): boolean | undefined {
    if (f === 'all') return undefined;
    if (f === 'notInPlan') return false;
    return true; // inPlan, activePlan, brokenPlan, coversCaseTaxYears, partiallyCoversCaseTaxYears, historicalOnly
  }

  // Shared filter params (without year range) — used for both grid and chart baseline
  const sharedParams = {
    search: debouncedSearch || undefined,
    isDelinquent: legalStatus === 'isDelinquent' || undefined,
    isInRem: legalStatus === 'isInRem' || undefined,
    isBankruptcy: legalStatus === 'isBankruptcy' || undefined,
    isDeeded: legalStatus === 'isDeeded' || undefined,
    municipalityCode: municipalityCode || undefined,
    isInPaymentPlan: toIsInPaymentPlan(paymentPlanFilter),
  };

  const { parcels, totalCount, totalPages, delinquentInScope, inRemCount, bankruptcyCount, isLoading, isFetching, isError, error } = useParcelsApi({
    pageNumber,
    pageSize,
    ...sharedParams,
    delinquentTaxYears: delinquentYearRange ?? undefined,
  });


  return (
    <ContentWrapper
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Property Parcels', href: '/property-parcels/delinquent-parcel-cases' },
        { label: 'Cases' },
      ]}
      actions={
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Button>
      }
      mainHeader={{
        icon: <img src="/images/icons/property-parcel.png" className="h-10 w-10 object-contain" />,
        title: 'Delinquent Parcel Cases',
        subtitle: 'Access parcel records and account details',
      }}
      mainClassName="p-0"
      isLoading={isLoading}
      main={
        <div className="h-full">
          {isError && (
            <div className="px-6 py-4 bg-destructive/10 border-b border-destructive/20 text-sm text-destructive">
              Failed to load parcels: {error instanceof Error ? error.message : 'An unexpected error occurred.'}
            </div>
          )}
          <GridControls
            search={search}
            onSearchChange={setSearch}
            legalStatus={legalStatus}
            onLegalStatusChange={setLegalStatus}
            municipalityCode={municipalityCode}
            onMunicipalityCodeChange={setMunicipalityCode}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
            paymentPlanFilter={paymentPlanFilter}
            onPaymentPlanFilterChange={setPaymentPlanFilter}
            onReset={reset}
          />
          <ScopeSnapshot
            totalCount={totalCount}
            delinquentInScope={delinquentInScope}
            inRemCount={inRemCount}
            bankruptcyCount={bankruptcyCount}
          />
          <div className='pb-20 overflow-x-auto'>
            <ParcelsTable
              data={parcels}
              pageSize={pageSize}
              pageNumber={pageNumber}
              totalCount={totalCount}
              totalPages={totalPages}
              onPageChange={setPageNumber}
              onPageSizeChange={setPageSize}
              isLoading={isLoading}
              isFetching={isFetching}
              columnVisibility={columnVisibility}
              onColumnVisibilityChange={setColumnVisibility}
            />
          </div>
        </div>
      }
    />
  );
}
