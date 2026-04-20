import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function InstallmentSchedulesPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Installment Schedules</ToolbarPageTitle>
          <ToolbarDescription>View and manage installment payment schedules</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
