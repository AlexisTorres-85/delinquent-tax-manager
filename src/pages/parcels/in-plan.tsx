import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function ParcelsInPlanPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>In Payment Plan</ToolbarPageTitle>
          <ToolbarDescription>Parcels currently enrolled in a payment plan</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
