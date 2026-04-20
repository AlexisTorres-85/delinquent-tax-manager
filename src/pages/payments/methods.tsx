import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription } from '@/components/layout/toolbar';

export function PaymentMethodsPage() {
  return (
    <div className="p-2.5">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Payment Methods</ToolbarPageTitle>
          <ToolbarDescription>Manage accepted payment methods and configurations</ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>
    </div>
  );
}
