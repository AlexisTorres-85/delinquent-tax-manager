import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function CreatePlanPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Create Plan</ToolbarPageTitle>
          <ToolbarDescription>Set up a new payment plan for a parcel</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
