import { CreditCard, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PageSection } from '@/components/layout/page-section';
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from '@/components/ui/accordion';
import type { PaymentPlanInfo } from '@/data/parcels/types';

function fmt(value: number) {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function DetailItem({ label, value, bold }: { label: string; value: React.ReactNode; bold?: boolean }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium leading-tight">
                {label}
            </span>
            <span className={`text-sm leading-tight ${bold ? 'font-semibold' : 'font-medium'}`}>{value}</span>
        </div>
    );
}

function fmtIsoDate(iso: string): string {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtYMDDate(s: string): string {
    if (/^\d{8}$/.test(s)) {
        const iso = `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
        return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return fmtIsoDate(s);
}

interface PaymentPlanSectionProps {
    paymentPlan: PaymentPlanInfo;
}

export function PaymentPlanSection({ paymentPlan }: PaymentPlanSectionProps) {
    return (
        <PageSection
            icon={<CreditCard className="size-5 text-muted-foreground" />}
            title="Active Payment Plan"
            subtitle="current installment agreement details"
        >
            <Accordion type="single" collapsible variant="outline" defaultValue="plan">
                <AccordionItem value="plan" className="border border-divider/50 bg-muted">
                    <AccordionTrigger className="text-sm pt-2 pb-2">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                            <span className="font-semibold text-sm shrink-0">{paymentPlan.paymentPlanDescription}</span>
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shrink-0 text-[11px] px-1.5 py-0">
                                Active
                            </Badge>
                            <div className="flex items-center gap-4 ml-auto mr-2 shrink-0">
                                <span className="text-sm text-muted-foreground">
                                    Monthly: <span className="font-semibold text-foreground">${fmt(paymentPlan.monthlyAmount)}</span>
                                </span>
                                {paymentPlan.totalDue > 0 && (
                                    <span className="text-sm font-medium text-destructive">
                                        Due: <span className="font-semibold">${fmt(paymentPlan.totalDue)}</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-2 py-3 w-full">
                            <div className="grid grid-cols-5 gap-y-3">
                                <DetailItem label="Tax Years Covered" value={paymentPlan.taxYearsCovered} />
                                <DetailItem label="Monthly Amount" value={`$${fmt(paymentPlan.monthlyAmount)}`} />
                                <DetailItem label="Payments Made" value={String(paymentPlan.numberOfPaymentsMade)} />
                                <DetailItem label="Plan Start Date" value={fmtIsoDate(paymentPlan.planStartDate)} />
                                <DetailItem label="Expected Payoff Date" value={fmtIsoDate(paymentPlan.expectedPayoffDate)} />
                            </div>
                            <div className="border-t border-divider" />
                            <div className="grid grid-cols-5 gap-y-3">
                                <DetailItem label="Expected Payoff Amount" value={`$${fmt(paymentPlan.expectedPayoffAmount)}`} bold />
                                <DetailItem label="Total Due" value={`$${fmt(paymentPlan.totalDue)}`} bold />
                                <DetailItem label="Current Due Total" value={
                                    <span className={paymentPlan.totalDue > 0 ? 'text-destructive' : ''}>
                                        ${fmt(paymentPlan.totalDue)}
                                    </span>
                                } bold />
                                <DetailItem label="Last Payment Date" value={fmtYMDDate(paymentPlan.lastPaymentDate)} />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </PageSection>
    );
}
