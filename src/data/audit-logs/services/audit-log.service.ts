/**
 * Audit Log Service
 *
 * All audit log data access goes through here.
 * Currently uses dummy data — replace `getAll()` and `search()` with real
 * HTTP calls when the API is available. Hooks above this layer need no changes.
 */

import type { AuditLogEntry, AuditLogSearchParams } from '../types';
import { AUDIT_LOG_DUMMY_DATA } from '../data/audit-log-dummy-data';

function normalize(s: string) {
  return s.toLowerCase().trim();
}

async function getAll(): Promise<AuditLogEntry[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...AUDIT_LOG_DUMMY_DATA];
}

async function search(params: AuditLogSearchParams): Promise<AuditLogEntry[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return AUDIT_LOG_DUMMY_DATA.filter((entry) => {
    if (params.query) {
      const q = normalize(params.query);
      const matches =
        normalize(entry.parcelNumber).includes(q) ||
        normalize(entry.action).includes(q) ||
        normalize(entry.user).includes(q);
      if (!matches) return false;
    }

    if (params.parcelNumber && !normalize(entry.parcelNumber).includes(normalize(params.parcelNumber))) {
      return false;
    }

    if (params.user && entry.user !== params.user) {
      return false;
    }

    if (params.type && entry.type !== params.type) {
      return false;
    }

    if (params.dateFrom && entry.timestamp < params.dateFrom) {
      return false;
    }

    if (params.dateTo && entry.timestamp > params.dateTo + 'T23:59:59Z') {
      return false;
    }

    return true;
  });
}

export const auditLogService = { getAll, search };
