export type CatalisParcelStatus = 'Active' | 'Delinquent' | 'Foreclosure' | 'Exempt' | 'Inactive';

export type CatalisParcel = {
  parcelNumber: string;
  owner: string;
  address: string;
  city: string;
  zip: string;
  municipalityCode: string;
  municipalityDescription: string;
  propertyType: 'Residential' | 'Commercial' | 'Industrial' | 'Agricultural' | 'Vacant';
  taxYear: number;
  status: CatalisParcelStatus;
  taxDue: number;
  delinquencyStatus: 'Current' | 'Delinquent';
};

export type CatalisSearchParams = {
  query: string;
  searchField: 'all' | 'parcelNumber' | 'ownerName' | 'address';
  municipality?: string;
  county?: string;
  status?: string;
  propertyType?: string;
  taxYear?: string[];
  // advanced
  parcelNumber?: string;
  ownerFirstName?: string;
  ownerLastName?: string;
  addressLine1?: string;
  city?: string;
  zip?: string;
  minTaxAmount?: string;
  maxTaxAmount?: string;
  delinquencyStatus?: string;
};
