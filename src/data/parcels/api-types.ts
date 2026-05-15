/**
 * Raw shape of catalisParcelInformation returned by the API.
 */
export interface CatalisParcelInformation {
  isRE: number;
  parcelNumber: string;
  alternateParcelNumber: string;
  creationDate: string;
  historicalDate: string;
  taxYear: number;
  currentParcel: number;
  isAssessed: number;
  isTaxed: number;
  municipalityCode: string;
  municipalityDescription: string;
  platType: string;
  platCode: string;
  platDescription: string;
  block: string;
  lotType: string;
  lot: string;
  acres: number;
  frontageFeet: number;
  depthFeet: number;
  areaSquareFeet: number;
  legalDescription: string;
  landValue: number;
  improvementValue: number;
  currentAssessedValue: number;
  lotteryCreditsClaimed: number;
  averageAssessmentRatio: number;
  fairMarketValue: number;
  generalPropertyTaxBalanceCode: string;
  specialAssessmentBalanceCode: string;
  otherSpecialTaxesBalanceCode: string;
  attention: string;
  namePrefix1: string;
  firstName1: string;
  middleName1: string;
  lastName1: string;
  nameExtension1: string;
  namePrefix2: string;
  firstName2: string;
  middleName2: string;
  lastName2: string;
  nameExtension2: string;
  houseNumber: string;
  houseNumberSuffix: string;
  prefixDirection: string;
  streetName: string;
  streetType: string;
  suffixDirection: string;
  unitType: string;
  unitNumber: string;
  city: string;
  state: string;
  zipCode: string;
  zipCodeExt: string;
  countryCode: string;
  confidential: number;
  taxBillNumber: number;
  taxCertificateNumber: number;
}

/**
 * Single parcel item as returned by the paginated list endpoint
 * GET /api/parcels?pageNumber=&pageSize=
 */
export interface ApiParcelListItem {
  id: number;
  parcelNumber: string;
  creationDate: string;
  isRe: boolean;
  municipalityCode: string;
  municipalityDescription: string | null;
  isBankruptcy: boolean;
  isFloodPlain: boolean;
  isInRem: boolean;
  isOutlot: boolean;
  isContaminated: boolean;
  hasHistoricalContamination: boolean;
  isDeeded: boolean;
  isEnvironmentalIssue: boolean;
  isRazingOrder: boolean;
  createdDate: string;
  updatedDate: string;
  ownerName: string | null;
  propertyAddress: string | null;
  postOffice: string | null;
  zipCode: string | null;
  legalDescription: string | null;
  isDelinquent: number;
  totalYearsDelinquent: number;
  valuationAcres: number;
  landValue: number;
  improvementValue: number;
  totalValue: number;
  personalPropertyValue: number;
  generalPropertyTaxBalancecode: string | null;
  specialAssessmentBalancecode: string | null;
  otherSpecialTaxesBalanceCode: string | null;
}

/** Pagination envelope returned by the list endpoint. */
export interface ApiParcelPage {
  items: ApiParcelListItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  delinquentInScope: number;
  inRemCount: number;
  bankruptcyCount: number;
  contaminatedCount: number;
  razingOrderCount: number;
  environmentalIssueCount: number;
}

export interface ApiWorkflowHistoryEntry {
  id: number;
  dateTime: string; // ISO datetime e.g. "2026-05-15T07:38:54.6666667"
  workflowStatusDefinitionId: number;
  workflowStatusDefinitionName: string;
  workflowStageDefinitionId: number;
  workflowStageDefinitionName: string;
  actionTaken: string;
  performedBy: string;
  isActive: boolean;
}

export interface ApiActiveWorkflow {
  id: number;
  taxYears: string; // comma-separated e.g. "2022,2024,2025"
  createdDate: string;
  workflowHistoryEntries: ApiWorkflowHistoryEntry[];
}

/**
 * Raw shape of the parcel object inside `data` from the API.
 */
export interface ApiParcelData {
  id: number;
  parcelNumber: string;
  creationDate: string;
  isRe: boolean;
  municipalityCode: string;
  municipalityDescription: string | null;
  isBankruptcy: boolean;
  isFloodPlain: boolean;
  isInRem: boolean;
  isOutlot: boolean;
  isContaminated: boolean;
  hasHistoricalContamination: boolean;
  isDeeded: boolean;
  isEnvironmentalIssue: boolean;
  isRazingOrder: boolean;
  createdDate: string;
  updatedDate: string;
  contactsCount: number;
  legalDescriptionsCount: number;
  workflowsCount: number;
  internalNotesCount: number;
  catalisParcelInformation: CatalisParcelInformation | null;
  activeWorkflow: ApiActiveWorkflow | null;
}
