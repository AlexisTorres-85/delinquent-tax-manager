import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectContent, SelectField, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { VisibilityState } from '@tanstack/react-table';
import { PARCEL_COLUMN_LABELS, PAGE_SIZE_OPTIONS } from '@/data/parcels/types';
import { Columns3, Info, RotateCcw, X } from 'lucide-react';
import type { LegalStatus, PaymentPlanFilter } from '@/data/parcels/hooks/use-parcel-filters';
import { useMunicipalities } from '@/data/lookup/use-municipalities';
import { DelinquencyRangeSummary } from './delinquency-range-summary';
import { DelinquencyInsights } from './delinquency-insights';
import { PaymentPlanFilterDropdown } from './payment-plan-filter';

const LEGAL_STATUS_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'isDelinquent', label: 'In Delinquency' },
    { value: 'isInRem', label: 'In Rem (In Foreclosure)' },
    { value: 'isBankruptcy', label: 'In Bankruptcy' },
    { value: 'isDeeded', label: 'Tax Deeded' },
];

interface GridControlsProps {
    search: string;
    onSearchChange: (value: string) => void;
    legalStatus: LegalStatus;
    onLegalStatusChange: (value: LegalStatus) => void;
    municipalityCode: string;
    onMunicipalityCodeChange: (value: string) => void;
    pageSize: number;
    onPageSizeChange: (value: number) => void;
    columnVisibility: VisibilityState;
    onColumnVisibilityChange: (value: VisibilityState) => void;
    paymentPlanFilter: PaymentPlanFilter;
    onPaymentPlanFilterChange: (value: PaymentPlanFilter) => void;
    availableDelinquentYears: number[];
    delinquentYearRange: [number, number] | null;
    onDelinquentYearRangeChange: (value: [number, number] | null) => void;
    chartInRange: number;
    chartOutsideRange: number;
    chartNoDelinquency: number;
    municipalityBreakdown: { label: string; count: number }[];
    inPaymentPlanCount: number;
    pageParcelsCount: number;
    onReset: () => void;
}

export function GridControls({
    search,
    onSearchChange,
    legalStatus,
    onLegalStatusChange,
    municipalityCode,
    onMunicipalityCodeChange,
    pageSize,
    onPageSizeChange,
    columnVisibility,
    onColumnVisibilityChange,
    paymentPlanFilter,
    onPaymentPlanFilterChange,
    availableDelinquentYears,
    delinquentYearRange,
    onDelinquentYearRangeChange,
    chartInRange,
    chartOutsideRange,
    chartNoDelinquency,
    municipalityBreakdown,
    inPaymentPlanCount,
    pageParcelsCount,
    onReset,
}: GridControlsProps) {
    const { municipalities } = useMunicipalities();
    const municipalityOptions = [
        { value: '', label: 'All municipalities' },
        ...municipalities.map((m) => ({ value: m.code, label: m.description })),
    ];

    return (
        <div className="flex flex-col gap-0 border-b border-divider bg-muted">
            {/* ── Row 1: main filter controls ── */}
            <div className="flex flex-wrap items-end gap-3 px-6 pt-4 pb-6">
                {/* Search */}
                <div className="relative min-w-[220px] flex-1">
                    <Input
                        label="Search"
                        labelVariant="primary"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Owner, address, or parcel #"
                        className={search ? 'pr-8' : ''}
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => onSearchChange('')}
                            className="absolute right-2 bottom-0 h-8 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                {/* Payment Plan Filter */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                        <Label variant="primary">Payment Plan</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button
                                    type="button"
                                    className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label="About Payment Plan filter"
                                >
                                    <Info className="size-3.5" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-96 p-0" side="right" align="start">
                                <div className="p-4 space-y-3">
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">
                                            Payment Plan Filter
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                                            Use this filter to find parcels based on whether they have a delinquent
                                            payment plan and whether that plan applies to the parcel’s delinquent tax years.
                                        </p>
                                    </div>

                                    <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 leading-relaxed">
                                        Payment plan status is separate from legal status. A parcel can be in a payment
                                        plan and still have other legal or workflow flags.
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <PaymentPlanFilterDropdown
                        value={paymentPlanFilter}
                        onChange={onPaymentPlanFilterChange}
                    />
                </div>

                {/* Legal Status */}
                <div className="w-48">
                    <Combobox
                        label="Legal Status"
                        labelVariant="primary"
                        value={legalStatus}
                        onValueChange={(value) => onLegalStatusChange((value || 'all') as LegalStatus)}
                        placeholder="All statuses"
                        searchPlaceholder="Search status..."
                        options={LEGAL_STATUS_OPTIONS}
                    />
                </div>

                {/* Municipality */}
                <div className="w-52">
                    <Combobox
                        label="Municipality"
                        labelVariant="primary"
                        value={municipalityCode}
                        onValueChange={(value) => onMunicipalityCodeChange(value || '')}
                        placeholder="All municipalities"
                        searchPlaceholder="Search municipality..."
                        options={municipalityOptions}
                    />
                </div>

                {/* Rows per page */}
                <div className="w-32">
                    <SelectField
                        label="Rows"
                        labelVariant="primary"
                        value={String(pageSize)}
                        onValueChange={(value) => onPageSizeChange(Number(value))}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {PAGE_SIZE_OPTIONS.map((o) => (
                                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </SelectField>
                </div>

                {/* Visible Columns popover */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-sm leading-none invisible select-none">&nbsp;</span>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-1.5">
                                <Columns3 className="h-3.5 w-3.5" />
                                Columns
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-56 p-3">
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                                Visible Columns
                            </p>
                            <div className="flex flex-col gap-2">
                                {(Object.entries(PARCEL_COLUMN_LABELS) as [keyof VisibilityState, string][]).map(([key, colLabel]) => (
                                    <div key={String(key)} className="flex items-center gap-2">
                                        <Checkbox
                                            id={`col-${String(key)}`}
                                            checked={columnVisibility[key] !== false}
                                            onCheckedChange={(checked) =>
                                                onColumnVisibilityChange({ ...columnVisibility, [key]: checked === true })
                                            }
                                            variant="primary"
                                        />
                                        <Label htmlFor={`col-${String(key)}`} variant="primary">{colLabel}</Label>
                                    </div>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Reset */}
                <div className="flex flex-col gap-1.5 ml-auto">
                    <span className="text-sm leading-none invisible select-none">&nbsp;</span>
                    <Button onClick={onReset} variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reset
                    </Button>
                </div>
            </div>

            <div
  className="grid grid-cols-[40%_60%] "
>
                <DelinquencyRangeSummary
                    from={delinquentYearRange?.[0] ?? (availableDelinquentYears.length ? Math.min(...availableDelinquentYears) : 0)}
                    to={delinquentYearRange?.[1] ?? (availableDelinquentYears.length ? Math.max(...availableDelinquentYears) : 0)}
                    inRange={chartInRange}
                    outsideRange={chartOutsideRange}
                    noDelinquency={chartNoDelinquency}
                    availableDelinquentYears={availableDelinquentYears}
                    delinquentYearRange={delinquentYearRange}
                    onDelinquentYearRangeChange={onDelinquentYearRangeChange}
                />
                <DelinquencyInsights
                    municipalityBreakdown={municipalityBreakdown}
                    inPaymentPlanCount={inPaymentPlanCount}
                    pageParcelsCount={pageParcelsCount}
                    selectedMunicipalityCode={municipalityCode}
                />
            </div>
        </div>
    );
}
