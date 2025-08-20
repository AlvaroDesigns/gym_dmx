'use client';
import DateStrip from '@/components/calendar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import dayjs from 'dayjs';

import { FieldValues, Path } from 'react-hook-form';

import { useGetEvents } from '@/hooks/events/use-get-events';
import { useMemo, useState } from 'react';

type FieldOption = {
  value: string;
  label: string;
};

// Ahora FieldConfig recibe T
type FieldConfig<T extends FieldValues> =
  | {
      type: 'text' | 'textarea';
      name: Path<T>;
      label: string;
      placeholder?: string;
      defaultValue?: string;
    }
  | {
      type: 'select';
      name: Path<T>;
      label: string;
      placeholder?: string;
      options: FieldOption[];
    }
  | {
      type: 'slider';
      name: Path<T>;
      label: string;
      defaultValue?: number[];
      max?: number;
      step?: number;
      suffix?: string;
    };

export interface EditSheetFormProps<T extends FieldValues = FieldValues> {
  open?: boolean; // ahora opcional
  children: React.ReactNode;
  fullWidth?: boolean;
  setOpen?: (open: boolean) => void; // ahora opcional
  onSubmit?: (data: T) => void;
  fields?: FieldConfig<T>[]; // opcional y no usado por ahora
  label?: string; // opcional
}

const COLORS = [
  'bg-green-500 text-white',
  'bg-yellow-500 text-black',
  'bg-red-500 text-white',
  'bg-blue-500 text-white',
  'bg-purple-500 text-white',
  'bg-pink-500 text-white',
  'bg-gray-500 text-white',
  'bg-neutral-500 text-white',
  'bg-stone-500 text-white',
  'bg-emerald-500 text-white',
  'bg-teal-500 text-white',
  'bg-cyan-500 text-white',
  'bg-sky-500 text-white',
  'bg-lime-500 text-white',
  'bg-rose-500 text-white',
  'bg-fuchsia-500 text-white',
  'bg-amber-500 text-black',
  'bg-red-500 text-white',
  'bg-green-500 text-white',
];

export default function DateSheetForm<T extends FieldValues>({
  fullWidth = false,
  children,
  open,
  setOpen,
  label,
}: EditSheetFormProps<T>) {
  // Modo controlado si se pasan open y setOpen; si no, modo no controlado con estado interno
  const isControlled = typeof open === 'boolean' && typeof setOpen === 'function';
  const [internalOpen, setInternalOpen] = useState(false);
  const actualOpen = isControlled ? (open as boolean) : internalOpen;

  const { startDate, endDate } = useMemo(() => {
    const start = dayjs().startOf('week');
    const end = start.add(6, 'day');
    return {
      startDate: start.format('YYYY-MM-DD'),
      endDate: end.format('YYYY-MM-DD'),
    };
  }, []);

  const { data, isLoading, error } = useGetEvents({ startDate, endDate });
  console.log(data);
  const handleOpenChange = (nextOpen: boolean) => {
    if (isControlled) {
      (setOpen as (o: boolean) => void)(nextOpen);
    } else {
      setInternalOpen(nextOpen);
    }
  };

  return (
    <Sheet open={actualOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent className={fullWidth ? 'w-full max-w-lg' : ''}>
        <SheetHeader>
          <SheetTitle>{label}</SheetTitle>
        </SheetHeader>
        <DateStrip
          classesPerDay={data?.map((cls, index) => ({
            id: `${cls.date}-${index}`,
            color: COLORS[index % COLORS.length],
            date: dayjs(cls.date).format('YYYY-MM-DD'),
            label: cls.label,
            participants: cls.participants,
            maxCapacity: cls.maxCapacity,
            startTime: cls.startTime,
            endTime: cls.endTime,
          }))}
        />
      </SheetContent>
    </Sheet>
  );
}
