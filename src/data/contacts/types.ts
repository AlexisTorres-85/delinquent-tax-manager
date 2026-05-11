export type ContactStatus =
  | 'Current Owner'
  | 'Former Owner'
  | 'Co-Owner'
  | 'Attorney'
  | 'Lien Holder'
  | 'Tenant'
  | 'Estate Representative'
  | 'Authorized Agent'
  | 'Bankruptcy Trustee'
  | 'Interest Party';

export type ParcelContact = {
  id: string;
  fullName: string;
  status: ContactStatus;
  phone: string;
  email: string;
};

export type ParcelContactPlan = {
  parcelNumber: string;
  contacts: ParcelContact[];
};
