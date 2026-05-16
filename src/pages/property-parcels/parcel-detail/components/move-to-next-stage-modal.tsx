import { useState, useRef } from 'react';
import { Paperclip, ArrowRightCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogBody,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { StatusBadge, StageBadge } from '@/components/ui/parcel-badges';
import { STAGES_BY_STATUS } from '@/data/parcels/types';
import type { ParcelStatus, ParcelStage } from '@/data/parcels/types';
import type { ParcelCaseStageHistory } from '@/data/cases/case-stage-history/types';

const ALL_STATUSES: ParcelStatus[] = [
    'Delinquent',
    'Payment Plan',
    'Early Enforcement',
    'Tax Deed Preparation',
    'Advertisement / Waiting',
    'Auction / Sale',
    'Post-Deed Processing',
    'Financial Processing',
    'On Hold',
    'Review',
    'Legal',
    'Complete',
];

interface MoveToNextStageModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entry: ParcelCaseStageHistory;
    parcelNumber: string;
}

export function MoveToNextStageModal({ open, onOpenChange, entry, parcelNumber }: MoveToNextStageModalProps) {
    const [newStatus, setNewStatus] = useState<ParcelStatus | ''>('');
    const [newStage, setNewStage] = useState<ParcelStage | ''>('');
    const [actionTaken, setActionTaken] = useState('');
    const [notes, setNotes] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const stageOptions: ParcelStage[] = newStatus ? STAGES_BY_STATUS[newStatus] ?? [] : [];

    function handleStatusChange(val: string) {
        setNewStatus(val as ParcelStatus);
        setNewStage(''); // reset stage when status changes
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
        }
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setIsDragging(false);
        const dropped = Array.from(e.dataTransfer.files);
        if (dropped.length) setFiles((prev) => [...prev, ...dropped]);
    }

    function handleSubmit() {
        // TODO: wire up to real save action
        onOpenChange(false);
        reset();
    }

    function handleCancel() {
        onOpenChange(false);
        reset();
    }

    function reset() {
        setNewStatus('');
        setNewStage('');
        setActionTaken('');
        setNotes('');
        setFiles([]);
    }

    const canSubmit = newStatus !== '' && newStage !== '' && actionTaken.trim() !== '';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader
                    icon={<ArrowRightCircle />}
                    subtitle={`Advance the workflow for parcel ${parcelNumber} to a new status and stage.`}
                >
                    <DialogTitle>Move to Next Stage</DialogTitle>
                </DialogHeader>

                <DialogBody className="flex flex-col gap-5 p-0">

                    {/* ── Current status & stage ───────────────────────────── */}
                    <div className="flex items-center gap-4 border-b border-divider px-6 py-3">
                        <div className="flex flex-col gap-1 min-w-0">
                            <span className="font-semibold text-sm uppercase text-muted-foreground">Current Status</span>
                            <StatusBadge status={entry.status} />
                        </div>
                        <div className="self-stretch w-px shrink-0 bg-divider" />
                        <div className="flex flex-col gap-1 min-w-0">
                            <span className="font-semibold text-sm uppercase text-muted-foreground">Current Stage</span>
                            <StageBadge stage={entry.stage} />
                        </div>
                    </div>

                    <div className='flex flex-col gap-2 px-6 pb-8'>

                    {/* ── New Status (left) + New Stage (right) ────────────── */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>
                                New Status <span className="text-destructive">*</span>
                            </Label>
                            <Select value={newStatus} onValueChange={handleStatusChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ALL_STATUSES.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>
                                New Stage <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={newStage}
                                onValueChange={(v) => setNewStage(v as ParcelStage)}
                                disabled={!newStatus}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select next stage" />
                                </SelectTrigger>
                                <SelectContent>
                                    {stageOptions.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* ── Action Taken ─────────────────────────────────────── */}
                    <Input
                        label="Action Taken"
                        required
                        value={actionTaken}
                        onChange={(e) => setActionTaken(e.target.value)}
                        placeholder="e.g. Notice mailed to owner"
                    />

                    {/* ── Notes ────────────────────────────────────────────── */}
                    <div className="space-y-1.5">
                        <Label>Notes <span className="text-muted-foreground font-normal">(optional)</span></Label>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any relevant notes..."
                            className="resize-none h-[4.5rem]"
                        />
                    </div>

                    {/* ── Upload Documents ─────────────────────────────────── */}
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={() => fileInputRef.current?.click()}
                        onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`flex cursor-pointer items-start gap-3 rounded-md border-2 border-dashed px-4 py-3 text-sm transition-colors
                            ${isDragging
                                ? 'border-[var(--color-active-workflow-side-line)] bg-emerald-50/50'
                                : 'border-divider hover:border-[var(--color-active-workflow-side-line)] hover:bg-muted/40'
                            }`}
                    >
                        <Paperclip className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div>
                            <p className="font-medium">Upload Documents <span className="font-normal text-muted-foreground">(optional)</span></p>
                            {files.length === 0
                                ? <p className="text-muted-foreground text-xs">Drag &amp; drop files or click to browse</p>
                                : <p className="text-muted-foreground text-xs">{files.length} file{files.length !== 1 ? 's' : ''} selected</p>
                            }
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    </div>
                </DialogBody>

                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        disabled={!canSubmit}
                        onClick={handleSubmit}
                        className="gap-1.5"
                    >
                        <ArrowRightCircle className="h-4 w-4" />
                        Save &amp; Continue
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
