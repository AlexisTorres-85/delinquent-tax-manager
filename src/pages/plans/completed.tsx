import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function CompletedPlansPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Completed Plans</ToolbarPageTitle>
          <ToolbarDescription>Payment plans that have been fully paid off</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
