import { postCalendar } from '@/app/gen/calendar/calendarService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function usePostEvents() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['post-events'],
    mutationFn: postCalendar,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
