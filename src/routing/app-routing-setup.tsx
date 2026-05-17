import { Route, Routes, Navigate, useLocation } from 'react-router';

function LowercaseRedirect() {
  const { pathname, search, hash } = useLocation();
  const lower = pathname.toLowerCase();
  if (pathname !== lower) {
    return <Navigate to={lower + search + hash} replace />;
  }
  return null;
}
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/auth';
import { LoginPage } from '@/pages/auth/login';

// Dashboard
import { DashboardPage } from '@/pages/dashboard/page';
import { TodayActivityPage } from '@/pages/dashboard/today';
import { AlertsPage } from '@/pages/dashboard/alerts';
import { PerformanceKpisPage } from '@/pages/dashboard/kpis';

// Parcels
import { ParcelsPage } from '@/pages/property-parcels/delinquent-parcel-cases/page';
import { CatalisParcelSearchPage } from '@/pages/property-parcels/catalis-parcel-search/page';
import { AuditLogsPage } from '@/pages/property-parcels/audit-logs/page';
import { ParcelDetailPage } from '@/pages/property-parcels/parcel-detail/page';

// Payments
import { PaymentsPage } from '@/pages/payments/page';
import { RecordPaymentPage } from '@/pages/payments/record';
import { PendingPaymentsPage } from '@/pages/payments/pending';
import { FailedPaymentsPage } from '@/pages/payments/failed';
import { PaymentReconciliationPage } from '@/pages/payments/reconciliation';
import { PaymentMethodsPage } from '@/pages/payments/methods';

// Plans
import { PlansPage } from '@/pages/plans/page';
import { CreatePlanPage } from '@/pages/plans/create';
import { DefaultedPlansPage } from '@/pages/plans/defaulted';
import { CompletedPlansPage } from '@/pages/plans/completed';
import { InstallmentSchedulesPage } from '@/pages/plans/schedules';

// Enforcement
import { EnforcementPage } from '@/pages/enforcement/page';
import { LiensPage } from '@/pages/enforcement/liens';
import { LegalNoticesPage } from '@/pages/enforcement/notices';
import { EscalationsPage } from '@/pages/enforcement/escalations';
import { CaseTimelinePage } from '@/pages/enforcement/timeline';
import { CollectionsWorkflowPage } from '@/pages/enforcement/collections';

// Reports
import { ReportsPage } from '@/pages/reports/page';
import { RevenueReportsPage } from '@/pages/reports/revenue';
import { TaxCollectionTrendsPage } from '@/pages/reports/trends';
import { CustomReportsPage } from '@/pages/reports/custom';
import { ExportDataPage } from '@/pages/reports/export';

// Admin
import { UsersRolesPage } from '@/pages/admin/users';
import { PermissionsPage } from '@/pages/admin/permissions';
import { DepartmentsPage } from '@/pages/admin/departments';
import { TaxConfigurationPage } from '@/pages/admin/tax';
import { PenaltyRulesPage } from '@/pages/admin/penalties';
import { SystemSettingsPage } from '@/pages/admin/settings';
import { IntegrationsPage } from '@/pages/admin/integrations';

export function AppRoutingSetup() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route path="/" element={<DashboardPage />} />
        <Route path="/today" element={<TodayActivityPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/kpis" element={<PerformanceKpisPage />} />

        {/* Parcels */}
        <Route path="/property-parcels/delinquent-parcel-cases" element={<ParcelsPage />} />
        <Route path="/property-parcels/catalis-parcel-search" element={<CatalisParcelSearchPage />} />
        <Route path="/property-parcels/delinquent-parcel-cases/audit-logs" element={<AuditLogsPage />} />
        <Route path="/property-parcels/delinquent-parcel-cases/:parcelNumber" element={<Navigate to="overview" replace />} />
        <Route path="/property-parcels/delinquent-parcel-cases/:parcelNumber/:tab" element={<ParcelDetailPage />} />

        {/* Payments */}
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/payments/record" element={<RecordPaymentPage />} />
        <Route path="/payments/pending" element={<PendingPaymentsPage />} />
        <Route path="/payments/failed" element={<FailedPaymentsPage />} />
        <Route path="/payments/reconciliation" element={<PaymentReconciliationPage />} />
        <Route path="/payments/methods" element={<PaymentMethodsPage />} />

        {/* Plans */}
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/plans/create" element={<CreatePlanPage />} />
        <Route path="/plans/defaulted" element={<DefaultedPlansPage />} />
        <Route path="/plans/completed" element={<CompletedPlansPage />} />
        <Route path="/plans/schedules" element={<InstallmentSchedulesPage />} />

        {/* Enforcement */}
        <Route path="/enforcement" element={<EnforcementPage />} />
        <Route path="/enforcement/liens" element={<LiensPage />} />
        <Route path="/enforcement/notices" element={<LegalNoticesPage />} />
        <Route path="/enforcement/escalations" element={<EscalationsPage />} />
        <Route path="/enforcement/timeline" element={<CaseTimelinePage />} />
        <Route path="/enforcement/collections" element={<CollectionsWorkflowPage />} />

        {/* Reports */}
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/reports/revenue" element={<RevenueReportsPage />} />
        <Route path="/reports/trends" element={<TaxCollectionTrendsPage />} />
        <Route path="/reports/custom" element={<CustomReportsPage />} />
        <Route path="/reports/export" element={<ExportDataPage />} />

        {/* Admin */}
        <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
        <Route path="/admin/users" element={<UsersRolesPage />} />
        <Route path="/admin/permissions" element={<PermissionsPage />} />
        <Route path="/admin/departments" element={<DepartmentsPage />} />
        <Route path="/admin/tax" element={<TaxConfigurationPage />} />
        <Route path="/admin/penalties" element={<PenaltyRulesPage />} />
        <Route path="/admin/settings" element={<SystemSettingsPage />} />
        <Route path="/admin/integrations" element={<IntegrationsPage />} />
        <Route path="*" element={<LowercaseRedirect />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
