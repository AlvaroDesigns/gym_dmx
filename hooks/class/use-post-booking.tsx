import { postBooking, type PostBookingPayload } from '@/app/gen/bookings/postBooking';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function usePostBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['post-booking'],
    mutationFn: (data: PostBookingPayload) => postBooking(data),
    onSuccess: () => {
      // Invalida eventos del calendario para refrescar participantes
      queryClient.invalidateQueries();
    },
  });
}
