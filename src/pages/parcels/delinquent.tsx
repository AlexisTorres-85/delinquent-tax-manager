import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function ParcelsDelinquentPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Delinquent Only</ToolbarPageTitle>
          <ToolbarDescription>Parcels with outstanding delinquent balances</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
