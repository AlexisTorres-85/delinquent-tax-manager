import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Activity } from 'lucide-react';
import { AuditLogTable } from './components/audit-log-table';

export function AuditLogsPage() {
  return (
    <ContentWrapper
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Property Parcels', href: '/property-parcels' },
        { label: 'Audit Log', href: '/property-parcels/audit-logs' },
      ]}
      mainHeader={{
        icon: <Activity className="h-6 w-6" />,
        title: 'Audit Log',
        subtitle: 'Chronological record of all changes and events across property parcels',
      }}
      mainClassName="p-0"
      main={<AuditLogTable />}
    />
  );
}
