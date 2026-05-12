import { useEffect, useState } from 'react';
import { workflowService } from '../services/workflow.service';
import type { WorkflowStatusRecord } from '@/data/workflow/workflow-status-definitions';

type UseWorkflowResult = {
  statuses: WorkflowStatusRecord[];
  isLoading: boolean;
};

/**
 * Returns the full list of workflow statuses (each with their ordered stages).
 * Swap workflowService.getStatuses() for a real API call when the backend is ready.
 */
export function useWorkflow(): UseWorkflowResult {
  const [statuses, setStatuses] = useState<WorkflowStatusRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    workflowService.getStatuses().then((data) => {
      if (cancelled) return;
      setStatuses(data);
      setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return { statuses, isLoading };
}
