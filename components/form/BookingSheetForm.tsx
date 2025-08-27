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

import { GenericDrawer } from '@/components/generic-drawer';
import { AvatarSections } from '@/components/sections/avatar-sections';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { LITERALS } from '@/data/literals';
import { useDeleteBooking } from '@/hooks/class/use-delete-booking';
import { usePostBooking } from '@/hooks/class/use-post-booking';
import { useGetUsers } from '@/hooks/users/use-get-users';
import { dayjs } from '@/lib/dayjs';
import type { ClassEvent } from '@/types';
import { IconBrandInstagram, IconBrandTiktok } from '@tabler/icons-react';
import { ClockIcon, MapPinIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

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
  classId: string; // id de la clase para reservar
  data?: Pick<
    ClassEvent,
    'room' | 'date' | 'startTime' | 'endTime' | 'monitor' | 'participantsList'
  >;
}

export default function BookingSheetForm<T extends FieldValues>({
  fullWidth = false,
  children,
  open,
  setOpen,
  label,
  classId,
  data,
}: EditSheetFormProps<T>) {
  // Modo controlado si se pasan open y setOpen; si no, modo no controlado con estado interno
  const isControlled = typeof open === 'boolean' && typeof setOpen === 'function';
  const [internalOpen, setInternalOpen] = useState(false);
  const actualOpen = isControlled ? (open as boolean) : internalOpen;

  // Obtener usuario actual para comprobar si ya está apuntado
  const { data: session } = useSession();
  const sessionEmail = (session?.user as { email?: string } | undefined)?.email;
  const { data: users } = useGetUsers({ roles: [], email: sessionEmail });
  const currentUser = users?.[0];

  const isUserBooked = (data?.participantsList || []).some(
    (p) => p.name === currentUser?.name && p.surname === currentUser?.surname,
  );

  const { mutateAsync, isPending } = usePostBooking();
  const { mutateAsync: mutateAsyncDelete, isPending: isPendingDelete } =
    useDeleteBooking();

  const handleBooking = async () => {
    const bookingDate = data?.date;
    const bookingStartTime = data?.startTime;

    if (!bookingDate || !bookingStartTime) {
      toast.error(LITERALS.MESSAGES.ERROR);
      return;
    }

    await mutateAsync(
      {
        classId,
        date: bookingDate,
        startTime: bookingStartTime,
      },
      {
        onSuccess: () => {
          toast.success(`${LITERALS.BOOKING} ${LITERALS.MESSAGES.CREATE}`);
        },
        onError: () => {
          toast.error(LITERALS.MESSAGES.ERROR);
        },
      },
    );
  };

  const handleCancelBooking = async () => {
    const bookingDate = data?.date;
    const bookingStartTime = data?.startTime;

    if (!bookingDate || !bookingStartTime) {
      toast.error(LITERALS.MESSAGES.ERROR);
      return;
    }

    await mutateAsyncDelete(
      {
        classId,
        date: bookingDate,
        startTime: bookingStartTime,
      },
      {
        onSuccess: () => {
          toast.success(`${LITERALS.BOOKING} ${LITERALS.MESSAGES.CANCEL}`);
        },
        onError: () => {
          toast.error(LITERALS.MESSAGES.ERROR);
        },
      },
    );
  };

  const { room, endTime, startTime, monitor } = data || {};

  const isClassFinished = (() => {
    if (!data?.date || !data?.endTime) return false;
    const classEnd = dayjs(`${data.date}T${data.endTime}:00`);
    return dayjs().isAfter(classEnd);
  })();

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
        <AspectRatio ratio={16 / 9} className="bg-muted">
          <Image
            fill
            src="https://dmxgym.com/wp-content/uploads/2024/05/trx.png"
            alt="Photo by Drew Beamer"
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
          <Button
            className="h-12"
            type="submit"
            disabled={isPending || isUserBooked || isClassFinished}
            onClick={handleBooking}
          >
            {isClassFinished ? 'Finalizada' : isUserBooked ? 'Reservado' : 'Reservar'}
          </Button>
          <SheetClose asChild>
            <Button
              className="h-12"
              type="submit"
              disabled={!isUserBooked || isPendingDelete}
              onClick={handleCancelBooking}
              variant="outline"
            >
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
  console.log('list', list);
  return (
    <div className="px-4 pb-4">
      <ul className="grid grid-cols-5 gap-3">
        {list.map((p) => (
          <li key={p?.id} className="flex items-center justify-center">
            <GenericDrawer
              trigger={
                <Avatar
                  className="h-12 w-12"
                  title={[p.name, p.surname].filter(Boolean).join(' ') || 'Sin nombre'}
                >
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>
                    {(p.name || p.surname || '?').toString().charAt(0)}
                  </AvatarFallback>
                </Avatar>
              }
              direction="bottom"
              modal
              contentClassName="p-4"
              contentProps={{ forceMount: true }}
            >
              <div className="p-4">
                <h2 className="text-lg font-semibold">Perfil publico</h2>
                <div className="flex flex-col gap-4 justify-center items-center my-8">
                  <AvatarSections isAvatar name={p.name ?? ''} status={false} />
                  <h2 className="text-lg font-semibold">
                    {p?.name} {p?.surname}
                  </h2>
                  <div className="flex flex-row gap-2">
                    {p.instagram && (
                      <Link
                        href={`https://www.instagram.com/${p.instagram}`}
                        target="_blank"
                      >
                        <IconBrandInstagram className="w-6 h-6" />
                      </Link>
                    )}
                    {p.tiktok && (
                      <Link href={`https://www.tiktok.com/${p.tiktok}`} target="_blank">
                        <IconBrandTiktok className="w-6 h-6" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </GenericDrawer>
          </li>
        ))}
      </ul>
    </div>
  );
};
