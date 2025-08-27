'use client';

import { BookingUser } from '@/app/user/home/components/booking-user';
import { BottomTabs } from '@/components/bottom-tabs';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useClasses } from '@/hooks/useClasses';
import { useGetUsers } from '@/hooks/users/use-get-users';
import { dayjs } from '@/lib/dayjs';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useMemo } from 'react';
import { BookingHeader } from './components/booking-header';

export default function Page() {
  const { data: session } = useSession();
  const sessionEmail = session?.user?.email ?? undefined;
  const { data: users } = useGetUsers({ roles: [], email: sessionEmail });
  const user = users?.[0];

  const { events, loadEvents } = useClasses();

  useEffect(() => {
    const startDate = dayjs().startOf('week').format('YYYY-MM-DD');
    const endDate = dayjs().startOf('week').add(6, 'day').format('YYYY-MM-DD');
    loadEvents(startDate, endDate);
  }, [loadEvents]);

  // Filtra eventos donde el usuario actual está en la lista de participantes
  const userEvents = useMemo(() => {
    if (!user) return [] as typeof events;
    return events
      .filter((evt) =>
        (evt.participantsList || []).some(
          (p) => p.name === user?.name && p.surname === user?.surname,
        ),
      )
      .sort((a, b) => (a.start?.getTime?.() || 0) - (b.start?.getTime?.() || 0));
  }, [events, user]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6">
        {/* User */}
        <BookingHeader user={user ?? {}} />

        {/* Reservas del usuario */}
        <BookingUser events={userEvents} />

        {/* workout */}
        <div className="flex flex-col">
          <h2 className="text-xl font-bold px-6">Entrenamiento</h2>
          <div className="flex flex-row gap-4 p-6 pt-3 md:gap-6 md:py-6 overflow-auto">
            <Card className="w-full max-w-sm p-0 gap-4 min-w-[45%] relative">
              <CardContent className="p-0">
                <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
                  <Image
                    src="https://dmxgym.com/wp-content/uploads/2024/05/trx.png"
                    alt="Photo by Drew Beamer"
                    fill
                    className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
                  />
                </AspectRatio>
              </CardContent>
              <CardHeader className="absolute z-10 bottom-3 w-full">
                <CardTitle className="text-xl font-bold  text-white">
                  Pulsa para entrenar
                </CardTitle>
                <CardDescription className="text-gray-100">
                  Elige una rutina o crea tu propio entrenamiento
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
        {/* BottomTabs */}
        <BottomTabs />
      </div>
    </div>
  );
}
