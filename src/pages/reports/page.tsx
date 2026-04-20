import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function ReportsPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Delinquency Summary</ToolbarPageTitle>
          <ToolbarDescription>Overview of delinquent accounts and outstanding balances</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
