import { getUsers } from '@/app/gen/getClients';
import { queryConstants } from '@/config/query';
import { RolesType } from '@/types';
import { generateQueryKey } from '@/utils/generateQueryKey';
import { useQuery } from '@tanstack/react-query';

interface GetUsersParamsType {
  roles?: RolesType[];
  dni?: string;
  email?: string;
}
export function useGetUsers({ roles = [], dni, email }: GetUsersParamsType) {
  const rolesString = roles.length > 0 ? roles.join(',') : '';

  return useQuery({
    queryKey: generateQueryKey('get-users', ...roles, dni, email),
    queryFn: () => getUsers({ roles: rolesString, dni, email }),
    staleTime: queryConstants.defaultStaleTime,
  });
}
