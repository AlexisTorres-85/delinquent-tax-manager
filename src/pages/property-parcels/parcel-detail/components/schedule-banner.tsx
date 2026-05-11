import { useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/skeleton';
import type { PaymentPlanSummary } from '@/data/payment-schedule/types';

// --- Helpers ------------------------------------------------------------------

function fmt(n: number) {
    return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function fmtDate(iso: string | null) {
    if (!iso) return '-';
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// --- BannerItem ---------------------------------------------------------------

interface BannerItemProps {
    label: string;
    value: React.ReactNode;
    isLoading?: boolean;
    skeletonWidth?: string;
}

function BannerItem({ label, value, isLoading, skeletonWidth = 'w-24' }: BannerItemProps) {
    return (
        <div className='flex flex-col gap-0.5 min-w-0'>
            <span className='text-[11px] uppercase tracking-wide font-medium text-muted-foreground whitespace-nowrap'>{label}</span>
            {isLoading
                ? <Skeleton className={`h-4 ${skeletonWidth} bg-muted-foreground/35`} />
                : <span className='text-sm font-semibold text-foreground'>{value}</span>
            }
        </div>
    );
}

interface ScheduleBannerProps {
    summary: PaymentPlanSummary;
    isLoading?: boolean;
    disabled?: boolean;
}

export function ScheduleBanner({ summary, isLoading, disabled }: ScheduleBannerProps) {
    const [open, setOpen] = useState(!disabled);

    return (
        <Collapsible
            open={disabled ? false : open}
            onOpenChange={disabled ? undefined : setOpen}
            className={`border-t border-divider bg-muted z-0 overflow-hidden transition-all duration-200 ${open && !disabled ? 'h-30' : 'h-9'}`}
        >
            <CollapsibleTrigger
                disabled={disabled}
                className='flex w-full items-center gap-2 px-6 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide hover:bg-muted/60 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'
            >
                <ChevronDown className='h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180' />
                <span>Payment Plan Summary</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className='flex flex-wrap items-center gap-x-6 gap-y-3 px-6 pb-6 pt-3'>
                    <BannerItem label='Start Date' value={fmtDate(summary.startDate)} isLoading={isLoading} />
                    <div className='h-8 w-px bg-divider shrink-0 hidden sm:block' />
                    <BannerItem label='Monthly Payment' value={fmt(summary.monthlyPayment)} isLoading={isLoading} />
                    <div className='h-8 w-px bg-divider shrink-0 hidden sm:block' />
                    <BannerItem
                        label='Missed Payments'
                        value={
                            <span className={summary.missedPayments > 0 ? 'text-destructive' : undefined}>
                                {summary.missedPayments}
                            </span>
                        }
                        isLoading={isLoading}
                        skeletonWidth='w-8'
                    />
                    <div className='h-8 w-px bg-divider shrink-0 hidden sm:block' />
                    <BannerItem label='Payoff Date' value={fmtDate(summary.payoffDate)} isLoading={isLoading} />
                    <div className='h-8 w-px bg-divider shrink-0 hidden sm:block' />
                    <BannerItem
                        label='Current Amount Due'
                        value={
                            <span className={summary.currentAmountDue > 0 ? 'text-destructive font-bold' : undefined}>
                                {fmt(summary.currentAmountDue)}
                            </span>
                        }
                        isLoading={isLoading}
                        skeletonWidth='w-20'
                    />
                    <div className='h-8 w-px bg-divider shrink-0 hidden sm:block' />
                    <BannerItem label='Total Payments' value={fmt(summary.totalPayments)} isLoading={isLoading} />
                    <div className='h-8 w-px bg-divider shrink-0 hidden sm:block' />
                    <BannerItem label='Last Payment Date' value={fmtDate(summary.lastPaymentDate)} isLoading={isLoading} />
                    <div className='h-8 w-px bg-divider shrink-0 hidden sm:block' />
                    <div className='flex flex-col gap-0.5'>
                        <span className='text-[11px] uppercase tracking-wide font-medium text-muted-foreground'>Previous Plans</span>
                        <a href='#' className='text-sm font-semibold text-primary flex items-center gap-1 hover:underline'>
                            View Previous Plans
                            <ExternalLink className='h-3 w-3' />
                        </a>
                    </div>
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}
