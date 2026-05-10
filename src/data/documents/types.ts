export type DocumentType =
  | 'Signed Payment Plan Agreement'
  | 'Last Letter'
  | 'Final Notice'
  | 'Homestead Letter'
  | 'Delinquency Notice'
  | 'Tax Lien Certificate'
  | 'Foreclosure Notice'
  | 'Bankruptcy Filing'
  | 'Deed Transfer'
  | 'Assessment Appeal';

export type ParcelDocument = {
  id: string;
  createdDate: string; // MM/DD/YYYY
  documentName: string;
  type: DocumentType;
  filePath: string;
};

export type ParcelDocumentPlan = {
  parcelNumber: string;
  documents: ParcelDocument[];
};
