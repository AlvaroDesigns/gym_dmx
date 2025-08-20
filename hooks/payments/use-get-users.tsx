import { getPayments } from '@/app/gen/getPayments';
import { queryConstants } from '@/config/query';
import { generateQueryKey } from '@/utils/generateQueryKey';
import { useQuery } from '@tanstack/react-query';

export function useGetPayments() {
  return useQuery({
    queryKey: generateQueryKey('get-payments'),
    queryFn: () => getPayments(),
    staleTime: queryConstants.defaultStaleTime,
  });
}
