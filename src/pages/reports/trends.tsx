import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function TaxCollectionTrendsPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Tax Collection Trends</ToolbarPageTitle>
          <ToolbarDescription>Historical trends in tax collection performance</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
