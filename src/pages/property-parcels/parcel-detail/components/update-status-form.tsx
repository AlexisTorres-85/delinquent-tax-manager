import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { ParcelStatus } from '@/data/parcels/types';
import type { CaseStatusRecord, CaseStageRecord } from '@/data/cases/case-status-definitions';

export const CURRENT_YEAR = new Date().getFullYear();
export const AVAILABLE_TAX_YEARS = Array.from({ length: 8 }, (_, i) => CURRENT_YEAR - 7 + i);

export type UpdateStatusFormProps = {
    isNewWorkflow: boolean;
    status: ParcelStatus | '';
    stage: string;
    note: string;
    selectedYears: number[];
    availableStages: ReadonlyArray<CaseStageRecord>;
    workflowLoading: boolean;
    statuses: CaseStatusRecord[];
    originalStatus?: ParcelStatus | '';
    originalStage?: string;
    onStatusChange: (status: ParcelStatus) => void;
    onStageChange: (stage: string) => void;
    onNoteChange: (note: string) => void;
    onYearToggle: (year: number, checked: boolean) => void;
    onCancel: () => void;
    onSave: () => void;
};

export function UpdateStatusForm({
    isNewWorkflow,
    status,
    stage,
    note,
    selectedYears,
    availableStages,
    workflowLoading,
    statuses,
    originalStatus,
    originalStage,
    onStatusChange,
    onStageChange,
    onNoteChange,
    onYearToggle,
    onCancel,
    onSave,
}: UpdateStatusFormProps) {
    const isUnchanged = !isNewWorkflow && status === originalStatus && stage === originalStage;
    return (
        <>
            <div className='border-b-3 border-app-secondary bg-app-primary pl-4 pr-4 pt-4'>
                <p className="text-sm text-white font-semibold">
                    {isNewWorkflow ? 'Start Delinquent Process' : 'Update Case Status'}
                </p>
                {isNewWorkflow && (
                    <p className="text-xs text-white/50 mb-4">
                        This will open a new case at the initial delinquency stage.
                    </p>
                )}
                {!isNewWorkflow && (
                    <p className="text-xs text-white/50 mb-4">
                        Change the current status or stage of this parcel's active case.
                    </p>
                )}

            </div>
            <div className="flex flex-col gap-3 p-4 bg-app-secondary/5">
                {isNewWorkflow && (
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-sm">
                            Tax Years <span className="text-destructive font-normal">*</span>
                        </Label>
                        <div className="grid grid-cols-4 gap-x-3 gap-y-2 py-1">
                            {AVAILABLE_TAX_YEARS.map((year) => (
                                <div key={year} className="flex items-center gap-1.5">
                                    <Checkbox
                                        id={`year-${year}`}
                                        size="sm"
                                        checked={selectedYears.includes(year)}
                                        onCheckedChange={(checked) => onYearToggle(year, !!checked)}
                                    />
                                    <label
                                        htmlFor={`year-${year}`}
                                        className="text-sm cursor-pointer select-none leading-none"
                                    >
                                        {year}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {selectedYears.length === 0 && (
                            <p className="text-sm text-destructive">Select at least one tax year.</p>
                        )}
                    </div>
                )}
                <div className="flex flex-col gap-1.5">
                    <Label className="text-sm">Status</Label>
                    {isNewWorkflow ? (
                        <div className="h-8 flex items-center px-3 rounded-md border border-input bg-muted text-sm text-muted-foreground select-none">
                            Delinquent
                        </div>
                    ) : (
                        <Select value={status} onValueChange={(v) => onStatusChange(v as ParcelStatus)} disabled={workflowLoading}>
                            <SelectTrigger className="h-8 text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((s) => (
                                    <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label className="text-sm">Stage</Label>
                    {isNewWorkflow ? (
                        <div className="h-8 flex items-center px-3 rounded-md border border-input bg-muted text-sm text-muted-foreground select-none">
                            Initial Delinquency
                        </div>
                    ) : (
                        <Select value={stage} onValueChange={onStageChange} disabled={workflowLoading}>
                            <SelectTrigger className="h-8 text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {availableStages.map((s) => (
                                    <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label className="text-sm">Note <span className="text-muted-foreground font-normal">(optional)</span></Label>
                    <Textarea
                        className="text-sm resize-none"
                        rows={2}
                        placeholder="Reason for change..."
                        value={note}
                        onChange={(e) => onNoteChange(e.target.value)}
                    />
                </div>

                <div className='border-t border-divider' />
                <div className="flex justify-end gap-2 pt-1">
                    <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
                    <Button size="sm" onClick={onSave} disabled={workflowLoading || (isNewWorkflow && selectedYears.length === 0) || isUnchanged}>
                        {isNewWorkflow ? (workflowLoading ? 'Starting…' : 'Confirm') : 'Save'}
                    </Button>
                </div>
            </div>
        </>
    );
}
