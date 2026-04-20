import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription, ToolbarActions } from '@/components/layout/toolbar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function EnforcementPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Foreclosure Cases</ToolbarPageTitle>
          <ToolbarDescription>Manage active foreclosure cases</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="mono"><Plus /> New Case</Button>
        </ToolbarActions>
      </Toolbar>
    </div>
  );
}
