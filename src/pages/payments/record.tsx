import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function RecordPaymentPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Record Payment</ToolbarPageTitle>
          <ToolbarDescription>Manually record a new payment</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
