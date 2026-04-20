import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function EscalationsPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Escalations</ToolbarPageTitle>
          <ToolbarDescription>Cases that have been escalated for priority action</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
