import { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageSection } from '@/components/layout/page-section';
import { useMunicipalities } from '@/data/lookup/use-municipalities';

const MUNICIPALITY_COLORS = [
    'var(--chart-muni-0)',  'var(--chart-muni-1)',  'var(--chart-muni-2)',  'var(--chart-muni-3)',
    'var(--chart-muni-4)',  'var(--chart-muni-5)',  'var(--chart-muni-6)',  'var(--chart-muni-7)',
    'var(--chart-muni-8)',  'var(--chart-muni-9)',  'var(--chart-muni-10)', 'var(--chart-muni-11)',
    'var(--chart-muni-12)', 'var(--chart-muni-13)', 'var(--chart-muni-14)', 'var(--chart-muni-15)',
];

interface DelinquencyInsightsProps {
    municipalityBreakdown: { label: string; count: number }[];
    inPaymentPlanCount: number;
    pageParcelsCount: number;
    selectedMunicipalityCode: string;
}

export function ParcelComposition({
    municipalityBreakdown,
    inPaymentPlanCount,
    pageParcelsCount,
    selectedMunicipalityCode,
}: DelinquencyInsightsProps) {
    const { municipalities } = useMunicipalities();

    const notInPaymentPlanCount = pageParcelsCount - inPaymentPlanCount;
    const planPct = pageParcelsCount > 0 ? (inPaymentPlanCount / pageParcelsCount) * 100 : 0;

    const countMap = useMemo(
        () => new Map(municipalityBreakdown.map((m) => [m.label, m.count])),
        [municipalityBreakdown]
    );

    const fullList = useMemo(
        () =>
            municipalities.map((m) => ({
                code: m.code,
                description: m.description,
                count: countMap.get(m.description) ?? 0,
                selected: !!selectedMunicipalityCode && m.code === selectedMunicipalityCode,
            })),
        [municipalities, countMap, selectedMunicipalityCode]
    );

    const activeCount = fullList.filter((m) => m.count > 0).length;

    // Donut — only municipalities with data; highlight selected slice in blue
    const donutData = fullList.filter((m) => m.count > 0);

    const chartSeries = donutData.length > 0 ? donutData.map((m) => m.count) : [1];

    const chartColors =
        donutData.length > 0
            ? donutData.map((m, i) =>
                  m.selected ? '#3b82f6' : MUNICIPALITY_COLORS[i % MUNICIPALITY_COLORS.length]
              )
            : ['#e2e8f0'];

    // Map code → assigned chart color for grid dots.
    const colorMap = new Map(
        donutData.map((m, i) => [
            m.code,
            m.selected ? '#3b82f6' : MUNICIPALITY_COLORS[i % MUNICIPALITY_COLORS.length],
        ])
    );

    const chartOptions = useMemo<ApexOptions>(
        () =>
            donutData.length > 0
                ? {
                      chart: {
                          type: 'donut',
                          toolbar: { show: false },
                          sparkline: { enabled: true },
                      },
                      labels: donutData.map((m) => m.description),
                      colors: chartColors,
                      legend: { show: false },
                      dataLabels: { enabled: false },
                      stroke: {
                          width: 2,
                          colors: ['#ffffff'],
                      },
                      plotOptions: {
                          pie: {
                              donut: {
                                  size: '50%',
                                  labels: {
                                      show: false,
                                  },
                              },
                          },
                      },
                      tooltip: {
                          y: {
                              formatter: (v: number) => `${v} parcel${v === 1 ? '' : 's'}`,
                          },
                      },
                  }
                : {
                      chart: {
                          type: 'donut',
                          toolbar: { show: false },
                          sparkline: { enabled: true },
                      },
                      labels: ['No data'],
                      colors: ['#e2e8f0'],
                      legend: { show: false },
                      dataLabels: { enabled: false },
                      stroke: { width: 0 },
                      plotOptions: {
                          pie: {
                              donut: {
                                  size: '80%',
                                  labels: {
                                      show: false,
                                  },
                              },
                          },
                      },
                      tooltip: { enabled: true },
                      states: {
                          hover: {
                              filter: { type: 'none' },
                          },
                      },
                  },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [donutData.map((m) => `${m.code}:${m.count}:${m.selected}`).join(','), pageParcelsCount]
    );

    return (
        <div
  className="px-6 py-4 flex flex-col"
>
            <PageSection
                icon={<Building2 className="size-4 text-muted-foreground" />}
                title="Parcel Composition"
                subtitle={`${activeCount} of ${municipalities.length} municipalities with records · current page`}
                className="flex-1"
                action={
                    <div className="rounded-md border border-border bg-muted/30 px-2 py-1 text-[11px] font-medium text-muted-foreground">
                        {inPaymentPlanCount} / {pageParcelsCount} in plan
                    </div>
                }
            >
                {/* Donut + Municipality grid side by side */}
                <div className="flex items-start gap-4 mb-3">
                    {/* Donut chart */}
                    <div className="relative shrink-0 h-[150px] w-[150px]">
                        <ReactApexChart
                            type="donut"
                            height={150}
                            width={150}
                            series={chartSeries}
                            options={chartOptions}
                        />

                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <span className="text-[13px] font-bold leading-none text-slate-500">
                                {pageParcelsCount}
                            </span>
                        </div>
                    </div>

                    {/* All municipalities — fixed 2-col × 8-row grid */}
                    <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-px">
                        {fullList.map(({ code, description, count, selected }) => (
                            <div
                                key={code}
                                className={cn(
                                    'flex items-center justify-between gap-2 rounded px-1.5 py-[3px] transition-colors',
                                    selected ? 'bg-blue-50' : count === 0 && 'opacity-50'
                                )}
                            >
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <span
                                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                                        style={{
                                            backgroundColor: selected
                                                ? '#3b82f6'
                                                : colorMap.get(code) ?? '#cbd5e1',
                                        }}
                                    />
                                    <span
                                        className={cn(
                                            'truncate text-[11px]',
                                            selected
                                                ? 'font-medium text-blue-700'
                                                : count > 0
                                                  ? 'text-foreground'
                                                  : 'text-muted-foreground'
                                        )}
                                    >
                                        {description}
                                    </span>
                                </div>

                                <span
                                    className={cn(
                                        'shrink-0 tabular-nums text-[11px] font-semibold',
                                        selected
                                            ? 'text-blue-700'
                                            : count > 0
                                              ? 'text-foreground'
                                              : 'text-muted-foreground'
                                    )}
                                >
                                    {count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment plan coverage */}
                <div className="border-t border-divider pt-2.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-muted-foreground">
                            Payment Plan Coverage
                        </span>
                        <span className="text-[11px] font-semibold tabular-nums text-foreground">
                            {Math.round(planPct)}%
                        </span>
                    </div>

                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                            style={{ width: `${planPct}%` }}
                        />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                            <span className="text-xs text-muted-foreground">In Payment Plan</span>
                        </div>
                        <span className="text-xs font-semibold tabular-nums text-foreground">
                            {inPaymentPlanCount}
                        </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 shrink-0 rounded-full bg-slate-300" />
                            <span className="text-xs text-muted-foreground">No Payment Plan</span>
                        </div>
                        <span className="text-xs font-semibold tabular-nums text-foreground">
                            {notInPaymentPlanCount}
                        </span>
                    </div>
                </div>
            </PageSection>
        </div>
    );
}