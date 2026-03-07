import { useQuery } from '@tanstack/react-query';
import { CriteriaData } from '@/lib/score';
import { criteria } from '../../../../../packages/standard-core/src';

export function useCriteria() {
  return useQuery<CriteriaData>({
    queryKey: ['criteria'],
    queryFn: async () => criteria as CriteriaData,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}