import { getCalendar, type CalendarEventDto } from '@/app/gen/calendar/calendarService';
import { useCallback, useState } from 'react';
import type { Event as RBCEvent } from 'react-big-calendar';

type ClassEvent = RBCEvent & {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  color?: string;
  description?: string;
  room?: string;
  participants?: number;
  maxCapacity?: number;
  monitor?: string;
  participantsList?: Array<{
    id: string;
    name: string | null;
    surname: string | null;
    instagram?: string | null;
    tiktok?: string | null;
  }>;
};

export function useClasses() {
  const [events, setEvents] = useState<ClassEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadEvents = useCallback(async (startDate: string, endDate: string) => {
    setIsLoading(true);
    try {
      const data = await getCalendar({ startDate, endDate });
      const mapped: ClassEvent[] = data.map((e: CalendarEventDto) => {
        const start = new Date(`${e.date}T${e.startTime}:00`);
        const end = new Date(`${e.date}T${e.endTime}:00`);

        return {
          ...e,
          id: e.id,
          title: e.label,
          description: e.description,
          color: e.color,
          room: e.room,
          participants: e.participants,
          maxCapacity: e.maxCapacity,
          participantsList: e.participantsList,
          allDay: false,
          start,
          end,
        };
      });
      setEvents(mapped);
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshEvents = useCallback(
    async (startDate: string, endDate: string) => {
      await loadEvents(startDate, endDate);
    },
    [loadEvents],
  );

  return {
    events,
    isLoading,
    loadEvents,
    refreshEvents,
  };
}
