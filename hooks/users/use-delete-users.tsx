import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUsers } from '../../app/gen/deleteClients';

interface DeleteUserData {
  id: string;
}

export function useDeleteUsers() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['delete-users'],
    mutationFn: (data: DeleteUserData) => deleteUsers(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
