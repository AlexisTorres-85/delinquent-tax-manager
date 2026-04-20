import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function ParcelsForeclosurePage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>In Foreclosure</ToolbarPageTitle>
          <ToolbarDescription>Parcels currently in the foreclosure process</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
