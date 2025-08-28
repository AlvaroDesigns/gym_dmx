'use client';

import EditSheetForm from '@/components/form/EditSheetForm';
import GymCalendar from '@/components/gym-calendar';
import { ProductLayout } from '@/components/layout/product';
import { RANGE_DAYS_FOR_CALENDAR } from '@/config/configuration';
import { LITERALS } from '@/data/literals';
import { getFieldsModalCalendar } from '@/data/modals';
import { useGetEvents } from '@/hooks/events/use-get-events';
import { usePostEvents } from '@/hooks/events/use-post-events';
import { useGetMaestres } from '@/hooks/use-get-maesters';
import { ClassData, DifficultyType } from '@/types';
import { IconPlus } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type ClassFormValues = Omit<ClassData, 'name'> & {
  className: string;
  startTime: string;
  endTime: string;
  monitor: string;
  difficulty: DifficultyType;
  date: string;
};

export default function Page() {
  const [openCalendarForm, setOpenCalendarForm] = useState(false);

  const { data } = useGetMaestres();

  const createCalendarMutation = usePostEvents();
  const fields = getFieldsModalCalendar(data);

  const [dateRange, setDateRange] = useState(() => {
    const start = dayjs().startOf('week');
    const end = start.add(RANGE_DAYS_FOR_CALENDAR, 'day');

    return {
      startDate: start.format('YYYY-MM-DD'),
      endDate: end.format('YYYY-MM-DD'),
    };
  });

  const { data: events, isLoading } = useGetEvents({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const handleWeekChange = (start: string, end: string) => {
    setDateRange({ startDate: start, endDate: end });
  };

  const formClass = useForm<ClassFormValues>({
    defaultValues: {
      className: 'Cycling',
      description: '',
      startTime: '09:00',
      endTime: '10:00',
      room: 'Estudio 1',
      maxCapacity: 20,
      monitor: '',
      difficulty: 'MEDIUM',
      date: '2025-08-19',
    },
  });

  const handleCreateClass = (data: ClassFormValues) => {
    createCalendarMutation.mutate(
      {
        ...data,
        maxCapacity: Number(data.maxCapacity),
      },
      {
        onSuccess: () => {
          toast.success(`${LITERALS.CLASS} ${LITERALS.MESSAGES.CREATE}`);
        },
        onError: () => {
          toast.error(LITERALS.MESSAGES.ERROR);
        },
      },
    );
  };

  const onSubmitClass = (data: ClassFormValues) => {
    handleCreateClass(data);
    setOpenCalendarForm(false);

    formClass.reset();
  };

  return (
    <ProductLayout
      buttonProps={{ text: 'Añadir actividades', routingUri: 'custom', type: 'class' }}
      isView={false}
      isLoading={isLoading}
      customButton={
        <EditSheetForm
          open={openCalendarForm}
          setOpen={setOpenCalendarForm}
          form={formClass}
          onSubmit={onSubmitClass}
          sizeButton="sm"
          startButtonContent={<IconPlus />}
          triggerText="Añadir actividades"
          title="Crear nueva actividad"
          description="Añade una nueva actividad. Completa los campos y guarda los cambios."
          fields={fields}
        />
      }
    >
      <GymCalendar data={events ?? []} onWeekChange={handleWeekChange} />
    </ProductLayout>
  );
}
