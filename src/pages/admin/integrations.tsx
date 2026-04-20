import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function IntegrationsPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Integrations</ToolbarPageTitle>
          <ToolbarDescription>Manage third-party integrations and API connections</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
