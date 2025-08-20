import { putClass } from '@/app/gen/class/classService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface PutClassData {
  id: string;
  name?: string;
  description?: string;
  maxCapacity?: number;
  room?: string;
  zoneId?: string | null;
}

export function usePutClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['put-class'],
    mutationFn: (data: PutClassData) => putClass(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['class'] });
    },
  });
}
