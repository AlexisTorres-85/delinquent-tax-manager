import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function LiensPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Liens</ToolbarPageTitle>
          <ToolbarDescription>Manage tax liens on properties</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
