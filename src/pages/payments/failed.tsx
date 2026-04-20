import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function FailedPaymentsPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Failed Payments</ToolbarPageTitle>
          <ToolbarDescription>Payments that failed to process</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
