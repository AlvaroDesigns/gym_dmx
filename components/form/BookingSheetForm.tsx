'use client';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Image from 'next/image';

import { FieldValues, Path } from 'react-hook-form';

import type { ClassEvent } from '@/types';
import { ClockIcon, MapPinIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { AspectRatio } from '../ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';

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
  children: ReactNode;
  fullWidth?: boolean;
  setOpen?: (open: boolean) => void; // ahora opcional
  onSubmit?: (data: T) => void;
  fields?: FieldConfig<T>[]; // opcional y no usado por ahora
  label?: string; // opcional
  data?: Pick<
    ClassEvent,
    'room' | 'startTime' | 'endTime' | 'monitor' | 'participantsList'
  >;
}

export default function BookingSheetForm<T extends FieldValues>({
  children,
  open,
  setOpen,
  label,
  data,
}: EditSheetFormProps<T>) {
  // Modo controlado si se pasan open y setOpen; si no, modo no controlado con estado interno
  const isControlled = typeof open === 'boolean' && typeof setOpen === 'function';
  const [internalOpen, setInternalOpen] = useState(false);
  const actualOpen = isControlled ? (open as boolean) : internalOpen;

  const { room, endTime, startTime, monitor, participantsList } = data || {};

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

      <SheetContent>
        <SheetHeader>
          <SheetTitle>{label}</SheetTitle>
        </SheetHeader>
        <AspectRatio ratio={16 / 9} className="bg-muted">
          <Image
            src="https://dmxgym.com/wp-content/uploads/2024/05/trx.png"
            alt="Photo by Drew Beamer"
            fill
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </AspectRatio>
        <div>
          <div className="flex flex-col gap-4 px-4 md:gap-6 md:py-6">
            <div className="flex gap-4 items-center">
              <div className="flex gap-4 items-center">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>{monitor?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <span className="text-[16px] leading-none font-semibold">
                    {monitor}
                  </span>
                  <div className="flex flex-row items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-black" />
                    <span className="text-md leading-none text-muted-foreground">
                      {startTime} - {endTime}
                    </span>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <MapPinIcon className="w-5 h-5 text-black" />
                    <span className="text-md leading-none text-muted-foreground">
                      {room}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Separator className="my-4" />

          <ParticipantList participantsList={data?.participantsList} />
        </div>

        <SheetFooter>
          <Button className="h-12" type="submit">
            Reservar
          </Button>
          <SheetClose asChild>
            <Button className="h-12" variant="outline" disabled>
              Cancelar
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const ParticipantList = ({ participantsList }: Pick<ClassEvent, 'participantsList'>) => {
  const list = Array.isArray(participantsList) ? participantsList : [];

  if (list.length === 0) return null;

  return (
    <div className="px-4 pb-4">
      <ul className="grid grid-cols-4 gap-3">
        {list.map((p) => (
          <li key={p.id} className="flex items-center justify-center">
            <Avatar
              className="h-12 w-12"
              title={[p.name, p.surname].filter(Boolean).join(' ') || 'Sin nombre'}
            >
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>
                {(p.name || p.surname || '?').toString().charAt(0)}
              </AvatarFallback>
            </Avatar>
          </li>
        ))}
      </ul>
    </div>
  );
};
