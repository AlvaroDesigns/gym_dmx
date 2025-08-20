import { getCalendar } from '@/app/gen/calendar/calendarService';
import { queryConstants } from '@/config/query';
import { generateQueryKey } from '@/utils/generateQueryKey';
import { useQuery } from '@tanstack/react-query';

export function useGetEvents(params: { startDate: string; endDate: string }) {
  return useQuery({
    queryKey: generateQueryKey('get-events', params.startDate, params.endDate),
    queryFn: () => getCalendar(params),
    staleTime: queryConstants.defaultStaleTime,
  });
}
