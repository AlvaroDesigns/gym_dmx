import { getMaestresZones } from '@/app/gen/maesters/getClients';
import { queryConstants } from '@/config/query';
import { generateQueryKey } from '@/utils/generateQueryKey';
import { useQuery } from '@tanstack/react-query';

export function useGetMaestresZones() {
  return useQuery({
    queryKey: generateQueryKey('get-maestres-zones'),
    queryFn: () => getMaestresZones(),
    staleTime: queryConstants.defaultStaleTime,
  });
}
