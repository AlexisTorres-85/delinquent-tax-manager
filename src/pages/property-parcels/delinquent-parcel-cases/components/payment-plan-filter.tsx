import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
    AlertTriangle,
    CalendarDays,
    Check,
    CheckCircle2,
    ChevronDown,
    Clock,
    LayoutList,
    Shield,
    ShieldCheck,
    XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PaymentPlanFilter } from '@/data/parcels/hooks/use-parcel-filters';

interface Option {
    value: PaymentPlanFilter;
    label: string;
    description: string;
    icon: React.ReactNode;
    iconColor?: string;
}

const OPTIONS: Option[] = [
    {
        value: 'all',
        label: 'All Parcels',
        description: 'Show all parcels regardless of plan',
        icon: <LayoutList className="h-5 w-5" />,
    },
    {
        value: 'inPlan',
        label: 'In Payment Plan',
        description: 'Parcels that have any payment plan',
        icon: <CalendarDays className="h-5 w-5" />,
    },
    {
        value: 'notInPlan',
        label: 'Not in Payment Plan',
        description: 'Parcels with no payment plan',
        icon: <XCircle className="h-5 w-5" />,
    },
    {
        value: 'activePlan',
        label: 'Active Payment Plan',
        description: 'Currently active payment plans',
        icon: <CheckCircle2 className="h-5 w-5" />,
        iconColor: 'text-green-600',
    },
    {
        value: 'brokenPlan',
        label: 'Broken / Missed Payment Plan',
        description: 'Plans with missed or broken terms',
        icon: <AlertTriangle className="h-5 w-5" />,
        iconColor: 'text-amber-500',
    },
    {
        value: 'coversCaseTaxYears',
        label: 'Plan Covers Case Tax Years',
        description: 'Plan covers all delinquent years',
        icon: <ShieldCheck className="h-5 w-5" />,
    },
    {
        value: 'partiallyCoversCaseTaxYears',
        label: 'Plan Partially Covers Case Years',
        description: 'Plan covers some delinquent years',
        icon: <Shield className="h-5 w-5" />,
    },
    {
        value: 'historicalOnly',
        label: 'Historical Payment Plan Only',
        description: 'Plan exists but is fully paid/closed',
        icon: <Clock className="h-5 w-5" />,
    },
];

interface PaymentPlanFilterDropdownProps {
    value: PaymentPlanFilter;
    onChange: (value: PaymentPlanFilter) => void;
}

export function PaymentPlanFilterDropdown({
    value,
    onChange,
}: PaymentPlanFilterDropdownProps) {
    const [open, setOpen] = useState(false);
    const selected = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="h-8 min-w-[180px] justify-between gap-1.5 font-normal px-3"
                >
                    <div className="truncate">{selected.label}</div>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                className="w-[380px] p-2"
            >
                <div className="flex flex-col gap-0.5">
                    {OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                            className={cn(
                                'flex w-full items-center gap-3 rounded-md px-2.5 py-2.5 text-left transition-colors',
                                'hover:bg-accent',
                                opt.value === value && 'bg-accent/60'
                            )}
                        >
                            {/* Selected checkmark column */}
                            <span className="flex h-3 w-4 shrink-0 items-center justify-center text-primary">
                                {opt.value === value && <Check className="h-4 w-4" />}
                            </span>

                            {/* Icon column */}
                            <span
                                className={cn(
                                    'flex h-3 w-6 shrink-0 items-center justify-center text-muted-foreground',
                                    opt.iconColor
                                )}
                            >
                                {opt.icon}
                            </span>

                            {/* Label + description */}
                            <span className="flex min-w-0 flex-col">
                                <span className="text-xs font-medium leading-snug text-foreground">
                                    {opt.label}
                                </span>
                                <span className="text-xs leading-snug text-muted-foreground">
                                    {opt.description}
                                </span>
                            </span>
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}