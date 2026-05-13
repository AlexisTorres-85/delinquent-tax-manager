import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectContent, SelectField, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider, SliderThumb } from '@/components/ui/slider';
import { VisibilityState } from '@tanstack/react-table';
import { PARCEL_COLUMN_LABELS, PARCEL_STATUS_OPTIONS, PAGE_SIZE_OPTIONS, type ParcelStatus } from '@/data/parcels/types';

type StatusFilter = ParcelStatus | 'all';

interface GridControlsProps {
    search: string;
    onSearchChange: (value: string) => void;
    statusFilter: StatusFilter;
    onStatusFilterChange: (value: StatusFilter) => void;
    minAmountDue: number;
    onMinAmountDueChange: (value: number) => void;
    onlyNoPayment: boolean;
    onOnlyNoPaymentChange: (value: boolean) => void;
    pageSize: number;
    onPageSizeChange: (value: number) => void;
    columnVisibility: VisibilityState;
    onColumnVisibilityChange: (value: VisibilityState) => void;
    onReset: () => void;
}

export function GridControls({
    search,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    minAmountDue,
    onMinAmountDueChange,
    onlyNoPayment,
    onOnlyNoPaymentChange,
    pageSize,
    onPageSizeChange,
    columnVisibility,
    onColumnVisibilityChange,
    onReset,
}: GridControlsProps) {
    return (
        <div className="space-y-3 h-full">
            <div className="pl-6 pr-6 gap-3 flex flex-col pt-4">
                <Input
                    label="Scope Search"
                    labelVariant='primary'
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Owner, address, or parcel #"
                />
                <Combobox
                    label="Status"
                    labelVariant="primary"
                    value={statusFilter}
                    onValueChange={(value) => onStatusFilterChange((value || 'all') as StatusFilter)}
                    placeholder="All statuses"
                    searchPlaceholder="Search status..."
                    options={PARCEL_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
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

                <div className="space-y-2 ">
                    <Label variant="primary">Minimum Amount Due: ${minAmountDue.toLocaleString()}</Label>
                    <Slider className='pt-6 pb-3'
                        value={[minAmountDue]}
                        min={0}
                        max={50000}
                        step={500}
                        onValueChange={(value) => onMinAmountDueChange(value[0] ?? 0)}
                    >
                        <SliderThumb />
                    </Slider>
                </div>


                <div className="pt-1">
                    <Card>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={onlyNoPayment}
                                    onCheckedChange={(checked) => onOnlyNoPaymentChange(checked === true)}
                                    id="no-payment"
                                    variant="primary"
                                />
                                <Label htmlFor="no-payment" variant="primary">Only records with no payment</Label>
                            </div>

                        </CardContent>
                    </Card>
                </div>

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
