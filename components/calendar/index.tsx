'use client';

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useClasses } from '@/hooks/useClasses';
import { cn } from '@/lib/utils';

import { dayjs } from '@/lib/dayjs';
import { ClassEvent } from '@/types';
import { toIsoDateString } from '@/utils/date';
import 'dayjs/locale/es';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import BookingSheetForm from '../form/BookingSheetForm';
import { Card } from '../ui/card';
import { Input } from '../ui/input';

dayjs.locale('es');

interface DateStripProps {
  classesPerDay?: ClassEvent[];
  darkMode?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export default function DateStripTabs({
  classesPerDay = [],
  darkMode = false,
  minDate = new Date(),
  maxDate = new Date('2025-09-07'),
}: DateStripProps) {
  const today = dayjs();
  const [currentWeekStart, setCurrentWeekStart] = useState(today.startOf('week'));
  const [selectedDate, setSelectedDate] = useState(today);
  const [filter, setFilter] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const { events, loadEvents } = useClasses();

  const monthName = selectedDate.format('MMMM YYYY');

  const weeks = [Array.from({ length: 7 }).map((_, i) => currentWeekStart.add(i, 'day'))];

  const goToPrevWeek = () => {
    const prevWeek = currentWeekStart.subtract(1, 'week');
    // Permitir navegar a semanas anteriores tomando en cuenta minDate, o sin límite si no se pasa
    if (minDate && prevWeek.isBefore(dayjs(minDate).startOf('week'))) {
      setCurrentWeekStart(dayjs(minDate).startOf('week'));
      return;
    }
    setCurrentWeekStart(prevWeek);
  };

  const goToNextWeek = () => {
    const nextWeek = currentWeekStart.add(1, 'week');
    if (maxDate && nextWeek.isAfter(dayjs(maxDate).startOf('week'))) {
      setCurrentWeekStart(dayjs(maxDate).startOf('week'));
      return;
    }
    setCurrentWeekStart(nextWeek);
  };

  // Cargar eventos desde la API
  useEffect(() => {
    const startDate = toIsoDateString(currentWeekStart.toDate());
    const endDate = toIsoDateString(currentWeekStart.add(6, 'day').toDate());
    loadEvents(startDate, endDate);
  }, [currentWeekStart, loadEvents]);

  const mappedEvents: ClassEvent[] = events.map((e) => ({
    id: e.id,
    date: toIsoDateString(e.start),
    label: e.title,
    color: e.color,
    description: e.description,
    room: e.room,
    startTime: dayjs(e.start).format('HH:mm'),
    endTime: dayjs(e.end).format('HH:mm'),
    participants: e.participants,
    maxCapacity: e.maxCapacity,
    monitor: e.monitor,
    participantsList: e.participantsList || [],
  }));

  const selectedDayClasses = classesPerDay
    .concat(mappedEvents)
    .filter((c) => c.date === toIsoDateString(selectedDate.toDate()));

  const filteredClasses = selectedDayClasses.filter((c) => {
    if (!filter) return true;
    const text = filter.toLowerCase();
    return (
      c.label.toLowerCase().includes(text) ||
      (c.description ? c.description.toLowerCase().includes(text) : false)
    );
  });

  const noResultsMessage =
    selectedDayClasses.length === 0
      ? 'No hay clases este día'
      : 'No hay clases que coincidan con el filtro';

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header con navegación */}
      <div className="flex items-center justify-between py-2 px-4 bg-white">
        <button onClick={goToPrevWeek} className="px-2 py-1 rounded hover:bg-gray-100">
          ◀
        </button>
        <span className="text-lg font-bold capitalize">{monthName}</span>
        <button onClick={goToNextWeek} className="px-2 py-1 rounded hover:bg-gray-100">
          ▶
        </button>
      </div>

      {/* Strip de días */}
      <Carousel className="w-full border-b-1">
        <CarouselContent>
          {weeks.map((weekDays, weekIndex) => (
            <CarouselItem key={weekIndex} className="flex justify-center">
              <div
                className={cn(
                  'flex items-center gap-4 px-4 py-2 rounded-2xl',
                  darkMode ? 'bg-[#0f1623] text-white' : 'bg-white text-black shadow-md',
                )}
              >
                {weekDays.map((date, dayIndex) => {
                  const isSelected = selectedDate.isSame(date, 'day');
                  const isWeekend = date.day() === 0 || date.day() === 6;

                  return (
                    <button
                      key={dayIndex}
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        'flex flex-col items-center justify-center w-12 h-16 rounded-xl transition relative',
                        isSelected
                          ? darkMode
                            ? 'bg-gray-200 text-black'
                            : 'bg-primary text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800',
                      )}
                    >
                      <span
                        className={cn(
                          'text-xs font-semibold',
                          isWeekend && 'text-red-500',
                        )}
                      >
                        {date.format('ddd').toUpperCase()}
                      </span>
                      <span className="text-sm">{date.format('DD')}</span>
                    </button>
                  );
                })}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Filtro de clases y botón de añadir */}
      <div className="mt-4 px-4 flex flex-col gap-4">
        <div className="flex relative items-center justify-between">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filtrar clases (p. ej., yoga)"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-background pl-9 h-12"
          />
        </div>

        <div className="text-s text-muted-foreground">
          {filteredClasses.length} resultado(s)
        </div>
      </div>

      {/* Contenido tipo Tabs */}
      <div className="mt-4 px-4 rounded-xl dark:bg-[#0f1623]">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((cls, i) => (
            <BookingSheetForm
              data={cls}
              label={cls.label}
              key={`${cls.date}-${i}`}
              open={openIndex === i}
              setOpen={(o: boolean) => setOpenIndex(o ? i : null)}
            >
              <Card
                className={cn(
                  'p-2 mb-4 rounded-lg text-sm flex justify-center',
                  'px-6 py-2 min-h-16',
                  `${cls.color}`,
                )}
                style={{
                  borderLeftWidth: '8px',
                }}
              >
                <div className="flex flex-row gap-2 justify-between w-full items-start">
                  <div>
                    <span className="text-md leading-none text-muted-foreground mt-2">
                      {cls.startTime && cls.endTime
                        ? `${cls.startTime} - ${cls.endTime}`
                        : '08:00 - 10:00'}
                    </span>
                    <h2 className="text-[20px] leading-none font-semibold uppercase">
                      {cls.label}
                    </h2>
                  </div>
                  {dayjs().isAfter(dayjs(`${cls.date}T${cls.endTime || '10:00'}:00`)) && (
                    <div className="mt-2 flex justify-end gap-2 text-s text-muted-foreground">
                      <div className="bg-gray-200 text-gray-500 dark:bg-gray-200 px-2 py-0.5 rounded-md">
                        Finalizada
                      </div>
                    </div>
                  )}
                </div>
                {cls.description && <p className="mt-1">{cls.description}</p>}
                {cls.participants && cls.maxCapacity && (
                  <div className="mt-2 flex justify-end gap-2 text-s text-muted-foreground">
                    <div className="bg-blue-500 text-white dark:bg-blue-600 px-2 py-0.5 rounded-md">
                      {cls.participants}/{cls.maxCapacity} participantes
                    </div>
                  </div>
                )}
              </Card>
            </BookingSheetForm>
          ))
        ) : (
          <p className="text-gray-500 text-sm">{noResultsMessage}</p>
        )}
      </div>
    </div>
  );
}
