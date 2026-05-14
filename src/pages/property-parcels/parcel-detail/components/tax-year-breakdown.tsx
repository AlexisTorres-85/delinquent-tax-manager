import { CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PageSection } from '@/components/layout/page-section';
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from '@/components/ui/accordion';
import { useTaxYearBalances } from '@/data/tax-payments/hooks/use-tax-year-balances';
import type { TaxYearBalance } from '@/data/tax-payments/types';

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

function VDivider() {
  return <div className="self-stretch w-px shrink-0 bg-divider" />;
}

function YearItem({ balance }: { balance: TaxYearBalance }) {
    const {
        taxYear,
        isDelinquent,
        baseTax,
        interest,
        penalty,
        otherCharges,
        specialAssessments,
        totalDue,
        totalPaid,
        currentDue,
        lastPaymentAmount,
        lastPaymentDate,
    } = balance;

    const formattedLastPaidOn = lastPaymentDate
        ? new Date(lastPaymentDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—';

    return (
        <AccordionItem value={String(taxYear)} className="border border-divider">
            <AccordionTrigger className="text-sm pt-2 pb-2">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="font-semibold text-sm shrink-0">Tax Year {taxYear}</span>
                    {currentDue > 0 ? (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 shrink-0 text-[11px] px-1.5 py-0">
                            Delinquent
                        </Badge>
                    ) : (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shrink-0 text-[11px] px-1.5 py-0">
                            Paid
                        </Badge>
                    )}
                    <div className="flex items-center gap-4 ml-auto mr-2 shrink-0">
                        {currentDue > 0 && (
                            <span className="text-sm font-medium text-destructive">
                                Due: <span className="font-semibold">${fmt(currentDue)}</span>
                            </span>
                        )}
                        <span className="text-sm text-muted-foreground">
                            Paid: <span className="font-medium text-foreground">${fmt(totalPaid)}</span>
                        </span>
                    </div>
                </div>
            </AccordionTrigger>

            <AccordionContent>
                <div className="flex flex-col gap-2 py-3 w-full">
                    <div className="grid grid-cols-5 gap-y-3">
                        <DetailItem label="Base Tax" value={`$${fmt(baseTax)}`} />
                        <DetailItem label="Interest" value={`$${fmt(interest)}`} />
                        <DetailItem label="Penalty" value={`$${fmt(penalty)}`} />
                        <DetailItem label="Other Charges" value={`$${fmt(otherCharges)}`} />
                        <DetailItem label="Special Assessments" value={`$${fmt(specialAssessments)}`} />
                    </div>
                    <div className="border-t border-divider" />
                    <div className="grid grid-cols-5 gap-y-3">
                        <DetailItem label="Total Due" value={`$${fmt(totalDue)}`} bold />
                        <DetailItem label="Total Paid" value={`$${fmt(totalPaid)}`} bold />
                        <DetailItem
                            label="Current Due"
                            value={
                                <span className={currentDue > 0 ? 'text-destructive' : ''}>
                                    ${fmt(currentDue)}
                                </span>
                            }
                            bold
                        />
                        <DetailItem
                            label="Last Payment"
                            value={lastPaymentAmount != null ? `$${fmt(lastPaymentAmount)}` : '—'}
                        />
                        <DetailItem label="Last Paid On" value={formattedLastPaidOn} />
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}

export function TaxYearBreakdown({ parcelNumber, className }: { parcelNumber: string; className?: string }) {
    const { balances, isLoading } = useTaxYearBalances(parcelNumber);

    return (
        <PageSection
            icon={<CalendarDays className="size-5 text-muted-foreground" />}
            title="Delinquent Tax Years Breakdown"
            className={className}
            subtitle="delinquent tax years balance summary"
            helperContent={
                <div className="px-4 py-3 text-sm">
                    <p className="font-semibold">About Delinquent Tax Years Breakdown</p>
                    <p className="mt-1">
                        The tax years shown here are the years associated with this specific DTM case.
                        Each year reflects the balance, payments, and delinquency status pulled directly
                        from Catalis tax records for this parcel.
                    </p>
                    <p className="mt-2">
                        Use the <strong>Case Tax Years</strong> listed in the page header to quickly identify
                        which years are actively being managed under the current workflow.
                    </p>
                </div>
            }
        >
            {isLoading ? (
                <div className="space-y-2">
                    {[0, 1, 2].map((i) => (
                        <Skeleton key={i} className="h-11 w-full rounded-lg" />
                    ))}
                </div>
            ) : balances.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No tax year records found.</p>
            ) : (
                <Accordion type="single" collapsible variant="outline" defaultValue={String(balances[0].taxYear)}>
                    {balances.map((balance) => (
                        <YearItem key={balance.id} balance={balance} />
                    ))}
                </Accordion>
            )}
        </PageSection>
    );
}
