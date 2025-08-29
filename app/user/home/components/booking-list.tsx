'use client';

import BookingSheetForm from '@/components/form/BookingSheetForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ClassEvent } from '@/hooks/useClasses';
import { toIsoDateString } from '@/utils/date';
import { IconCalendarClock } from '@tabler/icons-react';
import Image from 'next/image';
import { Fragment } from 'react';

export function BookingList({ events }: { events: ClassEvent[] }) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center px-6">
        <h2 className="text-xl font-bold">Agenda</h2>
      </div>

      <div className="flex flex-col gap-4 p-6 pt-3">
        {events?.length === 0 && (
          <Alert>
            <>
              <AlertTitle className="text-lg">No tienes reservas activas</AlertTitle>
              <AlertDescription className="text-sm">
                Elige una fecha y hora para reservar una clase.
              </AlertDescription>
            </>
          </Alert>
        )}

        {events?.map((evt, index) => (
          <Fragment key={index}>
            <BookingSheetForm
              classId={evt.id}
              label={evt.title}
              fullWidth
              data={{
                room: evt?.room,
                date: toIsoDateString(evt?.start, 'YYYY-MM-DD'),
                startTime: toIsoDateString(evt?.start, 'HH:mm'),
                endTime: toIsoDateString(evt?.end, 'HH:mm'),
                monitor: evt?.monitor,
                participantsList: evt?.participantsList,
              }}
            >
              <Card className="w-full flex flex-row p-0 gap-4 pt-0 items-stretch">
                <CardHeader className="!p-0 w-28 md:w-40 shrink-0 gap-0">
                  <AspectRatio ratio={1} className="bg-muted rounded-sm overflow-hidden">
                    <Image
                      fill
                      alt="Photo by Drew Beamer"
                      src="https://dmxgym.com/wp-content/uploads/2024/05/trx.png"
                      className="h-full w-full rounded-sm object-cover dark:brightness-[0.2] dark:grayscale"
                    />
                  </AspectRatio>
                </CardHeader>
                <CardContent className="px-4 p-0 gap-1 flex-1 flex flex-col justify-center">
                  <CardTitle className="text-xl font-semibold">{evt?.title}</CardTitle>
                  <CardDescription>
                    <p className="flex flex-row text-md items-center justify-start -ml-1">
                      <IconCalendarClock className="h-4 mr-1" />
                      {toIsoDateString(evt?.start, 'DD/MM/YY · HH:mm')}
                    </p>
                    <div className="flex flex-row items-center justify-start gap-2 mt-1">
                      <Badge variant="success" className="h-4 px-2" />
                      <p className="flex flex-row text-md items-center justify-start -ml-1 text-muted-foreground">
                        Clase reservada
                      </p>
                    </div>
                  </CardDescription>
                </CardContent>
              </Card>
            </BookingSheetForm>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
