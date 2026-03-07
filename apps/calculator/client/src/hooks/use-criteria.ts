import { useQuery } from '@tanstack/react-query';
import { CriteriaData } from '@/lib/score';
import { criteria } from "@sd-standard/standard-core";

export function useCriteria() {
  return useQuery<CriteriaData>({
    queryKey: ['criteria'],
    queryFn: async () => criteria as CriteriaData,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}