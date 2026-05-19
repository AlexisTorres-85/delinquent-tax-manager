import { useState, useCallback, useMemo } from 'react';
import { RefreshCw, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/auth/use-auth';
import { useMunicipalities } from '@/data/lookup/use-municipalities';
import { useParcelsApi } from '@/data/parcels/hooks/use-parcels-api';
import { DashboardMainStats } from './components/dashboard-main-stats';
import { DashboardHeader } from './components/dashboard-header';
import { MyAssignedTasks } from './components/my-assigned-tasks';
import { DelinquencyScopeBreakdown } from './components/delinquency-scope-breakdown';
import { ParcelComposition } from './components/parcel-composition';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const CURRENT_YEAR = new Date().getFullYear();
const TAX_YEARS = Array.from({ length: 7 }, (_, i) => CURRENT_YEAR - i); // last 7 years

export function DashboardPage() {
  const { displayName } = useAuth();
  const firstName = displayName.split(' ')[0] || displayName;

  const [municipalityCode, setMunicipalityCode] = useState('');
  const [taxYear, setTaxYear] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [delinquentYearRange, setDelinquentYearRange] = useState<[number, number] | null>(null);

  const { municipalities } = useMunicipalities();

  const handleRefresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const sharedParams = {
    municipalityCode: municipalityCode || undefined,
    delinquentTaxYears: taxYear ? ([taxYear, taxYear] as [number, number]) : undefined,
  };

  const { parcels, delinquentInScope } = useParcelsApi({
    pageNumber: 1,
    pageSize: 500,
    ...sharedParams,
  });

  const { totalCount: baselineTotal, delinquentInScope: baselineDelinquent } = useParcelsApi({
    pageNumber: 1,
    pageSize: 1,
    municipalityCode: municipalityCode || undefined,
  });

  const chartInRange = delinquentInScope;
  const chartOutsideRange = Math.max(0, baselineDelinquent - chartInRange);
  const chartNoDelinquency = Math.max(0, baselineTotal - baselineDelinquent);

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
    [parcels],
  );

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

  const fromYear =
    delinquentYearRange?.[0] ??
    (availableDelinquentYears.length ? Math.min(...availableDelinquentYears) : 0);
  const toYear =
    delinquentYearRange?.[1] ??
    (availableDelinquentYears.length ? Math.max(...availableDelinquentYears) : 0);

  const actions = (
    <>
      {/* Municipality filter */}
      <Select
        variant="glass"
        value={municipalityCode || 'all'}
        onValueChange={(v) => setMunicipalityCode(v === 'all' ? '' : v)}
      >
        <SelectTrigger size="sm" className="w-auto min-w-[160px]">
          <SelectValue placeholder="All Municipalities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Municipalities</SelectItem>
          {municipalities.map((m) => (
            <SelectItem key={m.code} value={m.code}>{m.description}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Tax year filter */}
      <Select
        variant="glass"
        value={taxYear != null ? String(taxYear) : 'all'}
        onValueChange={(v) => setTaxYear(v === 'all' ? null : Number(v))}
      >
        <SelectTrigger size="sm" className="w-auto min-w-[120px]">
          <CalendarDays className="size-3.5 shrink-0 opacity-60" />
          <SelectValue placeholder="All Tax Years" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tax Years</SelectItem>
          {TAX_YEARS.map((y) => (
            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Refresh */}
      <Button
        variant="outline"
        size="sm"
        className="border-white/20 bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
        onClick={handleRefresh}
      >
        <RefreshCw className="size-3.5" />
        Refresh
      </Button>
    </>
  );

  return (
    <div className="flex h-full flex-col text-white ml-4 mr-6">
      <div className="pt-3">
        <DashboardHeader
          title={`Welcome ${firstName}`}
          subtitle="Here's what's happening with your parcels today."
          actions={actions}
        />
        <DashboardMainStats
          key={refreshKey}
          municipalityCode={municipalityCode}
          taxYear={taxYear}
        />
      </div>

      <div className="flex-1 mt-8 overflow-y-auto border-t-6 border-app-secondary rounded-t-xl px-6 bg-white/85 text-foreground">
        <div className="grid h-full grid-cols-2">
          {/* Left: My Assigned Tasks */}
          <div className='pt-4 pr-8'>
            <MyAssignedTasks />
          </div>

          {/* Right: Tabbed charts */}
          <div className="flex flex-col">
            <Tabs defaultValue="scope" className="flex h-full flex-col">
              <div className="px-6 pt-5">
                <TabsList variant="line" size="lg">
                  <TabsTrigger value="scope">Delinquency Scope Breakdown</TabsTrigger>
                  <TabsTrigger value="composition">Parcel Composition</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="scope" className="mt-0 flex-1">
                <DelinquencyScopeBreakdown
                  from={fromYear}
                  to={toYear}
                  inRange={chartInRange}
                  outsideRange={chartOutsideRange}
                  noDelinquency={chartNoDelinquency}
                  availableDelinquentYears={availableDelinquentYears}
                  delinquentYearRange={delinquentYearRange}
                  onDelinquentYearRangeChange={setDelinquentYearRange}
                />
              </TabsContent>

              <TabsContent value="composition" className="mt-0 flex-1">
                <ParcelComposition
                  municipalityBreakdown={municipalityBreakdown}
                  inPaymentPlanCount={inPaymentPlanCount}
                  pageParcelsCount={parcels.length}
                  selectedMunicipalityCode={municipalityCode}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}