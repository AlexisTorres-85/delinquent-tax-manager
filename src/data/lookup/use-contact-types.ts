import { useQuery } from '@tanstack/react-query';
import { API_BASE, apiFetch } from '@/lib/api';

export interface ContactType {
  id: number;
  name: string;
}

async function fetchContactTypes(): Promise<ContactType[]> {
  return apiFetch<ContactType[]>(`${API_BASE}/api/lookup/contact-types`);
}

export const CONTACT_TYPES_QUERY_KEY = ['lookup', 'contact-types'] as const;

export function useContactTypes() {
  const query = useQuery({
    queryKey: CONTACT_TYPES_QUERY_KEY,
    queryFn: fetchContactTypes,
    staleTime: 1000 * 60 * 30,
    refetchInterval: false,
    gcTime: 1000 * 60 * 60,
  });

  return {
    contactTypes: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
