export type NoteMessageType =
  | 'Payment Problems'
  | 'Call'
  | 'Tax Deeded Note'
  | 'Bankruptcy Note'
  | 'Legal Note'
  | 'General Note'
  | 'Status Update'
  | 'Owner Contact'
  | 'Attorney Communication';

export type ParcelNote = {
  id: string;
  workflowId: string;
  taxYear: number;
  createdDate: string; // MM/DD/YYYY
  createdBy: string;
  messageType: NoteMessageType;
  note: string;
};

export type ParcelNoteRecord = {
  parcelNumber: string;
  notes: ParcelNote[];
};
