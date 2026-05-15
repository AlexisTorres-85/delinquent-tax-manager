import { useQuery } from '@tanstack/react-query';
import { API_BASE, unwrapApiResponse } from '@/lib/api';

export interface Municipality {
  code: string;
  description: string;
}

async function fetchMunicipalities(): Promise<Municipality[]> {
  const res = await fetch(`${API_BASE}/api/lookup/municipalities`);
  return unwrapApiResponse<Municipality[]>(res);
}

export const MUNICIPALITIES_QUERY_KEY = ['lookup', 'municipalities'] as const;

export function useMunicipalities() {
  const query = useQuery({
    queryKey: MUNICIPALITIES_QUERY_KEY,
    queryFn: fetchMunicipalities,
    staleTime: 1000 * 60 * 30, // 30 minutes — municipalities rarely change
    gcTime: 1000 * 60 * 60,    // keep in cache for 1 hour
  });

  return {
    municipalities: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
