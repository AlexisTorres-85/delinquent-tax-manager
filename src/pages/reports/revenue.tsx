import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function RevenueReportsPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Revenue Reports</ToolbarPageTitle>
          <ToolbarDescription>Tax revenue collection reports and summaries</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
