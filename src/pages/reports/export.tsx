import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function ExportDataPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Export Data</ToolbarPageTitle>
          <ToolbarDescription>Export data to CSV, Excel, or other formats</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
