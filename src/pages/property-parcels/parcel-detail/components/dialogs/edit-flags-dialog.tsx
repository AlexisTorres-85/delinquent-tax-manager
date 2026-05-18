import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Flag } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogBody,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { apiFetch, API_BASE } from '@/lib/api';
import { PARCEL_QUERY_KEY } from '@/data/parcels/hooks/use-parcel-detail';
import type { ParcelFlags } from '@/data/parcels/types';

const ALL_EDITABLE_FLAGS: { key: keyof ParcelFlags; label: string; description: string }[] = [
    {
        key: 'isBankruptcy',
        label: 'Bankruptcy',
        description: 'Active or pending bankruptcy filing on this property.',
    },
    {
        key: 'isInRem',
        label: 'In Rem',
        description: 'In rem tax foreclosure action initiated against this property.',
    },
    {
        key: 'isContaminated',
        label: 'Contaminated',
        description: 'Confirmed environmental contamination present on-site.',
    },
    {
        key: 'isEnvironmentalIssue',
        label: 'Environmental Issue',
        description: 'Active environmental concern or regulatory issue flagged.',
    },
    {
        key: 'isFloodPlain',
        label: 'Flood Plain',
        description: 'Parcel is within a FEMA-designated flood plain zone.',
    },
    {
        key: 'isOutlot',
        label: 'Outlot',
        description: 'Classified as an outlot — reserved or residual land parcel.',
    },
    {
        key: 'hasHistoricalContamination',
        label: 'Historical Contamination',
        description: 'Documented history of prior environmental contamination.',
    },
    {
        key: 'isDeeded',
        label: 'Deeded',
        description: 'Property formally transferred via deed through foreclosure.',
    },
    {
        key: 'isRazingOrder',
        label: 'Razing Order',
        description: 'Court or municipal order requires demolition of structures.',
    },
];

interface EditFlagsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    parcelNumber: string;
    currentFlags: ParcelFlags;
}

export function EditFlagsDialog({ open, onOpenChange, parcelNumber, currentFlags }: EditFlagsDialogProps) {
    const queryClient = useQueryClient();

    const [flags, setFlags] = useState<ParcelFlags>({ ...currentFlags });

    const mutation = useMutation({
        mutationFn: (payload: ParcelFlags) =>
            apiFetch<void>(`${API_BASE}/api/parcels/by-number/${parcelNumber}/flags`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PARCEL_QUERY_KEY(parcelNumber) });
            toast.success('Flags updated successfully');
            onOpenChange(false);
        },
    });

    function handleOpenChange(next: boolean) {
        if (mutation.isPending) return;
        if (next) {
            setFlags({ ...currentFlags });
        }
        onOpenChange(next);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader
                    icon={<Flag />}
                    subtitle="Toggle the condition flags for this parcel."
                >
                    <DialogTitle>Edit Flags</DialogTitle>
                </DialogHeader>

                <DialogBody className="p-6">
                    <div className="grid grid-cols-3 gap-3">
                        {ALL_EDITABLE_FLAGS.map(({ key, label, description }) => (
                            <div
                                key={key}
                                className="flex flex-col gap-2 rounded-lg border border-divider bg-muted/30 p-4"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <Label htmlFor={`flag-${key}`} className="text-sm font-semibold cursor-pointer leading-tight">
                                        {label}
                                    </Label>
                                    <Switch
                                        id={`flag-${key}`}
                                        checked={flags[key]}
                                        onCheckedChange={(checked) => setFlags((prev) => ({ ...prev, [key]: checked }))}
                                        disabled={mutation.isPending}
                                        className="shrink-0"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground leading-snug">{description}</p>
                            </div>
                        ))}
                    </div>
                </DialogBody>

                <DialogFooter>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenChange(false)}
                        disabled={mutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => mutation.mutate(flags)}
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? 'Saving…' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
