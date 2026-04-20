import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function CollectionsWorkflowPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Collections Workflow</ToolbarPageTitle>
          <ToolbarDescription>Manage the end-to-end collections process</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
