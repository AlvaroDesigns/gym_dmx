import { getUsers } from '@/app/gen/getClients';
import { queryConstants } from '@/config/query';
import { generateQueryKey } from '@/utils/generateQueryKey';
import { useQuery } from '@tanstack/react-query';

export type RolesType = 'ADMIN' | 'USER' | 'EMPLOYEE';

interface GetUsersParamsType {
  roles: RolesType[];
  dni?: string;
}
export function useGetUsers({ roles = [], dni }: GetUsersParamsType) {
  const rolesString = roles.length > 0 ? roles.join(',') : '';

  return useQuery({
    queryKey: generateQueryKey('get-users', ...roles, dni),
    queryFn: () => getUsers({ roles: rolesString, dni }),
    staleTime: queryConstants.defaultStaleTime,
  });
}
