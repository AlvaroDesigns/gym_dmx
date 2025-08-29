import {
  getUsers,
  getUsersPaginated,
  type PaginatedUsersResponse,
} from '@/app/gen/getClients';
import { queryConstants } from '@/config/query';
import { RolesType } from '@/types';
import type { UserData } from '@/types/user';
import { generateQueryKey } from '@/utils/generateQueryKey';
import { useQuery } from '@tanstack/react-query';

interface GetUsersParamsType {
  roles?: RolesType[];
  dni?: string;
  email?: string;
  page?: number;
  pageSize?: number;
}
export function useGetUsers({
  roles = [],
  dni,
  email,
  page,
  pageSize,
}: GetUsersParamsType) {
  const rolesString = roles.length > 0 ? roles.join(',') : '';

  const hasPagination = typeof page === 'number' && typeof pageSize === 'number';

  return useQuery<UserData[] | PaginatedUsersResponse>({
    queryKey: generateQueryKey('get-users', ...roles, dni, email, page, pageSize),
    queryFn: () =>
      hasPagination
        ? getUsersPaginated({
            roles: rolesString,
            dni,
            email,
            page: page!,
            pageSize: pageSize!,
          })
        : getUsers({ roles: rolesString, dni, email }),
    placeholderData: (prev) => prev,
    staleTime: queryConstants.defaultStaleTime,
  });
}
