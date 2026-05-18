export interface DtmUserProfile {
  fullName: string;
  email: string;
  departmentName: string | null;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canExport: boolean;
}

export type DtmAccessModule =
  | 'DOCUMENTS'
  | 'PARCELS'
  | 'PAYMENT_PLANS'
  | 'STAGES'
  | 'TAX_BREAKDOWN'
  | (string & {});

export interface DtmAccessData {
  haveAccessToDTM: boolean;
  userProfile: DtmUserProfile;
  accessModules: DtmAccessModule[];
}

export interface DtmAccessResponse {
  success: boolean;
  message: string;
  errors: string[];
  data: DtmAccessData;
  meta: {
    itemCount: number;
    timestamp: string;
  };
}
