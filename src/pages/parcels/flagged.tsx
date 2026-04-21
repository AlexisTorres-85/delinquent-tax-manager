import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';
import { ParcelsTable } from './parcels-table';

export function ParcelsFlaggedPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Flagged Parcels</ToolbarPageTitle>
          <ToolbarDescription>Parcels flagged for review or special attention</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>

      <div className="mt-4">
        <ParcelsTable filterStatus="Flagged" />
      </div>
    </div>
  );
}
