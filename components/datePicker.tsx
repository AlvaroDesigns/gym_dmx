'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { dayjs } from '@/lib/dayjs';
import { formatDisplayDate, isValidDate, toIsoDateString } from '@/utils/date';

import { CalendarIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface CalendarProps {
  id: string;
  placeholder: string;
  value: string; // expected format: YYYY-MM-DD
  onChange: (value: string) => void; // emits YYYY-MM-DD
  className?: string;
  maxDate?: Date;
  minDate?: Date;
}

export function DatePicker({
  id,
  placeholder,
  value,
  onChange,
  className,
  maxDate,
  minDate = dayjs().toDate(),
}: CalendarProps) {
  const [open, setOpen] = useState(false);
  const initialDate = useMemo(() => (value ? new Date(value) : undefined), [value]);
  const [date, setDate] = useState<Date | undefined>(
    isValidDate(initialDate) ? initialDate : undefined,
  );
  const [month, setMonth] = useState<Date | undefined>(date);
  const [displayValue, setDisplayValue] = useState<string>(formatDisplayDate(date));
  const todayStart = useMemo(() => dayjs().startOf('day').toDate(), []);

  useEffect(() => {
    const parsed = value ? new Date(value) : undefined;
    if (isValidDate(parsed)) {
      setDate(parsed);
      setMonth(parsed);
      setDisplayValue(formatDisplayDate(parsed));
    } else if (!value) {
      setDate(undefined);
      setDisplayValue('');
    }
  }, [value]);

  return (
    <div
      className="relative flex gap-2"
      onMouseDownCapture={(e) => e.stopPropagation()}
      onTouchStartCapture={(e) => e.stopPropagation()}
    >
      <Input
        id={id}
        value={displayValue}
        placeholder={placeholder}
        className={`bg-background pr-10 ${className ?? ''}`}
        onChange={(e) => {
          const typed = e.target.value;

          setDisplayValue(typed);
          const parsed = new Date(typed);
          if (isValidDate(parsed)) {
            if (parsed < todayStart) {
              return;
            }
            setDate(parsed);
            setMonth(parsed);
            onChange(toIsoDateString(parsed));
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
          }
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }
        }}
      />
      <Button
        id={`${id}-picker`}
        type="button"
        variant="ghost"
        className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
        onClick={() => setOpen((v) => !v)}
      >
        <CalendarIcon className="size-3.5" />
        <span className="sr-only">Select date</span>
      </Button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-auto overflow-hidden rounded-md border bg-white p-0 shadow-md"
          onMouseDownCapture={(e) => e.stopPropagation()}
          onTouchStartCapture={(e) => e.stopPropagation()}
        >
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            month={month}
            disabled={{ before: minDate, after: maxDate }}
            onMonthChange={setMonth}
            onSelect={(selected) => {
              if (!selected) return;

              setDate(selected);
              setDisplayValue(formatDisplayDate(selected));
              onChange(toIsoDateString(selected));
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
