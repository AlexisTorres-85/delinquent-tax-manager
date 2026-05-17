import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Button } from '@/components/ui/button';
import { Download, FileText, LandPlotIcon } from 'lucide-react';
import { ParcelsTable } from './components/parcels-table';
import { ScopeSnapshot } from './components/scope-snapshot';
import { GridControls } from './components/grid-controls';
import { useParcelFilters } from '@/data/parcels/hooks/use-parcel-filters';
import type { PaymentPlanFilter } from '@/data/parcels/hooks/use-parcel-filters';
import { useParcelsApi } from '@/data/parcels/hooks/use-parcels-api';
import { useMemo } from 'react';

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

  // Baseline call (no year filter, pageSize=1) — provides total counts for chart breakdown
  const { totalCount: baselineTotal, delinquentInScope: baselineDelinquent } = useParcelsApi({
    pageNumber: 1,
    pageSize: 1,
    ...sharedParams,
  });

  // Chart breakdown counts
  const chartInRange = delinquentInScope;
  const chartOutsideRange = Math.max(0, baselineDelinquent - chartInRange);
  const chartNoDelinquency = Math.max(0, baselineTotal - baselineDelinquent);

  // Municipality breakdown for current page — all municipalities, no truncation
  const municipalityBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of parcels) {
      const key = p.municipality || 'Unknown';
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([label, count]) => ({ label, count }));
  }, [parcels]);

  const inPaymentPlanCount = useMemo(
    () => parcels.filter((p) => p.isInPaymentPlan).length,
    [parcels]
  );

  // Unique calendar years from delinquentYears strings, sorted ascending
  const availableDelinquentYears = useMemo(() => {
    const yearSet = new Set<number>();
    for (const p of parcels) {
      if (p.delinquentYears) {
        p.delinquentYears.split(',').forEach((y) => {
          const n = parseInt(y.trim(), 10);
          if (!isNaN(n)) yearSet.add(n);
        });
      }
    }
    return Array.from(yearSet).sort((a, b) => a - b);
  }, [parcels]);

  // Client-side filter by delinquent year range — removed; API now handles delinquentTaxYears param

  return (
    <ContentWrapper
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Property Parcels', href: '/property-parcels/delinquent-parcel-cases' },
        { label: 'Cases' },
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
        title: 'Delinquent Parcel Cases',
        subtitle: 'Access parcel records and account details',
      }}
      mainClassName="p-0"
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
            availableDelinquentYears={availableDelinquentYears}
            delinquentYearRange={delinquentYearRange}
            onDelinquentYearRangeChange={setDelinquentYearRange}
            chartInRange={chartInRange}
            chartOutsideRange={chartOutsideRange}
            chartNoDelinquency={chartNoDelinquency}
            municipalityBreakdown={municipalityBreakdown}
            inPaymentPlanCount={inPaymentPlanCount}
            pageParcelsCount={parcels.length}
            onReset={reset}
          />
          <ScopeSnapshot
            totalCount={totalCount}
            delinquentInScope={delinquentInScope}
            inRemCount={inRemCount}
            bankruptcyCount={bankruptcyCount}
          />
          <div className='border-t border-divider bg-table-header'>
            <div className={`h-1 bg-table-header overflow-hidden transition-opacity duration-200 ${isFetching || isLoading ? 'opacity-100' : 'opacity-0'}`}>
              <div className="h-full w-2/5 bg-[var(--color-app-primary-from)] animate-[progress-indeterminate_1.4s_ease-in-out_infinite]" />
            </div>
          </div>
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
