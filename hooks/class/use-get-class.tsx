import { getClass } from '@/app/gen/class/classService';
import { queryConstants } from '@/config/query';
import { generateQueryKey } from '@/utils/generateQueryKey';
import { useQuery } from '@tanstack/react-query';

export function useGetClass() {
  return useQuery({
    queryKey: generateQueryKey('get-class'),
    queryFn: () => getClass(),
    staleTime: queryConstants.defaultStaleTime,
  });
}
