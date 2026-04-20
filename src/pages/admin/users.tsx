import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription, ToolbarActions } from '@/components/layout/toolbar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function UsersRolesPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Users & Roles</ToolbarPageTitle>
          <ToolbarDescription>Manage system users and role assignments</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="mono"><Plus /> Add User</Button>
        </ToolbarActions>
      </Toolbar>
    </div>
  );
}
