import { useState } from 'react';
import { catalisService } from '../services/catalis.service';
import type { CatalisParcel, CatalisSearchParams } from '../types';

type UseCatalisSearchResult = {
  results: CatalisParcel[];
  isLoading: boolean;
  hasSearched: boolean;
  search: (params: CatalisSearchParams) => Promise<void>;
  reset: () => void;
};

export function useCatalisSearch(): UseCatalisSearchResult {
  const [results, setResults] = useState<CatalisParcel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  async function search(params: CatalisSearchParams) {
    setIsLoading(true);
    try {
      const data = await catalisService.search(params);
      setResults(data);
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  }

  function reset() {
    setResults([]);
    setHasSearched(false);
  }

  return { results, isLoading, hasSearched, search, reset };
}
