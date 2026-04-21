import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';
import { ParcelsTable } from './parcels-table';

export function ParcelsDelinquentPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Delinquent Only</ToolbarPageTitle>
          <ToolbarDescription>Parcels with outstanding delinquent balances</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>

      <div className="mt-4">
        <ParcelsTable filterStatus="Delinquent" />
      </div>
    </div>
  );
}
