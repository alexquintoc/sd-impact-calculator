import { useQuery } from '@tanstack/react-query';
import { CriteriaData } from '@/lib/score';

export function useCriteria() {
  return useQuery<CriteriaData>({
    queryKey: ['criteria'],
    queryFn: async () => {
      const res = await fetch('/data/criteria.json');
      if (!res.ok) {
        throw new Error('Failed to fetch criteria data. Ensure /data/criteria.json exists.');
      }
      return res.json();
    },
    staleTime: Infinity, // Data doesn't change during session
    gcTime: Infinity,
  });
}
