import { getZones } from '@/app/gen/zones/clientsService';
import { queryConstants } from '@/config/query';
import { generateQueryKey } from '@/utils/generateQueryKey';
import { useQuery } from '@tanstack/react-query';

export function useGetZones() {
  return useQuery({
    queryKey: generateQueryKey('get-zones'),
    queryFn: () => getZones(),
    staleTime: queryConstants.defaultStaleTime,
  });
}
