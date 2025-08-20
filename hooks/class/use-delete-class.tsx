import { deleteClass } from '@/app/gen/class/classService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface DeleteClassData {
  id: string;
}

export function useDeleteClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['delete-class'],
    mutationFn: (data: DeleteClassData) => deleteClass(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['class'] });
    },
  });
}
