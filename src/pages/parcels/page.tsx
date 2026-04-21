import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription, ToolbarActions } from '@/components/layout/toolbar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ParcelsTable } from './parcels-table';
import { ParcelsStats } from './parcels-stats';

export function ParcelsPage() {
  return (
    <div>
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>All Parcels</ToolbarPageTitle>
          <ToolbarDescription>Browse and manage all parcels</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="mono"><Plus /> Add Parcel</Button>
        </ToolbarActions>
      </Toolbar>

      <div className='flex'>

        <div className='w-1/2'>
          <ParcelsStats />
        </div>

        <div className='w-1/2'><ParcelsTable /></div>

        
      </div>
    </div>
  );
}
