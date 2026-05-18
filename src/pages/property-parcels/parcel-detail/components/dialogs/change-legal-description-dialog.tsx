import { useState } from 'react';
import { Scale, ChevronRight, Paperclip } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDepartments } from '@/data/departments';
import type { Parcel } from '@/data/parcels/types';

interface ChangeLegalDescriptionDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  parcel: Parcel;
}

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'] as const;
const REASON_OPTIONS = [
  'Correction – Legal Description Error',
  'Boundary Dispute Resolution',
  'Easement Addition',
  'Survey Amendment',
  'Court Order',
  'Other',
] as const;

const PRIORITY_DOT: Record<string, string> = {
  Low: 'bg-sky-400',
  Medium: 'bg-yellow-400',
  High: 'bg-orange-500',
  Critical: 'bg-red-600',
};

export function ChangeLegalDescriptionDialog({
  open,
  onOpenChange,
  parcel,
}: ChangeLegalDescriptionDialogProps) {
  const today = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });

  const { departments, isLoading: depsLoading } = useDepartments();

  const [requestedBy, setRequestedBy] = useState('');
  const [requestDate, setRequestDate] = useState(today);
  const [assignTo, setAssignTo] = useState('');
  const [priority, setPriority] = useState<string>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [reason, setReason] = useState('');
  const [proposedLegal, setProposedLegal] = useState('');
  const [notes, setNotes] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileName(e.target.files?.[0]?.name ?? null);
  }

  function handleSubmit() {
    // TODO: wire to API
    console.log('Submit legal description change request', {
      parcelNumber: parcel.parcelNumber,
      requestedBy,
      requestDate,
      assignTo,
      priority,
      dueDate,
      reason,
      proposedLegal,
      notes,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl">
        <DialogHeader
          icon={<Scale />}
          subtitle="Submit a request to change the legal description for this parcel."
        >
          <DialogTitle>Change Legal Description</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="flex gap-6 border-b-2 border-t-1 border-divider bg-[var(--color-modal-header-banner)] px-6 py-4 mb-6 -mt-6 -ml-6 -mr-6 text-sm">
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-sm uppercase tracking-widest font-semibold text-muted-foreground">Parcel ID</span>
              <span className="font-semibold text-foreground truncate">{parcel.parcelNumber}</span>
            </div>
            <div className="w-px shrink-0 bg-divider" />
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <span className="text-sm uppercase tracking-widest font-semibold text-muted-foreground">Property Address</span>
              <span className="font-semibold text-foreground truncate">{parcel.propertyAddress}</span>
            </div>
            <div className="w-px shrink-0 bg-divider" />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-sm uppercase tracking-widest font-semibold text-muted-foreground">Current Owner</span>
              <span className="font-semibold text-foreground truncate">{parcel.ownerName}</span>
            </div>
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
              label="Requested By"
              required
              placeholder="e.g. Jane Smith"
              value={requestedBy}
              onChange={(e) => setRequestedBy(e.target.value)}
            />
            <Input
              label="Request Date"
              required
              type="date"
              value={requestDate}
              onChange={(e) => setRequestDate(e.target.value)}
            />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">
                Assign To <span className="text-destructive">*</span>
              </Label>
              <Select value={assignTo} onValueChange={setAssignTo} disabled={depsLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department…" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">
                Priority <span className="text-destructive">*</span>
              </Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o}>
                      <span className="flex items-center gap-2">
                        <span className={`size-2 rounded-full shrink-0 ${PRIORITY_DOT[o]}`} />
                        {o}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">
                Reason for Change <span className="text-destructive">*</span>
              </Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason…" />
                </SelectTrigger>
                <SelectContent>
                  {REASON_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Legal descriptions */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">Current Legal Description</Label>
              <Textarea
                className="text-sm font-mono resize-none h-36 bg-muted text-muted-foreground"
                readOnly
                value={parcel.legalDescription ?? ''}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">
                Proposed / Corrected Legal Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                className="text-sm font-mono resize-none h-36"
                placeholder="Enter the corrected legal description…"
                value={proposedLegal}
                onChange={(e) => setProposedLegal(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            <Label className="text-sm">Notes</Label>
            <Textarea
              className="text-sm resize-none"
              rows={3}
              placeholder="Additional context or notes…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm">Attachments</Label>
            <div className="flex items-center gap-3">
              <label>
                <input
                  type="file"
                  className="sr-only"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                />
                <Button variant="outline" size="sm" asChild>
                  <span className="cursor-pointer">
                    <Paperclip className="h-3.5 w-3.5" />
                    Upload Documents
                  </span>
                </Button>
              </label>
              <span className="text-xs text-muted-foreground">
                {fileName ?? 'Upload supporting documents such as deeds, plats, surveys, etc.'}
              </span>
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Submit Request
            <ChevronRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
