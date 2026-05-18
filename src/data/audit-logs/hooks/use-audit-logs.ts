import { useQuery } from '@tanstack/react-query';
import { auditLogService } from '../services/audit-log.service';

export const AUDIT_LOGS_QUERY_KEY = ['audit-logs'] as const;

export function useAuditLogs() {
  const query = useQuery({
    queryKey: AUDIT_LOGS_QUERY_KEY,
    queryFn: () => auditLogService.getAll(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    entries: query.data ?? [],
    isLoading: query.isLoading,
  };
}
