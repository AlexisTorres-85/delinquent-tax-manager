import { Toolbar, ToolbarHeading, ToolbarPageTitle, ToolbarDescription, ToolbarActions } from '@/components/layout/toolbar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function DashboardPage() {
  return (
    <div className="flex h-full min-h-0">
  {/* Main dashboard area */}
  <main className="flex flex-1 min-w-0 flex-col">
    {/* Header / hero */}
    <section className="rounded-tl-2xl bg-muted/50 border-b border-divider p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Today’s delinquent tax activity, workflow queues, and payment alerts.
          </p>
        </div>

        <button className="rounded-md bg-app-primary px-4 py-2 text-sm font-medium text-white">
          Refresh Catalis Data
        </button>
      </div>

      {/* KPI cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-background p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Active Delinquent Cases</p>
          <p className="mt-2 text-3xl font-semibold">248</p>
        </div>

        <div className="rounded-xl border bg-background p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Payment Plans</p>
          <p className="mt-2 text-3xl font-semibold">42</p>
        </div>

        <div className="rounded-xl border bg-background p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">County Clerk Queue</p>
          <p className="mt-2 text-3xl font-semibold">16</p>
        </div>

        <div className="rounded-xl border bg-background p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Auction Queue</p>
          <p className="mt-2 text-3xl font-semibold">9</p>
        </div>
      </div>
    </section>

    {/* Content */}
    <section className="grid flex-1 min-h-0 grid-cols-1 gap-6 overflow-auto p-6 xl:grid-cols-3">
      {/* Left / main content */}
      <div className="xl:col-span-2 space-y-6">
        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <h2 className="font-semibold">Workflow Queues</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-lg border p-4">Planning & Development Review</div>
            <div className="rounded-lg border p-4">County Clerk Submissions</div>
            <div className="rounded-lg border p-4">Missed Payment Plans</div>
            <div className="rounded-lg border p-4">Legal Reviews</div>
          </div>
        </div>

        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <h2 className="font-semibold">Recently Updated Parcels</h2>
          <div className="mt-4 text-sm text-muted-foreground">
            Parcel activity table goes here.
          </div>
        </div>
      </div>

      {/* Right rail */}
      <aside className="space-y-6">
        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <h2 className="font-semibold">Alerts</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div>5 missed payments need review</div>
            <div>3 legal reviews overdue</div>
            <div>7 parcels ready for clerk submission</div>
          </div>
        </div>

        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <h2 className="font-semibold">Quick Actions</h2>
          <div className="mt-4 grid gap-2">
            <button className="rounded-md border px-3 py-2 text-left text-sm">
              Search Parcel
            </button>
            <button className="rounded-md border px-3 py-2 text-left text-sm">
              Open County Clerk Queue
            </button>
            <button className="rounded-md border px-3 py-2 text-left text-sm">
              View Payment Plans
            </button>
          </div>
        </div>
      </aside>
    </section>
  </main>
</div>
  );
}
