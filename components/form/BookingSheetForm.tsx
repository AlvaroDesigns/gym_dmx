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
  data?: {
    room?: string;
    startTime?: string;
    endTime?: string;
    monitor?: string;
    participantsList?: Array<{
      id: string;
      name: string | null;
      surname: string | null;
      instagram?: string | null;
      tiktok?: string | null;
    }>;
  };
}

export default function BookingSheetForm<T extends FieldValues>({
  fullWidth = false,
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

  console.log('eeeeee', Array.isArray(participantsList) && participantsList.length > 0);
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
          {Array.isArray(participantsList) && participantsList.length > 0 && (
            <div className="px-4 pb-4">
              <h3 className="font-semibold mb-2">Participantes</h3>
              <ul className="flex flex-col gap-3">
                {participantsList.map((p) => (
                  <li key={p.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>
                          {(p.name || p.surname || '?').toString().charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">
                        {[p.name, p.surname].filter(Boolean).join(' ') || 'Sin nombre'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <ParticipantList participantsList={participantsList} />
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

const ParticipantList = ({
  participantsList,
}: {
  participantsList: Array<{
    id: string;
    name: string | null;
    surname: string | null;
    instagram?: string | null;
    tiktok?: string | null;
  }>;
}) => {
  return <div>ParticipantList {participantsList?.length}</div>;
};
