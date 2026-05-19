import { ClipboardList, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageSection } from '@/components/layout/page-section';

const TASKS = [
  { parcel: '12-0045-001', assignedBy: 'Maria Torres', description: 'Legal Description Review' },
  { parcel: '07-1132-004', assignedBy: 'James Okafor', description: 'Payment Plan Verification' },
  { parcel: '03-0289-012', assignedBy: 'Sarah Kim', description: 'Delinquency Status Update' },
  { parcel: '15-0671-008', assignedBy: 'Maria Torres', description: 'In Rem Case Preparation' },
  { parcel: '09-0453-003', assignedBy: 'David Reyes', description: 'Bankruptcy Filing Review' },
];

export function MyAssignedTasks() {
  return (
    <PageSection
      icon={<ClipboardList className="size-4 text-muted-foreground" />}
      title="My Assigned Tasks"
      subtitle="Cases and tasks currently assigned to you."
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-divider ">
            <th className="px-4 pb-4 text-left text-sm font-medium text-black">Parcel</th>
            <th className="px-4 pb-4 text-left text-sm font-medium text-black">Assigned By</th>
            <th className="px-4 pb-4 text-left text-sm font-medium text-black">Description</th>
            <th className="px-4 pb-4" />
          </tr>
        </thead>
        <tbody>
          {TASKS.map((task) => (
            <tr key={task.parcel} className="border-b border-divider last:border-0">
              <td className="py-4 px-4 font-mono text-sm font-medium text-foreground whitespace-nowrap">
                {task.parcel}
              </td>
              <td className="py-4 px-4 text-sm text-muted-foreground whitespace-nowrap">
                {task.assignedBy}
              </td>
              <td className="py-4 px-4 text-sm text-foreground">
                {task.description}
              </td>
              <td className="px-4 text-right whitespace-nowrap">
                <Button variant="outline" size="sm">
                  <ArrowRight />
                  View Task
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageSection>
  );
}
