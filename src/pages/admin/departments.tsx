import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function DepartmentsPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Departments</ToolbarPageTitle>
          <ToolbarDescription>Manage organizational departments and structures</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
