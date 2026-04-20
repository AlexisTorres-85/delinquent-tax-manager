import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function CaseTimelinePage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Case Timeline</ToolbarPageTitle>
          <ToolbarDescription>Chronological view of enforcement case events</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
