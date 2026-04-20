import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function TodayActivityPage() {
  return (
    <div className="p-2.5 bg-white">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Today Activity</ToolbarPageTitle>
          <ToolbarDescription>All activity recorded for today</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
