import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDownToLine, ExternalLink, Eye, Maximize2, Minimize2, Search } from 'lucide-react';
import type { CatalisParcel } from '@/data/catalis/types';

function StatusBadge({ status }: { status: string }) {
  const variantMap: Record<string, 'destructive' | 'warning' | 'success' | 'secondary' | 'outline'> = {
    delinquent: 'destructive',
    foreclosure: 'destructive',
    active: 'success',
    exempt: 'outline',
    inactive: 'secondary',
  };
  const variant = variantMap[status.toLowerCase()] ?? 'secondary';
  return <Badge variant={variant}>{status}</Badge>;
}

const thBase = 'h-10 px-4 text-left align-middle font-normal text-accent-foreground text-sm';
const tdBase = 'px-4 py-3 align-middle text-sm';

interface CatalisResultsTableProps {
  results: CatalisParcel[];
  hasSearched: boolean;
  isLoading: boolean;
}

function exportToCsv(results: CatalisParcel[]) {
  const headers = ['Parcel #', 'Owner', 'Address', 'City', 'ZIP', 'County', 'Status', 'Property Type', 'Tax Year', 'Tax Due'];
  const rows = results.map((r) => [
    r.parcelNumber, r.owner, r.address, r.city, r.zip, r.county, r.status, r.propertyType, r.taxYear,
    r.taxDue.toFixed(2),
  ]);
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'catalis-parcels.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function ResultsToolbar({ count, onExport, maximized, onToggleMaximize }: {
  count: number;
  onExport: () => void;
  maximized: boolean;
  onToggleMaximize: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between px-6 py-2 bg-muted/10 border-b border-table-separator"
    >
      <span className="text-xs text-muted-foreground">{count} result{count !== 1 ? 's' : ''} found</span>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" onClick={onExport}>
          <ArrowDownToLine className="h-3.5 w-3.5" />
          Export CSV
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title={maximized ? 'Minimize' : 'Maximize'} onClick={onToggleMaximize}>
          {maximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}

function ResultsTable({ results }: { results: CatalisParcel[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="bg-table-header border-b border-table-separator">
            <th className={`${thBase} pl-6`}>Parcel #</th>
            <th className={thBase}>Owner</th>
            <th className={thBase}>Address</th>
            <th className={thBase}>Status</th>
            <th className={thBase}>Tax Due</th>
            <th className={`${thBase} pr-6 text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {results.map((row) => (
            <tr
              key={row.parcelNumber}
              style={{ borderBottom: '1px solid var(--color-table-separator)' }}
              className="transition-colors"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-table-row-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
            >
              <td className={`${tdBase} pl-6 font-medium`}>{row.parcelNumber}</td>
              <td className={`${tdBase} text-muted-foreground`}>{row.owner}</td>
              <td className={`${tdBase} text-muted-foreground`}>{row.address}, {row.city} {row.zip}</td>
              <td className={tdBase}><StatusBadge status={row.status} /></td>
              <td className={`${tdBase} font-semibold text-destructive`}>
                {row.taxDue === 0 ? (
                  <span className="text-muted-foreground font-normal">—</span>
                ) : (
                  `$${row.taxDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                )}
              </td>
              <td className={`${tdBase} pr-6`}>
                <div className="flex items-center gap-1 justify-end">
                  <Button variant="ghost" size="sm" title="View details"><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" title="Import into system"><ArrowDownToLine className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" title="Open in Catalis"><ExternalLink className="h-4 w-4" /></Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CatalisResultsTable({ results, hasSearched, isLoading }: CatalisResultsTableProps) {
  const [maximized, setMaximized] = useState(false);
  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <div className="px-6 py-2 bg-muted/10" style={{ borderBottom: '1px solid var(--color-table-separator)' }}>
          <Skeleton className="h-3.5 w-28" />
        </div>
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-table-header border-b border-table-separator">
              <th className={`${thBase} pl-6`}>Parcel #</th>
              <th className={thBase}>Owner</th>
              <th className={thBase}>Address</th>
              <th className={thBase}>Status</th>
              <th className={thBase}>Tax Due</th>
              <th className={`${thBase} pr-6 text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--color-table-separator)' }}>
                <td className={`${tdBase} pl-6`}><Skeleton className="h-4 w-28" /></td>
                <td className={tdBase}><Skeleton className="h-4 w-36" /></td>
                <td className={tdBase}><Skeleton className="h-4 w-52" /></td>
                <td className={tdBase}><Skeleton className="h-5 w-20 rounded-md" /></td>
                <td className={tdBase}><Skeleton className="h-4 w-20" /></td>
                <td className={`${tdBase} pr-6`}>
                  <div className="flex justify-end gap-1">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
        <Search className="h-10 w-10 opacity-20" />
        <p className="text-sm">Enter a search query above to find parcels in Catalis.</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2 text-muted-foreground">
        <p className="text-sm font-medium">No parcels found.</p>
        <p className="text-xs">Try adjusting your search criteria or filters.</p>
      </div>
    );
  }

  const maximizedView = maximized
    ? createPortal(
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <ResultsToolbar
            count={results.length}
            onExport={() => exportToCsv(results)}
            maximized={true}
            onToggleMaximize={() => setMaximized(false)}
          />
          <div className="flex-1 overflow-y-auto">
            <ResultsTable results={results} />
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      {maximizedView}
      <div className="flex flex-col h-full">
        <ResultsToolbar
          count={results.length}
          onExport={() => exportToCsv(results)}
          maximized={false}
          onToggleMaximize={() => setMaximized(true)}
        />
        <div className="flex-1 overflow-y-auto">
          <ResultsTable results={results} />
        </div>
      </div>
    </>
  );
}
