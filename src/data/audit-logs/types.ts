export type AuditActionType = 'Status' | 'Stage' | 'Flag' | 'Payment' | 'System' | 'Note';

export interface AuditLogEntry {
  id: string;
  timestamp: string; // ISO string
  parcelNumber: string;
  action: string;
  type: AuditActionType;
  oldValue: string;
  newValue: string;
  user: string;
  notes?: string;
}

export interface AuditLogSearchParams {
  query?: string;
  parcelNumber?: string;
  user?: string;
  type?: AuditActionType | '';
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string;   // YYYY-MM-DD
}
