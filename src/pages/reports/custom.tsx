import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function CustomReportsPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Custom Reports</ToolbarPageTitle>
          <ToolbarDescription>Build and run custom reports</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
