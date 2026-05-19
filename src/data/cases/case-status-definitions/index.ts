// Status and stage types — values come from the API (GET /api/lookup/case-statuses)
export type ParcelStatus = string;
export type ParcelStage = string;

// --- Record types (for the service / hook layer) ------------------------------

export type CaseStageRecord = {
  id: number;
  name: string;
  sortOrder: number;
};

export type CaseStatusRecord = {
  id: number;
  name: string;
  sortOrder: number;
  /** Readonly — do not mutate at runtime. */
  stages: ReadonlyArray<CaseStageRecord>;
};
