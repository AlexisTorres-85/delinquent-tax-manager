import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function PendingPaymentsPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Pending Payments</ToolbarPageTitle>
          <ToolbarDescription>Payments awaiting processing or confirmation</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
