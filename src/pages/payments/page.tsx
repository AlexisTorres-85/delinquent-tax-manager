import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription, ToolbarActions } from '@/components/layout/toolbar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function PaymentsPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>All Payments</ToolbarPageTitle>
          <ToolbarDescription>View and manage all payment transactions</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="mono"><Plus /> Record Payment</Button>
        </ToolbarActions>
      </Toolbar>
    </div>
  );
}
