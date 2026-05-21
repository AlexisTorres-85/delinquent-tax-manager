export type CaseStageHistory = {
  id: number;
  caseId: number;
  dateTime: string;
  caseStatusDefinitionId: number;
  caseStatusDefinitionName: string;
  caseStageDefinitionId: number;
  caseStageDefinitionName: string;
  actionTaken: string;
  isActive: boolean;
};

export type CaseInfo = {
  id: number;
  parcelId: number;
  taxYears: string;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  updatedDate: string | null;
  caseStageHistory: CaseStageHistory | null;
};

export type InternalNote = {
  id: number;
  parcelId: number;
  caseId: number;
  caseStageHistoryId: number | null;
  noteText: string;
  createdBy: string;
  createdByName: string;
  createdDate: string;
  updatedBy: string | null;
  updatedByName: string | null;
  updatedDate: string | null;
  caseInfo: CaseInfo | null;
};
