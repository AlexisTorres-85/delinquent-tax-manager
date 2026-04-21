import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';
import { ParcelsTable } from './parcels-table';

export function ParcelsRecentPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Recently Viewed</ToolbarPageTitle>
          <ToolbarDescription>Parcels you have recently accessed</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>

      <div className="mt-4">
        <ParcelsTable />
      </div>
    </div>
  );
}
