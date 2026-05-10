import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SelectContent, SelectField, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuditLogs } from '@/data/audit-logs/hooks/use-audit-logs';
import { Skeleton } from '@/components/ui/skeleton';
import type { AuditActionType, AuditLogEntry } from '@/data/audit-logs/types';
import { X } from 'lucide-react';

const typeBadgeVariant: Record<AuditActionType, 'destructive' | 'warning' | 'success' | 'secondary' | 'outline' | 'default'> = {
  Status:  'outline',
  Stage:   'secondary',
  Flag:    'destructive',
  Payment: 'success',
  System:  'default',
  Note:    'warning',
};

function formatTimestamp(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short', day: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

const ACTION_TYPES: AuditActionType[] = ['Status', 'Stage', 'Flag', 'Payment', 'System', 'Note'];

const thBase = 'h-10 px-4 text-left align-middle font-normal text-accent-foreground text-sm whitespace-nowrap';
const tdBase = 'px-4 py-3 align-middle text-sm';

export function AuditLogTable() {
  const { entries, isLoading } = useAuditLogs();
  const [search, setSearch] = useState('');
  const [filterParcel, setFilterParcel] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const uniqueUsers = useMemo(
    () => [...new Set(entries.map((e) => e.user))].sort(),
    [entries],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return entries.filter((entry) => {
      if (q && !entry.parcelNumber.toLowerCase().includes(q) &&
          !entry.action.toLowerCase().includes(q) &&
          !entry.user.toLowerCase().includes(q)) return false;
      if (filterParcel && !entry.parcelNumber.toLowerCase().includes(filterParcel.toLowerCase())) return false;
      if (filterUser && entry.user !== filterUser) return false;
      if (filterType && entry.type !== filterType) return false;
      if (filterDateFrom && entry.timestamp < filterDateFrom) return false;
      if (filterDateTo && entry.timestamp > filterDateTo + 'T23:59:59Z') return false;
      return true;
    });
  }, [entries, search, filterParcel, filterUser, filterType, filterDateFrom, filterDateTo]);

  const hasFilters = search || filterParcel || filterUser || filterType || filterDateFrom || filterDateTo;

  function clearFilters() {
    setSearch('');
    setFilterParcel('');
    setFilterUser('');
    setFilterType('');
    setFilterDateFrom('');
    setFilterDateTo('');
  }

  return (
    <div className="flex flex-col h-full">
      {/* Filter bar */}
      <div className="px-6 py-4 border-b border-divider">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <Input
              label="Search"
              labelVariant="primary"
              placeholder="Search parcel, user, or action…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-44">
            <Input
              label="Parcel #"
              labelVariant="primary"
              placeholder="Filter by parcel"
              value={filterParcel}
              onChange={(e) => setFilterParcel(e.target.value)}
            />
          </div>
          <div className="w-48">
            <SelectField
              label="User / Source"
              labelVariant="primary"
              value={filterUser}
              onValueChange={(v) => setFilterUser(v === 'all' ? '' : (v ?? ''))}
            >
              <SelectTrigger><SelectValue placeholder="All Users" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {uniqueUsers.map((u) => (
                  <SelectItem key={u} value={u}>{u}</SelectItem>
                ))}
              </SelectContent>
            </SelectField>
          </div>
          <div className="w-40">
            <SelectField
              label="Action Type"
              labelVariant="primary"
              value={filterType}
              onValueChange={(v) => setFilterType(v === 'all' ? '' : (v ?? ''))}
            >
              <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {ACTION_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </SelectField>
          </div>
          <div className="w-36">
            <Input
              label="Date From"
              labelVariant="primary"
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
            />
          </div>
          <div className="w-36">
            <Input
              label="Date To"
              labelVariant="primary"
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
            />
          </div>
          {hasFilters && (
            <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-muted-foreground" onClick={clearFilters}>
              <X className="h-3.5 w-3.5" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Result count */}
      <div
        className="px-6 py-2 bg-muted/10 text-xs text-muted-foreground border-b border-divider"
      >
        {isLoading ? <Skeleton className="h-3.5 w-24" /> : `${filtered.length} entr${filtered.length !== 1 ? 'ies' : 'y'}`}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-table-header border-b border-table-separator">
              <th className={`${thBase} pl-6`}>Timestamp</th>
              <th className={thBase}>Parcel #</th>
              <th className={thBase}>Action</th>
              <th className={thBase}>Type</th>
              <th className={thBase}>Old Value</th>
              <th className={thBase}>New Value</th>
              <th className={thBase}>User / Source</th>
              <th className={`${thBase} pr-6`}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-table-separator)' }}>
                  <td className={`${tdBase} pl-6`}><Skeleton className="h-4 w-36" /></td>
                  <td className={tdBase}><Skeleton className="h-4 w-32" /></td>
                  <td className={tdBase}><Skeleton className="h-4 w-36" /></td>
                  <td className={tdBase}><Skeleton className="h-5 w-16 rounded-md" /></td>
                  <td className={tdBase}><Skeleton className="h-4 w-24" /></td>
                  <td className={tdBase}><Skeleton className="h-4 w-24" /></td>
                  <td className={tdBase}><Skeleton className="h-4 w-32" /></td>
                  <td className={`${tdBase} pr-6`}><Skeleton className="h-4 w-40" /></td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center text-sm text-muted-foreground">
                  No entries match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((entry: AuditLogEntry) => (
                <tr
                  key={entry.id}
                  style={{ borderBottom: '1px solid var(--color-table-separator)' }}
                  className="transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-table-row-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                >
                  <td className={`${tdBase} pl-6 whitespace-nowrap text-muted-foreground`}>
                    {formatTimestamp(entry.timestamp)}
                  </td>
                  <td className={`${tdBase} font-medium whitespace-nowrap`}>{entry.parcelNumber}</td>
                  <td className={tdBase}>{entry.action}</td>
                  <td className={tdBase}>
                    <Badge variant={typeBadgeVariant[entry.type]}>{entry.type}</Badge>
                  </td>
                  <td className={`${tdBase} text-muted-foreground`}>{entry.oldValue}</td>
                  <td className={`${tdBase} font-medium`}>{entry.newValue}</td>
                  <td className={`${tdBase} text-muted-foreground whitespace-nowrap`}>{entry.user}</td>
                  <td className={`${tdBase} pr-6 text-muted-foreground max-w-[240px] truncate`}>
                    {entry.notes ?? '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
