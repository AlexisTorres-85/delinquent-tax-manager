import { useEffect, useMemo, useState } from 'react';
import { Slider as SliderPrimitive } from 'radix-ui';
import { Calendar, Info } from 'lucide-react';

interface DelinquentYearRangeProps {
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

export function DelinquentYearRange({
    availableDelinquentYears,
    delinquentYearRange,
    onDelinquentYearRangeChange,
}: DelinquentYearRangeProps) {
    const sortedYears = useMemo(
        () => Array.from(new Set(availableDelinquentYears)).sort((a, b) => a - b),
        [availableDelinquentYears]
    );

    const hasRange = sortedYears.length >= 2;

    const sliderMin = hasRange ? sortedYears[0] : 0;
    const sliderMax = hasRange ? sortedYears[sortedYears.length - 1] : 0;

    const sliderLo = delinquentYearRange?.[0] ?? sliderMin;
    const sliderHi = delinquentYearRange?.[1] ?? sliderMax;

    const [fromStr, setFromStr] = useState(String(sliderLo));
    const [toStr, setToStr] = useState(String(sliderHi));

    useEffect(() => {
        setFromStr(String(sliderLo));
    }, [sliderLo]);

    useEffect(() => {
        setToStr(String(sliderHi));
    }, [sliderHi]);

    const ticks = useMemo(() => (hasRange ? calcTicks(sliderMin, sliderMax) : []), [hasRange, sliderMin, sliderMax]);

    if (!hasRange) return null;

    const pct = (year: number) => {
        if (sliderMax === sliderMin) return 0;
        return ((year - sliderMin) / (sliderMax - sliderMin)) * 100;
    };

    function commitRange(lo: number, hi: number) {
        if (lo === sliderMin && hi === sliderMax) {
            onDelinquentYearRangeChange(null);
        } else {
            onDelinquentYearRangeChange([lo, hi]);
        }
    }

    function applyFrom(raw: string) {
        const n = parseInt(raw, 10);

        if (Number.isNaN(n)) {
            setFromStr(String(sliderLo));
            return;
        }

        const clamped = Math.max(sliderMin, Math.min(n, sliderHi));
        commitRange(clamped, sliderHi);
    }

    function applyTo(raw: string) {
        const n = parseInt(raw, 10);

        if (Number.isNaN(n)) {
            setToStr(String(sliderHi));
            return;
        }

        const clamped = Math.max(sliderLo, Math.min(n, sliderMax));
        commitRange(sliderLo, clamped);
    }

    return (
        <div className="px-6 pb-5 pt-3 border-t border-divider">
            {/* Title outside card */}
            <div className="flex items-center gap-1.5 mb-2">
                <span className="text-xs font-semibold text-foreground">
                    Delinquent Year Range
                </span>
                <Info className="h-3.5 w-3.5 text-muted-foreground/70" />
            </div>

            {/* Slider Card */}
            <div className="rounded-lg border border-border bg-background shadow-sm">
                <div className="grid grid-cols-[150px_1fr]">
                    {/* Left side: From / To inputs */}
                    <div className="px-4 py-4">
                        <div className="flex flex-col gap-4">
                            <div className="space-y-1.5">
                                <span className="block text-xs font-medium text-muted-foreground">
                                    From Year
                                </span>

                                <div className="flex h-8 w-full items-center gap-1.5 rounded-md border border-input bg-background px-2.5">
                                    <input
                                        type="number"
                                        value={fromStr}
                                        min={sliderMin}
                                        max={sliderHi}
                                        onChange={(e) => setFromStr(e.target.value)}
                                        onBlur={(e) => applyFrom(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                applyFrom((e.target as HTMLInputElement).value);
                                            }
                                        }}
                                        className="w-full bg-transparent text-sm text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    />

                                    <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <span className="block text-xs font-medium text-muted-foreground">
                                    To Year
                                </span>

                                <div className="flex h-8 w-full items-center gap-1.5 rounded-md border border-input bg-background px-2.5">
                                    <input
                                        type="number"
                                        value={toStr}
                                        min={sliderLo}
                                        max={sliderMax}
                                        onChange={(e) => setToStr(e.target.value)}
                                        onBlur={(e) => applyTo(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                applyTo((e.target as HTMLInputElement).value);
                                            }
                                        }}
                                        className="w-full bg-transparent text-sm text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    />

                                    <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side: Slider */}
                    <div className="border-l border-divider px-5 py-5">
                        <div className="relative">
                            {/* Value tooltips above each thumb */}
                            <div className="relative h-10 pointer-events-none select-none">
                                {[
                                    { year: sliderLo, key: 'lo' },
                                    ...(sliderHi !== sliderLo ? [{ year: sliderHi, key: 'hi' }] : []),
                                ].map(({ year, key }) => (
                                    <div
                                        key={key}
                                        className="absolute bottom-0 flex flex-col items-center"
                                        style={{ left: `${pct(year)}%`, transform: 'translateX(-50%)' }}
                                    >
                                        <div className="rounded border border-border bg-white px-2 py-0.5 text-[11px] font-semibold text-foreground shadow-sm whitespace-nowrap">
                                            {year}
                                        </div>
                                        {/* Caret */}
                                        <div className="relative flex flex-col items-center">
                                            <div className="w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-t-border" />
                                            <div className="absolute top-0 w-0 h-0 border-x-[4px] border-x-transparent border-t-[4px] border-t-white" />
                                        </div>
                                        <div className="w-px h-1 bg-border/60" />
                                    </div>
                                ))}
                            </div>

                            {/* Slider */}
                            <SliderPrimitive.Root
                                min={sliderMin}
                                max={sliderMax}
                                step={1}
                                value={[sliderLo, sliderHi]}
                                onValueChange={([lo, hi]) => commitRange(lo, hi)}
                                className="relative flex h-4 w-full touch-none select-none items-center"
                            >
                                <SliderPrimitive.Track className="relative h-3 w-full rounded-full overflow-hidden bg-slate-200">
                                    <SliderPrimitive.Range
                                        className="absolute h-full"
                                        style={{ background: 'linear-gradient(to right, #22d3ee, #22c55e)' }}
                                    />
                                </SliderPrimitive.Track>
                                <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full bg-green-500 shadow-md cursor-pointer outline-none focus:outline-none border-0" />
                                <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full bg-green-500 shadow-md cursor-pointer outline-none focus:outline-none border-0" />
                            </SliderPrimitive.Root>

                            {/* Tick marks and labels below */}
                            <div className="relative mt-2.5 h-7 select-none">
                                {ticks.map((year, index) => {
                                    const isFirst = index === 0;
                                    const isLast = index === ticks.length - 1;
                                    const labelTransform = isFirst
                                        ? 'translateX(0)'
                                        : isLast
                                          ? 'translateX(-100%)'
                                          : 'translateX(-50%)';
                                    return (
                                        <div
                                            key={year}
                                            className="absolute top-0"
                                            style={{ left: `${pct(year)}%` }}
                                        >
                                            <span
                                                className="block w-px h-2 bg-border"
                                                style={{ transform: 'translateX(-50%)' }}
                                            />
                                            <span
                                                className="absolute top-2.5 whitespace-nowrap text-[11px] leading-none text-muted-foreground"
                                                style={{ transform: labelTransform }}
                                            >
                                                {year}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}