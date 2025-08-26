import {
  deleteBooking,
  type DeleteBookingPayload,
} from '@/app/gen/bookings/deleteBooking';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['delete-booking'],
    mutationFn: (data: DeleteBookingPayload) => deleteBooking(data),
    onSuccess: () => {
      // Refrescar calendario/listas relacionadas tras cancelar la reserva
      qc.invalidateQueries();
    },
  });
}
