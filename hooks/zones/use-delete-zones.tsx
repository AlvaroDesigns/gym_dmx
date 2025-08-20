import { deleteZones } from '@/app/gen/zones/clientsService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface DeleteZonesData {
  id: string;
}

export function useDeleteZones() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['delete-zones'],
    mutationFn: (data: DeleteZonesData) => deleteZones(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['zones'] });
    },
  });
}
