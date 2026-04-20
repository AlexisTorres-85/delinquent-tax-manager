import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function PaymentReconciliationPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Payment Reconciliation</ToolbarPageTitle>
          <ToolbarDescription>Reconcile and verify payment records</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
