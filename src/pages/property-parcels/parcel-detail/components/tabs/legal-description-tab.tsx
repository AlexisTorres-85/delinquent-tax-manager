import { FileText, History, Map, ScrollText, BookOpen, CheckCircle, MapPin, Info, ExternalLink, Scale, MapIcon, FileSearch, LandmarkIcon, GitCompare, Printer, FileDown, Copy, StickyNote, MessageSquare, RefreshCw, AlertTriangle, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TabLayout } from '@/components/ui/tab-layout';
import { useLegalReview } from '@/data/legal-review/hooks/use-legal-review';
import { ChangeLegalDescriptionDialog } from '../dialogs/change-legal-description-dialog';
import type { Parcel } from '@/data/parcels/types';

// ─── Field display helpers ────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <span className="text-sm font-semibold text-foreground">
            {children}
        </span>
    );
}

function FieldValue({ value, mono = false }: { value?: string; mono?: boolean }) {
    if (!value) return <span className="text-sm text-muted-foreground italic">—</span>;
    return (
        <span className={`text-sm text-foreground leading-relaxed whitespace-pre-wrap ${mono ? 'font-mono' : ''}`}>
            {value}
        </span>
    );
}

function Field({ label, value, mono = false }: { label: string; value?: string; mono?: boolean }) {
    return (
        <div className="flex flex-col gap-1">
            <FieldLabel>{label}</FieldLabel>
            <FieldValue value={value} mono={mono} />
        </div>
    );
}


// ─── Tab component ────────────────────────────────────────────────────────────

interface LegalDescriptionTabProps {
    parcel: Parcel | null;
    parcelNumber: string;
    isLoading: boolean;
    stickyTop?: number;
}

