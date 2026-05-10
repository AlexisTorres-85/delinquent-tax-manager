import { useEffect, useState } from 'react';
import { auditLogService } from '../services/audit-log.service';
import type { AuditLogEntry } from '../types';

type UseAuditLogsResult = {
  entries: AuditLogEntry[];
  isLoading: boolean;
};

export function useAuditLogs(): UseAuditLogsResult {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    auditLogService.getAll().then((data) => {
      if (!cancelled) {
        setEntries(data);
        setIsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  return { entries, isLoading };
}
