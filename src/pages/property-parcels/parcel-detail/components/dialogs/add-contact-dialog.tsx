import { useState, useEffect } from 'react';
import { UserPlus, Pencil } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogBody,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    SelectField,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useContactTypes } from '@/data/lookup/use-contact-types';
import { contactsService } from '@/data/contacts/services/contacts.service';
import { CONTACTS_QUERY_KEY } from '@/data/contacts/hooks/use-contacts';
import { useAuth } from '@/auth/use-auth';
import type { ParcelContact } from '@/data/contacts/types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ContactDialogProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    parcelId: number;
    parcelNumber: string;
    /** When provided the dialog opens in Edit mode and pre-fills from the API. */
    editContact?: ParcelContact | null;
}

// ─── Empty form state ─────────────────────────────────────────────────────────

function emptyForm() {
    return {
        contactType: '',
        firstName: '',
        lastName: '',
        suffix: '',
        companyName: '',
        phoneNumber: '',
        alternatePhoneNumber: '',
        email: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        isPrimary: false,
        notes: '',
        otherInfo: '',
    };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ContactDialog({
    open,
    onOpenChange,
    parcelId,
    parcelNumber,
    editContact,
}: ContactDialogProps) {
    const isEdit = !!editContact;
    const { contactTypes, isLoading: typesLoading } = useContactTypes();
    const { objectId } = useAuth();
    const queryClient = useQueryClient();

    // Fetch full contact details when editing
    const { data: fetchedContact, isLoading: contactLoading } = useQuery({
        queryKey: ['contacts', 'detail', editContact?.id],
        queryFn: () => contactsService.getById(editContact!.id),
        enabled: isEdit && open,
        staleTime: 0,
        gcTime: 0,
    });

    // Form state
    const [form, setForm] = useState(emptyForm);

    function set<K extends keyof ReturnType<typeof emptyForm>>(
        key: K,
        value: ReturnType<typeof emptyForm>[K],
    ) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    // Pre-fill when editing — `open` is in deps so re-opening always re-runs
    // even when fetchedContact is the same cached reference.
    useEffect(() => {
        if (!open) return;
        if (isEdit && fetchedContact) {
            setForm({
                contactType: String(fetchedContact.contactTypeId),
                firstName: fetchedContact.firstName ?? '',
                lastName: fetchedContact.lastName ?? '',
                suffix: fetchedContact.suffix ?? '',
                companyName: fetchedContact.companyName ?? '',
                phoneNumber: fetchedContact.phoneNumber ?? '',
                alternatePhoneNumber: fetchedContact.alternatePhoneNumber ?? '',
                email: fetchedContact.email ?? '',
                addressLine1: fetchedContact.addressLine1 ?? '',
                addressLine2: fetchedContact.addressLine2 ?? '',
                city: fetchedContact.city ?? '',
                state: fetchedContact.state ?? '',
                zipCode: fetchedContact.zipCode ?? '',
                isPrimary: fetchedContact.isPrimary,
                notes: fetchedContact.notes ?? '',
                otherInfo: fetchedContact.otherInfo ?? '',
            });
        }
    }, [isEdit, open, fetchedContact]);

    function handleOpenChange(v: boolean) {
        if (!v) setForm(emptyForm());
        onOpenChange(v);
    }

    // ─── Mutations ──────────────────────────────────────────────────────────────

    const createMutation = useMutation({
        mutationFn: () =>
            contactsService.create({
                parcelId,
                contactTypeId: Number(form.contactType),
                firstName: form.firstName,
                lastName: form.lastName,
                suffix: form.suffix || null,
                companyName: form.companyName || null,
                phoneNumber: form.phoneNumber || null,
                alternatePhoneNumber: form.alternatePhoneNumber || null,
                email: form.email || null,
                addressLine1: form.addressLine1 || null,
                addressLine2: form.addressLine2 || null,
                city: form.city || null,
                state: form.state || null,
                zipCode: form.zipCode || null,
                isPrimary: form.isPrimary,
                notes: form.notes || null,
                otherInfo: form.otherInfo || null,
                userObjectId: objectId,
            }),
        onSuccess: () => {
            toast.success('Contact added successfully.');
            queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEY(parcelId) });
            handleOpenChange(false);
        },
        onError: (err: Error) => {
            toast.error(err.message ?? 'Failed to add contact.');
        },
    });

    const updateMutation = useMutation({
        mutationFn: () =>
            contactsService.update(editContact!.id, {
                id: editContact!.id,
                contactTypeId: Number(form.contactType),
                firstName: form.firstName,
                lastName: form.lastName,
                suffix: form.suffix || null,
                companyName: form.companyName || null,
                phoneNumber: form.phoneNumber || null,
                alternatePhoneNumber: form.alternatePhoneNumber || null,
                email: form.email || null,
                addressLine1: form.addressLine1 || null,
                addressLine2: form.addressLine2 || null,
                city: form.city || null,
                state: form.state || null,
                zipCode: form.zipCode || null,
                isPrimary: form.isPrimary,
                notes: form.notes || null,
                otherInfo: form.otherInfo || null,
                userObjectId: objectId,
            }),
        onSuccess: () => {
            toast.success('Contact updated successfully.');
            queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEY(parcelId) });
            queryClient.removeQueries({ queryKey: ['contacts', 'detail', editContact?.id] });
            handleOpenChange(false);
        },
        onError: (err: Error) => {
            toast.error(err.message ?? 'Failed to update contact.');
        },
    });

    const isPending = createMutation.isPending || updateMutation.isPending;
    const isFormLoading = isEdit && contactLoading;

    function handleSubmit() {
        if (!form.contactType || !form.firstName || !form.lastName) return;
        if (isEdit) updateMutation.mutate();
        else createMutation.mutate();
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-4xl" isLoading={isFormLoading}>
                <DialogHeader
                    icon={isEdit ? <Pencil /> : <UserPlus />}
                    subtitle={isEdit ? 'Update the details for this contact.' : 'Add a new contact associated with this parcel.'}
                >
                    <DialogTitle>{isEdit ? 'Edit Contact' : 'Add Contact'}</DialogTitle>
                </DialogHeader>

                <DialogDescription>
                    {isEdit ? (
                        <>
                            You are editing <strong>{editContact?.firstName} {editContact?.lastName}</strong> ({editContact?.contactTypeName}). Changes will be reflected immediately after saving.
                        </>
                    ) : (
                        <>
                            Create a new contact associated with parcel <strong>{parcelNumber}</strong>. This contact will be visible to all users who have access to this parcel.
                        </>
                    )}
                </DialogDescription>

                <DialogBody>

                    <div className='mb-6'>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <SelectField
                                label="Contact Type"
                                required
                                value={form.contactType}
                                onValueChange={(v) => set('contactType', v)}
                                disabled={typesLoading || isFormLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={typesLoading ? 'Loading…' : 'Select type…'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {contactTypes.map((t) => (
                                        <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </SelectField>
                            <div className="flex items-end pb-1">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <Checkbox
                                        checked={form.isPrimary}
                                        onCheckedChange={(v) => set('isPrimary', Boolean(v))}
                                    />
                                    <span className="text-sm font-medium">Primary Contact</span>
                                </label>
                            </div>
                        </div>

                        {/* Name row */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <Input
                                label="First Name"
                                required
                                placeholder="First name"
                                value={form.firstName}
                                onChange={(e) => set('firstName', e.target.value)}
                            />
                            <Input
                                label="Last Name"
                                required
                                placeholder="Last name"
                                value={form.lastName}
                                onChange={(e) => set('lastName', e.target.value)}
                            />
                            <Input
                                label="Suffix"
                                placeholder="e.g. Jr., Sr., III"
                                value={form.suffix}
                                onChange={(e) => set('suffix', e.target.value)}
                            />
                        </div>

                        {/* Company */}
                        <div className="mb-4">
                            <Input
                                label="Company Name"
                                placeholder="Company or organization"
                                value={form.companyName}
                                onChange={(e) => set('companyName', e.target.value)}
                            />
                        </div>

                        {/* Phone */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <Input
                                label="Phone Number"
                                placeholder="(555) 000-0000"
                                value={form.phoneNumber}
                                onChange={(e) => set('phoneNumber', e.target.value)}
                            />
                            <Input
                                label="Alternate Phone Number"
                                placeholder="(555) 000-0000"
                                value={form.alternatePhoneNumber}
                                onChange={(e) => set('alternatePhoneNumber', e.target.value)}
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <Input
                                label="Email"
                                type="email"
                                placeholder="email@example.com"
                                value={form.email}
                                onChange={(e) => set('email', e.target.value)}
                            />
                        </div>

                        {/* Address */}
                        <div className="mb-4">
                            <Input
                                label="Address Line 1"
                                placeholder="Street address"
                                value={form.addressLine1}
                                onChange={(e) => set('addressLine1', e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <Input
                                label="Address Line 2"
                                placeholder="Apt, suite, unit, etc."
                                value={form.addressLine2}
                                onChange={(e) => set('addressLine2', e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <Input
                                label="City"
                                placeholder="City"
                                value={form.city}
                                onChange={(e) => set('city', e.target.value)}
                            />
                            <Input
                                label="State"
                                placeholder="WI"
                                value={form.state}
                                onChange={(e) => set('state', e.target.value)}
                            />
                            <Input
                                label="Zip Code"
                                placeholder="00000"
                                value={form.zipCode}
                                onChange={(e) => set('zipCode', e.target.value)}
                            />
                        </div>

                        {/* Notes */}
                        <div className="mb-4">
                            <Textarea
                                label="Notes"
                                className="text-sm resize-none"
                                rows={3}
                                placeholder="Additional notes about this contact…"
                                value={form.notes}
                                onChange={(e) => set('notes', e.target.value)}
                            />
                        </div>

                        {/* Other Info */}
                        <div>
                            <Textarea
                                label="Other Info"
                                className="text-sm resize-none"
                                rows={2}
                                placeholder="Any other relevant information…"
                                value={form.otherInfo}
                                onChange={(e) => set('otherInfo', e.target.value)}
                            />
                        </div>
                    </div>
                </DialogBody>

                <DialogFooter>
                    <Button variant="outline" size="sm" onClick={() => handleOpenChange(false)} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSubmit}
                        disabled={isPending || isFormLoading || !form.contactType || !form.firstName || !form.lastName}
                    >
                        {isPending ? (isEdit ? 'Saving…' : 'Adding…') : (isEdit ? 'Save Changes' : 'Add Contact')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
