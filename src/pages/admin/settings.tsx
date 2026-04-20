import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function SystemSettingsPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>System Settings</ToolbarPageTitle>
          <ToolbarDescription>Global system configuration and preferences</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
