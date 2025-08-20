import { postClass } from '@/app/gen/class/classService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class'] });
    },
  });
}
