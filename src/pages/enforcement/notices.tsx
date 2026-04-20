import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function LegalNoticesPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Legal Notices</ToolbarPageTitle>
          <ToolbarDescription>Issued legal notices and correspondence</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
