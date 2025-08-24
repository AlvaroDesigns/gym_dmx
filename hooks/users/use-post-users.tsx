import { postUsers } from '@/app/gen/postClients';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function usePostUsers() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['post-users'],
    mutationFn: postUsers, // (data) => axios.post('/api/users', data)
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] }); // refresca listados
    },
  });
}