export function LegalDescriptionTab({ parcel, parcelNumber, isLoading, stickyTop = 0 }: LegalDescriptionTabProps) {
    const { reviews, isLoading: isReviewLoading } = useLegalReview(parcelNumber);
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    // Show the most recent non-approved review, or the latest overall
    const activeReview = reviews.find((r) => r.reviewStatus !== 'Approved') ?? null;
    // Most recent approved review (only relevant when no active review)
    const lastApprovedReview = !activeReview ? (reviews.find((r) => r.reviewStatus === 'Approved') ?? null) : null;
    const headerActions = !isLoading ? (
        <>
            {activeReview ? (
                <div className="flex items-center gap-6 min-w-60">
                    <div className="flex-1 flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium leading-none pb-1">Review In Progress</span>
                        <div className="h-2 w-full rounded-full bg-primary/20 overflow-hidden">
                            <div className="h-full rounded-full bg-app-primary animate-[progress-indeterminate_1.5s_ease-in-out_infinite]" style={{ width: '40%' }} />
                        </div>
                    </div>
                    <div className="h-5 w-px bg-divider shrink-0 mr-4" />
                </div>
            ) : (
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setReviewDialogOpen(true)}>
                    <Scale className="h-3.5 w-3.5" />
                    Review Legal
                </Button>
            )}
            <Button size="sm" variant="outline" className="gap-1.5">
                <MapIcon className="h-3.5 w-3.5" />
                Open GIS Map
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="gap-1.5">
                        More
                        <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuItem className="gap-2">
                        <FileSearch className="h-3.5 w-3.5 text-muted-foreground" />
                        View Parcel Documents
                    </DropdownMenuItem>

                    <DropdownMenuItem className="gap-2">
                        <History className="h-3.5 w-3.5 text-muted-foreground" />
                        View Revision History
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="gap-2">
                        <FileDown className="h-3.5 w-3.5 text-muted-foreground" />
                        Export to PDF
                    </DropdownMenuItem>

                    <DropdownMenuItem className="gap-2">
                        <StickyNote className="h-3.5 w-3.5 text-muted-foreground" />
                        Add Note
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="gap-2">
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        Copy Current Legal
                    </DropdownMenuItem>

                    <DropdownMenuItem className="gap-2">
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        Copy Research Legal
                    </DropdownMenuItem>

                    <DropdownMenuItem className="gap-2">
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        Copy Approved Legal
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    ) : undefined;

    const reviewLoading = isLoading || isReviewLoading;

    const reviewBanner = !reviewLoading ? (
        <div className="flex items-center gap-6 px-6 py-3 border-b h-20 border-divider bg-muted text-sm">
            {activeReview ? (
                <>
                <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Review Status</span>
                        {activeReview
                            ? <span className="text-sm w-fit text-emerald-500 font-semibold">{activeReview.reviewStatus}</span>
                            : <span className="text-sm w-fit font-semibold">Current</span>}
                    </div>
                    <div className="w-px self-stretch bg-divider shrink-0" />
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Assigned To</span>
                        <span className="text-sm font-semibold text-foreground">{activeReview.assignedTo}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Requested By</span>
                        <span className="text-sm font-semibold text-foreground">{activeReview.requestedBy}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Requested On</span>
                        <span className="text-sm font-semibold text-foreground">{activeReview.requestedDate}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Review Type</span>
                        <span className="text-sm font-semibold text-foreground">{activeReview.reviewType}</span>
                    </div>
                    {activeReview.completedDate && (
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Completed</span>
                            <span className="text-sm font-semibold text-foreground">{activeReview.completedDate}</span>
                        </div>
                    )}
                    <div className="w-px self-stretch bg-divider shrink-0" />
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Priority</span>
                        <span className="text-sm w-fit font-semibold text-yellow-500">{activeReview.priority}</span>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Last Reviewed</span>
                        <span className="text-sm font-semibold text-foreground">{lastApprovedReview?.completedDate ?? '—'}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Reviewed By</span>
                        <span className="text-sm font-semibold text-foreground">{lastApprovedReview?.assignedTo ?? '—'}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Review Type</span>
                        <span className="text-sm font-semibold text-foreground">{lastApprovedReview?.reviewType ?? '—'}</span>
                    </div>
                </>
            )}
            <div className="ml-auto">
                {activeReview
                    ? <a href="#" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                        Open Review
                        <ExternalLink className="size-3 shrink-0" />
                    </a>
                    : null}
            </div>
        </div>
    ) : undefined;

    return (
        <>
        <TabLayout
            stickyTop={stickyTop}
            title="Legal Description"
            headerClassName='border-b border-divider'
            description="Official legal description, lot and section identifiers, and approved legal text for this parcel."
            icon="/images/icons/legal-description-icon.png"
            isLoading={isLoading}
            headerActions={headerActions}
            banner={reviewBanner}
        >
            <div className="px-6 py-6 flex gap-8 h-[1000px]">

                <div className="w-80 shrink-0 flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="size-4 text-muted-foreground shrink-0" />
                            <FieldLabel>Location Identifiers</FieldLabel>
                        </div>
                        <div className="rounded-lg border border-divider bg-muted p-5 flex flex-col gap-0">
                            <div className="flex flex-col divide-y divide-divider">
                                <div className="pb-2"><Field label="Town Range" value={parcel?.townRange} /></div>
                                <div className="py-2"><Field label="Section" value={parcel?.section} /></div>
                                <div className="py-2"><Field label="Block" value={parcel?.block} /></div>
                                <div className="pt-2"><Field label="Lot" value={parcel?.lot} /></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                            <Info className="size-4 text-muted-foreground shrink-0" />
                            <FieldLabel>Additional Information</FieldLabel>
                        </div>
                        <div className="rounded-lg border border-divider bg-muted p-5 flex flex-col gap-0">
                                    <div className="flex flex-col divide-y divide-divider pb-2">
                                        <div className="pb-2"><Field label="Legal Last Updated" value="03/14/2025" /></div>
                                        <div className="py-2"><Field label="Updated By" value="R. Halvorsen, PLS" /></div>
                                        <div className="py-2">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-semibold text-foreground">Review Status</span>
                                                <Badge variant="success" appearance="light" className="text-xs w-fit">
                                                    <CheckCircle className="size-3 mr-1" />
                                                    Approved
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="pt-2"><Field label="Next Review Date" value="03/14/2027" /></div>
                                    </div>

                                    <div className="border-t border-divider pt-4 flex flex-col gap-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                                                <History className="size-3.5 shrink-0" />
                                                History
                                            </div>
                                            <a href="#" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                                                View Legal Description History
                                                <ExternalLink className="size-3 shrink-0" />
                                            </a>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                                                <Map className="size-3.5 shrink-0" />
                                                Survey &amp; GIS
                                            </div>
                                            <a href="#" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                                                View On Interactive Mapping
                                                <ExternalLink className="size-3 shrink-0" />
                                            </a>
                                        </div>
                                    </div>
                        </div>
                    </div>

                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                            <ScrollText className="size-4 text-muted-foreground shrink-0" />
                            <FieldLabel>Current Legal</FieldLabel>
                        </div>
                        <div className="rounded-md border border-divider bg-muted px-4 py-3 h-80 overflow-y-auto">
                            <FieldValue value={parcel?.gcsLegal} mono />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                            <BookOpen className="size-4 text-muted-foreground shrink-0" />
                            <FieldLabel>Research Legal</FieldLabel>
                        </div>
                        <div className="rounded-md border border-divider bg-muted px-4 py-3 h-80 overflow-y-auto">
                            <FieldValue value={parcel?.researchLegal} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                            <CheckCircle className="size-4 text-muted-foreground shrink-0" />
                            <FieldLabel>Approved Legal</FieldLabel>
                        </div>
                        <div className="rounded-md border border-divider bg-muted px-4 py-3 h-80 overflow-y-auto">
                            <FieldValue value={parcel?.approvedLegal} />
                        </div>
                    </div>
                </div>
            </div>
        </TabLayout>

        {parcel && (
            <ChangeLegalDescriptionDialog
                open={reviewDialogOpen}
                onOpenChange={setReviewDialogOpen}
                parcel={parcel}
            />
        )}
        </>
    );
}
