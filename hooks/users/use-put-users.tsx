import { putUsers } from '@/app/gen/putClients';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export type RolesType = 'ADMIN' | 'USER' | 'EMPLOYEE';

export function usePutUsers() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['put-users'],
    mutationFn: putUsers,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
