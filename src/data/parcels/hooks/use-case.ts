import { useEffect, useState } from 'react';
import { caseService } from '../services/case.service';
import type { CaseStatusRecord } from '@/data/cases/case-status-definitions';

type UseCaseResult = {
  statuses: CaseStatusRecord[];
  isLoading: boolean;
};

/**
 * Returns the full list of case statuses (each with their ordered stages).
 * Swap caseService.getStatuses() for a real API call when the backend is ready.
 */
export function useCase(): UseCaseResult {
  const [statuses, setStatuses] = useState<CaseStatusRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    caseService.getStatuses().then((data) => {
      if (cancelled) return;
      setStatuses(data);
      setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return { statuses, isLoading };
}
