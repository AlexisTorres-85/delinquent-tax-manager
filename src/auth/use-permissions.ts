import { useDtmAccess } from './dtm-access-context';

/**
 * Repository-style hook for DTM access permissions.
 *
 * Data is loaded once during authentication and stored in context —
 * calling this hook never triggers an API request.
 *
 * Usage:
 *   const { canEdit, hasModule } = usePermissions();
 *   const { hasParcels, canExport } = usePermissions();
 */
export function usePermissions() {
  const { userProfile, accessModules, canAccess } = useDtmAccess();

  return {
    // ── CRUD permissions ──────────────────────────────────────────────────
    canView:    userProfile?.canView    ?? false,
    canEdit:    userProfile?.canEdit    ?? false,
    canDelete:  userProfile?.canDelete  ?? false,
    canApprove: userProfile?.canApprove ?? false,
    canExport:  userProfile?.canExport  ?? false,

    // ── Module access (generic) ───────────────────────────────────────────
    /** Check by module key, e.g. hasModule('PARCELS') */
    hasModule: canAccess,
    /** Raw module list for inspection */
    modules: accessModules,

    // ── Module access (named shortcuts) ──────────────────────────────────
    hasDocuments:    canAccess('DOCUMENTS'),
    hasParcels:      canAccess('PARCELS'),
    hasPaymentPlans: canAccess('PAYMENT_PLANS'),
    hasStages:       canAccess('STAGES'),
    hasTaxBreakdown: canAccess('TAX_BREAKDOWN'),

    // ── User profile ──────────────────────────────────────────────────────
    profile: userProfile,
  };
}
