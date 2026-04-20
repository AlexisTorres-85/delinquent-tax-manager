import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function PermissionsPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Permissions</ToolbarPageTitle>
          <ToolbarDescription>Configure role-based access permissions</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
