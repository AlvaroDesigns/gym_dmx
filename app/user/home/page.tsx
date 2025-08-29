'use client';

import { BookingHeader } from '@/app/user/home/components/booking-header';
import { BookingList } from '@/app/user/home/components/booking-list';
import { BookingUser } from '@/app/user/home/components/booking-user';
import { BottomTabs } from '@/components/bottom-tabs';
import SkeletonHome from '@/components/skeletons';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card } from '@/components/ui/card';
import { useGetEvents } from '@/hooks/events/use-get-events';
import type { ClassEvent as RBCEvent } from '@/hooks/useClasses';
import { useGetUsers } from '@/hooks/users/use-get-users';
import { dayjs } from '@/lib/dayjs';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useMemo } from 'react';

export default function Page() {
  const { data: session } = useSession();
  const sessionEmail = session?.user?.email ?? undefined;
  const { data: users } = useGetUsers({ roles: [], email: sessionEmail });
  const usersArray = (Array.isArray(users) ? users : users?.data) ?? [];
  const user = usersArray[0];

  const startDate = useMemo(() => dayjs().startOf('week').format('YYYY-MM-DD'), []);
  const endDate = useMemo(
    () => dayjs().startOf('week').add(6, 'day').format('YYYY-MM-DD'),
    [],
  );
  const { data: calendarData, isLoading } = useGetEvents({ startDate, endDate });

  const events = useMemo(() => {
    const data = calendarData ?? [];
    return data
      .map((e) => {
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
      })
      .sort((a, b) => (a.start?.getTime?.() || 0) - (b.start?.getTime?.() || 0));
  }, [calendarData]);

  // Filtra eventos donde el usuario actual está en la lista de participantes
  const userEvents = useMemo(() => {
    if (!user) return [] as typeof events;
    return events
      .filter((evt) =>
        (evt.participantsList || []).some(
          (p) => p.name === user?.name && p.surname === user?.surname,
        ),
      )
      .filter((evt) => dayjs().isBefore(dayjs(evt.end)))
      .sort((a, b) => (a.start?.getTime?.() || 0) - (b.start?.getTime?.() || 0));
  }, [events, user]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-4">
        {/* User */}
        <BookingHeader user={user ?? {}} />

        {/* Reservas del usuario */}
        {RenderHome(userEvents, isLoading)}

        {/* BottomTabs */}
        <BottomTabs />
      </div>
    </div>
  );
}

const RenderHome = (userEvents: RBCEvent[], isLoading: boolean) => {
  if (isLoading) {
    return (
      <div className="flex flex-col px-6">
        <SkeletonHome size="xs" numberOfItems={4} />
      </div>
    );
  }

  return (
    <>
      {/* Reservas del usuario */}
      <BookingList events={userEvents} />

      {/* Workout */}
      <div className="flex flex-col">
        <h2 className="text-xl font-bold px-6">Entrenamiento</h2>
        <div className="flex flex-row gap-4 p-6 pt-3 overflow-auto">
          <Card className="w-full max-w-sm p-0 gap-4 min-w-[45%] relative">
            <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
              <Image
                src="/img/workout.png"
                alt="workout"
                fill
                className="h-full w-full rounded-lg object-cover"
              />
            </AspectRatio>
            <div className="absolute z-10 top-8 flex mx-3 px-4 flex-col justify-start w-1/2">
              <h3 className="text-xl font-bold text-black">Pulsa para entrenar</h3>
              <p className="text-gray-900 text-sm">
                Elige una rutina o crea tu propio entrenamiento
              </p>
            </div>
          </Card>
        </div>
      </div>
      {/* Botón fijo sobre BottomTabs con hueco inferior para el botón circular */}
      <BookingUser />
    </>
  );
};
