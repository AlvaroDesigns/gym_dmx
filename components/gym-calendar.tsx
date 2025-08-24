'use client';

import { format } from 'date-fns/format';
import { getDay } from 'date-fns/getDay';
import { es } from 'date-fns/locale';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { toast } from 'sonner';

import type { CalendarEventDto } from '@/app/gen/calendar/calendarService';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TAILWIND_HEX_COLORS } from '@/config/colors';
import { useClasses } from '@/hooks/useClasses';
import { Card } from './ui/card';

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CLASS = [
  {
    class: 'Trx',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.',
    maxCapacity: 10,
    instructor: 'Diego Mena(ART)',
    room: 'Zona Funcional',
  },
  {
    class: '100% Superior',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.',
    instructor: 'Álvaro Saiz (BOT)',
    maxCapacity: 20,
    room: 'Estudio 1',
  },
  {
    class: 'Gap',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.',
    instructor: 'Javier Sete (BRT)',
    maxCapacity: 20,
    room: 'Zona Funcional',
  },
  {
    class: 'Pialtes',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.',
    instructor: 'Javier Sete (BRT)',
    maxCapacity: 20,
    room: 'Estudio Zen',
  },
  {
    class: 'Cycling',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.',
    instructor: 'Javier Sete (BRT)',
    maxCapacity: 20,
    room: 'Estudio Cycling',
  },
];

interface GymCalendarProps {
  data?: CalendarEventDto[];
}

export default function GymCalendar({ data }: GymCalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [autoOpenDialog, setAutoOpenDialog] = useState(false);

  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today);
  const [currentWeekStart, setCurrentWeekStart] = useState(today.startOf('week'));
  const { isLoading, loadEvents, refreshEvents, events } = useClasses();
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(
    null,
  );
  const [formData, setFormData] = useState({
    title: '',
    instructor: '',
    room: '',
    color: '#3b82f6',
    maxCapacity: 20,
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formats = {
    dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) => {
      const startStr = format(start, 'd', { locale: es });
      const endStr = format(end, 'd MMMM yyyy', { locale: es });

      return `${startStr} al ${endStr}`;
    },
    timeGutterFormat: (date: Date) => format(date, 'HH:mm', { locale: es }), // horas del lateral
    eventTimeRangeFormat: () => '',
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedSlot({ start, end });
    setAutoOpenDialog(true); // Abrir automáticamente el dialog
    setShowAddForm(true);
  };

  // Efecto para abrir automáticamente el dialog cuando se selecciona un slot
  useEffect(() => {
    if (autoOpenDialog && selectedSlot) {
      setShowAddForm(true);
      setAutoOpenDialog(false);
    }
  }, [autoOpenDialog, selectedSlot]);

  const handleAddEvent = async () => {
    if (!formData.title || !selectedSlot) return;

    setIsSubmitting(true);
    try {
      // Crear la clase en la API
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          className: formData.title,
          description: formData.description,
          date: selectedSlot.start.toISOString().split('T')[0],
          startTime: selectedSlot.start.toTimeString().slice(0, 5),
          endTime: selectedSlot.end.toTimeString().slice(0, 5),
          room: formData.room,
          maxCapacity: formData.maxCapacity,
          monitor: formData.instructor,
          difficulty: 'MEDIUM',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al crear la clase');
      }

      // Se recargarán eventos reales desde la API
      const startDate = currentWeekStart.format('YYYY-MM-DD');
      const endDate = currentWeekStart.add(6, 'day').format('YYYY-MM-DD');
      await refreshEvents(startDate, endDate);
      setSelectedSlot(null);
      setFormData({
        title: '',
        instructor: '',
        room: '',
        color: '#3b82f6',
        maxCapacity: 20,
        description: '',
      });

      toast.success('Clase creada exitosamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al crear la clase');
    } finally {
      setIsSubmitting(false);
    }
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
  console.log('propEvents', propEvents);
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
      const base = dayjs(first.start as Date);
      setSelectedDate(base);
      setCurrentWeekStart(base.startOf('week'));
    }
  }, [propEvents]);

  return (
    <div className="h-full space-y-4">
      <Card className="p-4">
        <Calendar
          localizer={localizer}
          events={propEvents ?? events ?? []}
          defaultView="week"
          views={['week', 'day']}
          date={selectedDate.toDate()}
          onNavigate={(newDate) => {
            const base = dayjs(newDate);
            setSelectedDate(base);
            setCurrentWeekStart(base.startOf('week'));
          }}
          selectable
          onSelectSlot={handleSelectSlot}
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
            event: ({ event }: { event: any }) => {
              const monitor = event?.monitor ?? '';
              const time = `${format(event.start, 'HH:mm')} - ${format(event.end, 'HH:mm')}`;
              console.log('events', event);
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
          </DialogHeader>

          <p>
            ¿Estás seguro de que quieres eliminar <strong>{selectedEvent?.title}</strong>?
          </p>

          <div className="flex justify-end gap-4 mt-4">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Cancelar
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
