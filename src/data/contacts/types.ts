export type ParcelContact = {
  id: number;
  parcelId: number;
  contactTypeId: number;
  contactTypeName: string;
  firstName: string;
  lastName: string;
  suffix: string | null;
  companyName: string | null;
  phoneNumber: string | null;
  alternatePhoneNumber: string | null;
  email: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  isPrimary: boolean;
  notes: string | null;
  otherInfo: string | null;
  createdBy: string;
  updatedBy: string;
  createdDate: string;
  updatedDate: string;
};

export type CreateContactPayload = {
  parcelId: number;
  contactTypeId: number;
  firstName: string;
  lastName: string;
  suffix: string | null;
  companyName: string | null;
  phoneNumber: string | null;
  alternatePhoneNumber: string | null;
  email: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  isPrimary: boolean;
  notes: string | null;
  otherInfo: string | null;
  userObjectId: string;
};

export type UpdateContactPayload = Omit<CreateContactPayload, 'parcelId'> & { id: number };
