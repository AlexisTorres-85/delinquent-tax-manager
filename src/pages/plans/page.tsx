import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription, ToolbarActions } from '@/components/layout/toolbar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function PlansPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Active Plans</ToolbarPageTitle>
          <ToolbarDescription>All currently active payment plans</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="mono"><Plus /> Create Plan</Button>
        </ToolbarActions>
      </Toolbar>
    </div>
  );
}
