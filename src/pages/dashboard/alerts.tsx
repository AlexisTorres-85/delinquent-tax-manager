import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function AlertsPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Alerts</ToolbarPageTitle>
          <ToolbarDescription>System alerts and notifications</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
