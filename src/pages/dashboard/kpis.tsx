import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function PerformanceKpisPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Performance KPIs</ToolbarPageTitle>
          <ToolbarDescription>Key performance indicators and metrics</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
