import { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { PieChart } from 'lucide-react';
import { PageSection } from '@/components/layout/page-section';
import { Slider, SliderThumb } from '@/components/ui/slider';

interface DelinquencyRangeSummaryProps {
    from: number;
    to: number;
    inRange?: number;
    outsideRange?: number;
    noDelinquency?: number;
    availableDelinquentYears: number[];
    delinquentYearRange: [number, number] | null;
    onDelinquentYearRangeChange: (value: [number, number] | null) => void;
}

function calcTicks(min: number, max: number): number[] {
    if (max <= min) return [min];

    const range = max - min;
    const interval = range <= 6 ? 1 : range <= 12 ? 2 : 5;

    const ticks: number[] = [];
    const first = Math.ceil(min / interval) * interval;

    for (let t = first; t <= max; t += interval) {
        ticks.push(t);
    }

    if (ticks[0] !== min) ticks.unshift(min);
    if (ticks[ticks.length - 1] !== max) ticks.push(max);

    return ticks;
}

export function DelinquencyScopeBreakdown({
    from,
    to,
    inRange = 0,
    outsideRange = 0,
    noDelinquency = 0,
    availableDelinquentYears,
    delinquentYearRange,
    onDelinquentYearRangeChange,
}: DelinquencyRangeSummaryProps) {
    const sortedYears = useMemo(
        () => Array.from(new Set(availableDelinquentYears)).sort((a, b) => a - b),
        [availableDelinquentYears]
    );

    const hasRange = sortedYears.length >= 2;

    const sliderMin = hasRange ? sortedYears[0] : from;
    const sliderMax = hasRange ? sortedYears[sortedYears.length - 1] : to;

    const sliderLo = delinquentYearRange?.[0] ?? sliderMin;
    const sliderHi = delinquentYearRange?.[1] ?? sliderMax;

    const ticks = useMemo(
        () => (hasRange ? calcTicks(sliderMin, sliderMax) : []),
        [hasRange, sliderMin, sliderMax]
    );

    function commitRange(lo: number, hi: number) {
        if (lo === sliderMin && hi === sliderMax) {
            onDelinquentYearRangeChange(null);
        } else {
            onDelinquentYearRangeChange([lo, hi]);
        }
    }

    const total = inRange + outsideRange + noDelinquency;
    const hasData = total > 0;

    const chartSeries = hasData ? [inRange, outsideRange, noDelinquency] : [1];

    const chartOptions = useMemo<ApexOptions>(
        () =>
            hasData
                ? {
                    chart: {
                        type: 'donut',
                        toolbar: { show: false },
                        sparkline: { enabled: true },
                    },
                    labels: ['In Selected Range', 'Outside Range', 'No Delinquency'],
                    colors: ['var(--chart-in-range)', 'var(--chart-outside-range)', 'var(--chart-no-delinquency)'],
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
                                    total: {
                                        show: false,
                                        label: '',
                                        offsetY: 51,
                                        fontSize: '13px',
                                        fontWeight: 700,
                                        color: '#64748b',
                                        formatter: () => String(total),
                                    },
                                },
                            },
                        },
                    },
                    tooltip: {
                        y: {
                            formatter: (value: number) =>
                                `${value} parcel${value === 1 ? '' : 's'}`,
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
                                    total: {
                                        show: false,
                                        label: '',
                                        offsetY: -8,
                                        fontSize: '13px',
                                        fontWeight: 700,
                                        color: '#94a3b8',
                                        formatter: () => '0',
                                    },
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
        [hasData, total]
    );

    return (
        <div className="px-6 py-4 flex flex-col">
            <PageSection
                icon={<PieChart className="size-4 text-muted-foreground" />}
                title="Delinquency Scope Breakdown"
                subtitle="Summary of parcels based on the selected delinquent year range."
                className="flex-1"
                action={
                    <div className="rounded-md border border-border bg-white px-2 py-1 text-[11px] font-medium text-muted-foreground">
                        {sliderLo} – {sliderHi}
                    </div>
                }
            >
                {/* Slider — full width */}
                {hasRange && (
                    <div className="relative mt-10 mb-5">
                        <Slider
                            gradientColor="var(--slider-gradient)"
                            thumbColor="var(--slider-thumb-color)"
                            min={sliderMin}
                            max={sliderMax}
                            step={1}
                            value={[sliderLo, sliderHi]}
                            onValueChange={([lo, hi]) => commitRange(lo, hi)}
                            showMarks
                            marks={ticks}
                            valueLabelFormatter={(value) => String(value)}
                        >
                            <SliderThumb index={0} />
                            <SliderThumb index={1} />
                        </Slider>
                    </div>
                )}

                {/* Donut left · Stats right */}
                <div className="flex items-start gap-4 mt-4">
                    <div className="shrink-0 w-[150px]">
                        <div className="relative shrink-0 h-[150px] w-[150px]">
                            <ReactApexChart
                                type="donut"
                                height={150}
                                width={150}
                                series={chartSeries}
                                options={chartOptions}
                            />

                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <span className="text-[20px] font-bold leading-none text-slate-500">
                                    {total}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 space-y-0">
                        <div className="flex items-center justify-between gap-3 py-1.5 border-b border-divider">
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: 'var(--chart-in-range)' }} />
                                <span className="text-xs font-medium text-foreground">In Selected Range</span>
                            </div>
                            <span className="text-xs font-semibold tabular-nums text-foreground">{inRange}</span>
                        </div>

                        <div className="flex items-center justify-between gap-3 py-1.5 border-b border-divider">
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: 'var(--chart-outside-range)' }} />
                                <span className="text-xs font-medium text-foreground">Outside Range</span>
                            </div>
                            <span className="text-xs font-semibold tabular-nums text-foreground">{outsideRange}</span>
                        </div>

                        <div className="flex items-center justify-between gap-3 py-1.5 border-b border-divider">
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: 'var(--chart-no-delinquency)' }} />
                                <span className="text-xs font-medium text-foreground">No Delinquency</span>
                            </div>
                            <span className="text-xs font-semibold tabular-nums text-foreground">{noDelinquency}</span>
                        </div>

                        <p className="pt-2 text-[11px] leading-relaxed text-muted-foreground">
                            <span className="font-semibold" style={{ color: 'var(--chart-in-range)' }}>In Selected Range</span> counts parcels
                            with at least one delinquent tax year falling within the slider bounds.{' '}
                            <span className="font-semibold" style={{ color: 'var(--chart-outside-range)' }}>Outside Range</span> are delinquent
                            parcels whose tax years fall entirely outside the selected window.{' '}
                            <span className="font-semibold" style={{ color: 'var(--chart-no-delinquency)' }}>No Delinquency</span> reflects parcels
                            with no delinquent tax years at all. Adjust the slider to narrow or widen the
                            scope and watch the counts update in real time.
                        </p>
                    </div>
                </div>
            </PageSection>
        </div>
    );
}