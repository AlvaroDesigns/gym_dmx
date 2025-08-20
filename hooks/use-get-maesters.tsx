import { getMaestres } from '@/app/gen/maesters/getClients';
import { queryConstants } from '@/config/query';
import { generateQueryKey } from '@/utils/generateQueryKey';
import { useQuery } from '@tanstack/react-query';

export function useGetMaestres() {
  return useQuery({
    queryKey: generateQueryKey('get-maesters'),
    queryFn: () => getMaestres(),
    staleTime: queryConstants.defaultStaleTime,
  });
}
