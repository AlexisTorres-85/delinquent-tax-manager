import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription, ToolbarActions } from '@/components/layout/toolbar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function DashboardPage() {
  return (
    <div className="p-2.5">
        <div className='bg-white p-4 rounded-lg border border-border'>
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Dashboard</ToolbarPageTitle>
          <ToolbarDescription>Welcome to the DTM dashboard</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="mono"><Plus /> New</Button>
        </ToolbarActions>
      </Toolbar>
    </div>
    </div>
  );
}
