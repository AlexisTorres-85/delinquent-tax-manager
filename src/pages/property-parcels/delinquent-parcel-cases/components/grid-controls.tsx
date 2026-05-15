import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectContent, SelectField, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VisibilityState } from '@tanstack/react-table';
import { PARCEL_COLUMN_LABELS, PAGE_SIZE_OPTIONS } from '@/data/parcels/types';
import { X } from 'lucide-react';
import type { LegalStatus } from '@/data/parcels/hooks/use-parcel-filters';
import { useMunicipalities } from '@/data/lookup/use-municipalities';

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
    onReset,
}: GridControlsProps) {
    const { municipalities } = useMunicipalities();
    const municipalityOptions = [
        { value: '', label: 'All municipalities' },
        ...municipalities.map((m) => ({ value: m.code, label: m.description })),
    ];
    return (
        <div className="space-y-3 h-full">
            <div className="pl-6 pr-6 gap-3 flex flex-col pt-4">
                <div className="relative">
                    <Input
                        label="Scope Search"
                        labelVariant='primary'
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
                <Combobox
                    label="Legal Status"
                    labelVariant="primary"
                    value={legalStatus}
                    onValueChange={(value) => onLegalStatusChange((value || 'all') as LegalStatus)}
                    placeholder="All statuses"
                    searchPlaceholder="Search status..."
                    options={LEGAL_STATUS_OPTIONS}
                />
                <Combobox
                    label="Municipality"
                    labelVariant="primary"
                    value={municipalityCode}
                    onValueChange={(value) => onMunicipalityCodeChange(value || '')}
                    placeholder="All municipalities"
                    searchPlaceholder="Search municipality..."
                    options={municipalityOptions}
                />

                <SelectField
                    label="Rows Per Page"
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


                <Card>
                    <CardHeader>
                        <CardTitle className="font-medium">Visible Columns</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {(Object.entries(PARCEL_COLUMN_LABELS) as [keyof VisibilityState, string][]).map(([key, label]) => (
                                <div key={String(key)} className="flex items-center gap-2">
                                    <Checkbox
                                        id={`col-${String(key)}`}
                                        checked={columnVisibility[key] !== false}
                                        onCheckedChange={(checked) =>
                                            onColumnVisibilityChange({ ...columnVisibility, [key]: checked === true })
                                        }
                                        variant="primary"
                                    />
                                    <Label htmlFor={`col-${String(key)}`} variant="primary">{label}</Label>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Button onClick={onReset} variant="secondary" className="w-full">Reset Panel</Button>
            </div>
        </div>
    );
}
