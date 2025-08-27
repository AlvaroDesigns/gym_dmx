'use client';

import { dayjs } from '@/lib/dayjs';
import { format } from 'date-fns/format';
import { getDay } from 'date-fns/getDay';
import { es } from 'date-fns/locale';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { useEffect, useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { toast } from 'sonner';

import type { CalendarEventDto } from '@/app/gen/calendar/calendarService';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
// Removed inline inputs in favor of EditSheetForm
import { TAILWIND_HEX_COLORS } from '@/config/colors';
import { useCreateClass } from '@/hooks/class/use-post-class';
import { useClasses } from '@/hooks/useClasses';
import { ClassData } from '@/types';
import { toIsoDateString } from '@/utils/date';
import { useForm } from 'react-hook-form';
import { Card } from './ui/card';

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface GymCalendarProps {
  data?: CalendarEventDto[];
  onWeekChange?: (startDate: string, endDate: string) => void;
}

type RBCEvent = Event & {
  monitor?: string;
  resource?: {
    room?: string;
    participants?: number;
    maxCapacity?: number;
  };
  color?: string;
  description?: string;
};

export default function GymCalendar({ data, onWeekChange }: GymCalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [openClassForm, setOpenClassForm] = useState(false);

  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today);
  const [currentWeekStart, setCurrentWeekStart] = useState(today.startOf('week'));
  const { loadEvents, refreshEvents, events } = useClasses();
  const createClassMutation = useCreateClass();

  const formClass = useForm<ClassData>({
    defaultValues: {
      name: '',
      description: '',
      maxCapacity: 0,
      room: '',
    },
  });

  const formats = {
    dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) => {
      const startStr = format(start, 'd', { locale: es });
      const endStr = format(end, 'd MMMM yyyy', { locale: es });

      return `${startStr} al ${endStr}`;
    },
    timeGutterFormat: (date: Date) => format(date, 'HH:mm', { locale: es }), // horas del lateral
    eventTimeRangeFormat: () => '',
  };

  const handleCreateClass = (data: ClassData) => {
    createClassMutation.mutate(
      {
        ...data,
      },
      {
        onSuccess: () => {
          toast.success('Clase creada correctamente');
        },
        onError: () => {
          toast.error('Ha ocurrido un error');
        },
      },
    );
  };

  const onSubmitClass = (data: ClassData) => {
    handleCreateClass(data);
    setOpenClassForm(false);
    formClass.reset();
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent || !selectedEvent?.id) return;
    // Aquí podrías implementar delete en la API y luego refrescar
    setSelectedEvent(null);
    setShowDeleteModal(false);
    const startDate = currentWeekStart.format('YYYY-MM-DD');
    const endDate = currentWeekStart.add(6, 'day').format('YYYY-MM-DD');
    refreshEvents(startDate, endDate);
  };

  const handleEditEvent = () => {
    if (!selectedEvent) return;
    const e = selectedEvent as RBCEvent;

    formClass.reset({
      name: (e?.title as string) || '',
      description: e?.description || '',
      room: e?.resource?.room || '',
      maxCapacity: e?.resource?.maxCapacity || 0,
    });

    setShowDeleteModal(false);
    setOpenClassForm(true);
  };

  // Mapear eventos proporcionados por props (useGetEvents) si existen
  const propEvents = useMemo<Event[] | undefined>(() => {
    if (!data) return undefined;
    return data.map((e) => ({
      id: e.id,
      title: e.label,
      start: new Date(`${e.date}T${e.startTime}:00`),
      end: new Date(`${e.date}T${e.endTime}:00`),
      color: e.color,
      description: e.description,
      resource: {
        room: e.room,
        participants: e.participants,
        maxCapacity: e.maxCapacity,
      },
      monitor: e.monitor,
      allDay: false,
    }));
  }, [data]);

  // Cargar eventos automáticamente solo si no se proporcionan por props
  useEffect(() => {
    if (propEvents) return;
    const startDate = currentWeekStart.format('YYYY-MM-DD');
    const endDate = currentWeekStart.add(6, 'day').format('YYYY-MM-DD');
    loadEvents(startDate, endDate);
  }, [currentWeekStart, loadEvents, propEvents]);

  // Si recibimos eventos por props, centrar el calendario en esa semana
  useEffect(() => {
    if (propEvents && propEvents.length > 0) {
      const first = propEvents[0];
      const base = dayjs(first.start as Date).startOf('week');
      if (!base.isSame(currentWeekStart, 'day')) {
        setSelectedDate(base);
        setCurrentWeekStart(base);
      }
    }
  }, [propEvents, currentWeekStart]);

  return (
    <div className="h-full space-y-4">
      <Card className="p-4">
        <Calendar
          localizer={localizer}
          culture="es"
          events={propEvents ?? events ?? []}
          defaultView="week"
          views={['week', 'day']}
          date={selectedDate.toDate()}
          onNavigate={(newDate: Date) => {
            const baseWeek = dayjs(newDate).startOf('week');
            if (baseWeek.isSame(currentWeekStart, 'day')) {
              setSelectedDate(baseWeek);
              return;
            }
            setSelectedDate(baseWeek);
            setCurrentWeekStart(baseWeek);
            const startDate = baseWeek.format('YYYY-MM-DD');
            const endDate = baseWeek.add(6, 'day').format('YYYY-MM-DD');
            onWeekChange?.(startDate, endDate);
          }}
          onSelectEvent={handleSelectEvent}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          formats={formats}
          step={30}
          timeslots={2}
          min={new Date(1970, 1, 1, 6, 0)}
          max={new Date(1970, 1, 1, 23, 30)}
          messages={{
            next: 'Sig.',
            previous: 'Ant.',
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            agenda: 'Agenda',
          }}
          components={{
            event: ({ event }: { event: RBCEvent }) => {
              const monitor = event?.monitor ?? '';
              const time = `${toIsoDateString(event.start, 'HH:mm')} - ${toIsoDateString(event.end, 'HH:mm')}`;

              return (
                <div className="flex flex-col items-left justify-center mt-1">
                  <span className="text-[13px] font-normal opacity-80">{time}</span>
                  <span className=" text-[15px] font-semibold leading-tight">
                    {event.title}
                  </span>
                  {monitor && (
                    <span className="text-[14px] opacity-80 mt-2">{monitor}</span>
                  )}
                </div>
              );
            },
          }}
          eventPropGetter={(event: Event) => {
            const backgroundColor =
              TAILWIND_HEX_COLORS[event.color as keyof typeof TAILWIND_HEX_COLORS] ??
              event.color ??
              '#3b82f6';

            return {
              style: {
                backgroundColor,
                borderRadius: '0',
                color: '#0b1220',
                border: 'none',
                padding: '4px 8px',
                fontWeight: '500',
                fontSize: '0.875rem',
              },
            };
          }}
        />
      </Card>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar clase</DialogTitle>
            <DialogDescription>
              Confirma que deseas eliminar la actividad seleccionada.
            </DialogDescription>
          </DialogHeader>

          <p>
            ¿Estás seguro de que quieres eliminar <strong>{selectedEvent?.title}</strong>?
          </p>

          <div className="flex justify-end gap-4 mt-4">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="outline" onClick={handleEditEvent}>
              Editar
            </Button>
            <Button variant="destructive" onClick={handleDeleteEvent}>
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
