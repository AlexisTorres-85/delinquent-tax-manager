import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function PenaltyRulesPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Penalty Rules</ToolbarPageTitle>
          <ToolbarDescription>Define and manage penalty and interest rules</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
