import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function TaxConfigurationPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Tax Configuration</ToolbarPageTitle>
          <ToolbarDescription>Configure tax rates, codes, and billing rules</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
