import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function ParcelsSearchPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Search / Lookup</ToolbarPageTitle>
          <ToolbarDescription>Search and look up parcels by owner, address, or parcel ID</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
