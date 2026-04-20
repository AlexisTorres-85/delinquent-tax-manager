import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function DefaultedPlansPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Defaulted Plans</ToolbarPageTitle>
          <ToolbarDescription>Payment plans that have defaulted</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
