import { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { Skeleton } from '@/components/ui/skeleton';
import { useParcelsApi } from '@/data/parcels/hooks/use-parcels-api';

interface DashboardMainStatsProps {
  municipalityCode?: string;
  taxYear?: number | null;
}

function getDonutOptions(labels: string[], colors: string[]): ApexOptions {
  return {
    chart: {
      type: 'donut',
      toolbar: { show: false },
      sparkline: { enabled: true },
    },
    labels,
    colors,
    stroke: { width: 1, colors: ['#fff'] },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: {
      enabled: true,
      y: { formatter: (value) => `${value} parcels` },
    },
    plotOptions: {
      pie: {
        donut: { size: '40%', labels: { show: false } },
      },
    },
  };
}

export function DashboardMainStats({ municipalityCode, taxYear }: DashboardMainStatsProps) {
  const { totalCount, delinquentInScope, inRemCount, bankruptcyCount, isLoading } =
    useParcelsApi({
      pageNumber: 1,
      pageSize: 1,
      municipalityCode: municipalityCode || undefined,
      delinquentTaxYears: taxYear ? [taxYear, taxYear] : undefined,
    });

  const otherDelinquent = Math.max(0, delinquentInScope - inRemCount - bankruptcyCount);

  const stats = useMemo(
    () => [
      {
        title: 'Delinquent Parcels',
        value: delinquentInScope,
        subtitle: `of ${totalCount} total parcels`,
        chartLabels: ['In Rem', 'In Bankruptcy', 'Other Delinquent'],
        chartData: [inRemCount, bankruptcyCount, otherDelinquent],
        chartColors: [
          'var(--chart-in-range)',
          'var(--chart-outside-range)',
          'var(--chart-no-delinquency)',
        ],
      },
      {
        title: 'In Rem Active',
        value: inRemCount,
        subtitle: `${delinquentInScope > 0 ? ((inRemCount / delinquentInScope) * 100).toFixed(1) : '0'}% of delinquent`,
        chartLabels: ['In Rem', 'Other Delinquent'],
        chartData: [inRemCount, Math.max(0, delinquentInScope - inRemCount)],
        chartColors: ['var(--chart-muni-0)', 'var(--chart-muni-8)'],
      },
      {
        title: 'In Bankruptcy',
        value: bankruptcyCount,
        subtitle: `${delinquentInScope > 0 ? ((bankruptcyCount / delinquentInScope) * 100).toFixed(1) : '0'}% of delinquent`,
        chartLabels: ['In Bankruptcy', 'Other Delinquent'],
        chartData: [bankruptcyCount, Math.max(0, delinquentInScope - bankruptcyCount)],
        chartColors: ['var(--chart-muni-1)', 'var(--chart-muni-9)'],
      },
    ],
    [totalCount, delinquentInScope, inRemCount, bankruptcyCount, otherDelinquent],
  );

  return (
    <div>
      <dl className="grid grid-cols-1 overflow-hidden rounded-lg border border-white/20 bg-white/15 shadow-sm backdrop-blur-md md:grid-cols-3 md:divide-x md:divide-white/50">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="flex items-center gap-4 bg-white/10 px-4 py-5 backdrop-blur-sm sm:p-6"
          >
            {/* Donut */}
            <div className="relative flex w-[78px] shrink-0 items-center justify-center">
              <ReactApexChart
                options={getDonutOptions(stat.chartLabels, stat.chartColors)}
                series={stat.chartData.some((v) => v > 0) ? stat.chartData : [1]}
                type="donut"
                height={78}
                width={78}
              />
              {/* centre label */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="text-[11px] font-bold leading-none text-white/70">
                  {stat.chartData.reduce((a, b) => a + b, 0)}
                </span>
              </div>
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-white/60">
                {stat.title}
              </p>
              {isLoading ? (
                <>
                  <Skeleton className="mt-1.5 h-7 w-20 rounded bg-white/20" />
                  <Skeleton className="mt-1.5 h-3 w-28 rounded bg-white/10" />
                </>
              ) : (
                <>
                  <p className="mt-0.5 text-2xl font-bold tabular-nums text-white">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-white/50">{stat.subtitle}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}

