import { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { CountingNumber } from '@/components/ui/counting-number';

type StatCard = {
  title: string;
  value: number;
  previousLabel: string;
  change: string;
  trend: 'up' | 'down';
  chartLabels: string[];
  chartData: number[];
  chartColors: string[];
};

export function DashboardPage() {
  const stats = useMemo<StatCard[]>(
    () => [
      {
        title: 'Delinquent Parcels',
        value: 718,
        previousLabel: 'by delinquency age',
        change: '3.46%',
        trend: 'up',
        chartLabels: ['1 Year', '2 Years', '3+ Years'],
        chartData: [316, 247, 155],
        chartColors: ['#93c5fd', '#facc15', '#fb7185'],
      },
      {
        title: 'Tax Deed Eligible',
        value: 156,
        previousLabel: 'by workflow status',
        change: '9.09%',
        trend: 'up',
        chartLabels: ['Final Notice', 'Title Search', 'Legal Review'],
        chartData: [64, 52, 40],
        chartColors: ['#86efac', '#60a5fa', '#c084fc'],
      },
      {
        title: 'In Rem Active',
        value: 42,
        previousLabel: 'by process step',
        change: '10.64%',
        trend: 'down',
        chartLabels: ['Petition', 'Publication', 'Hearing'],
        chartData: [18, 14, 10],
        chartColors: ['#38bdf8', '#fbbf24', '#f87171'],
      },
    ],
    []
  );

  const getDonutOptions = (
    labels: string[],
    colors: string[]
  ): ApexOptions => ({
    chart: {
      type: 'donut',
      sparkline: {
        enabled: true,
      },
    },
    labels,
    colors,
    stroke: {
      width: 1,
      colors: ['rgba(255,255,255,0.35)'],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      y: {
        formatter: (value) => `${value} parcels`,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '68%',
        },
      },
    },
  });

  return (
    <div className="min-h-screen px-6 py-4 text-white">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-wide">
            Welcome Alexis
          </h1>
          <span className="mt-1 block text-sm text-white/75">
            Here's what's happening with your parcels today.
          </span>
        </div>
      </div>

      <div>
        <dl className="grid grid-cols-1 overflow-hidden rounded-lg border border-white/20 bg-white/15 shadow-sm backdrop-blur-md md:grid-cols-3 md:divide-x md:divide-white/50">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="flex items-center gap-4 bg-white/10 px-4 py-5 backdrop-blur-sm sm:p-6"
            >
              <div className="flex w-[86px] shrink-0 items-center justify-center">
                <ReactApexChart
                  options={getDonutOptions(stat.chartLabels, stat.chartColors)}
                  series={stat.chartData}
                  type="donut"
                  height={78}
                  width={78}
                />
              </div>

              <div className="min-w-0 flex-1">
                <dt className="text-base font-normal text-white/85">
                  {stat.title}
                </dt>

                <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                  <div className="flex items-baseline text-2xl font-semibold text-white">
                    <CountingNumber  />

                    <span className="ml-2 text-sm font-medium text-white/65">
                      {stat.previousLabel}
                    </span>
                  </div>

                  <div
                    className={`inline-flex items-baseline rounded-full bg-white/15 px-2.5 py-0.5 text-sm font-medium backdrop-blur-sm md:mt-2 lg:mt-0 ${
                      stat.trend === 'up' ? 'text-green-100' : 'text-red-100'
                    }`}
                  >
                    {stat.trend === 'up' ? (
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        data-slot="icon"
                        aria-hidden="true"
                        className="-ml-1 mr-0.5 size-5 shrink-0 self-center text-green-300"
                      >
                        <path
                          d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z"
                          clipRule="evenodd"
                          fillRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        data-slot="icon"
                        aria-hidden="true"
                        className="-ml-1 mr-0.5 size-5 shrink-0 self-center text-red-300"
                      >
                        <path
                          d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z"
                          clipRule="evenodd"
                          fillRule="evenodd"
                        />
                      </svg>
                    )}

                    <span className="sr-only">
                      {stat.trend === 'up' ? 'Increased by' : 'Decreased by'}
                    </span>

                    {stat.change}
                  </div>
                </dd>

                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                  {stat.chartLabels.map((label, index) => (
                    <div
                      key={label}
                      className="flex items-center gap-1.5 text-[11px] font-medium text-white/65"
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: stat.chartColors[index] }}
                      />
                      <span>
                        {label}: {stat.chartData[index]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}