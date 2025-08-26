'use client';

import BookingSheetForm from '@/components/form/BookingSheetForm';
import DateSheetForm from '@/components/form/DateSheetForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ClassEvent } from '@/hooks/useClasses';
import { dayjs } from '@/lib/dayjs';
import { IconQuestionMark } from '@tabler/icons-react';
import Image from 'next/image';
import { Fragment } from 'react';

export function BookingUser({ events }: { events: ClassEvent[] }) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center px-6">
        <h2 className="text-xl font-bold">Agenda</h2>
        <DateSheetForm fullWidth>
          <p>Reservar</p>
        </DateSheetForm>
      </div>

      <div className="flex flex-row gap-4 p-6 pt-3 md:gap-6 md:py-6 overflow-auto">
        {events?.length === 0 && (
          <Alert>
            <IconQuestionMark className="w-6 h-6" />
            <>
              <AlertTitle>No tienes reservas esta semana</AlertTitle>
              <AlertDescription>
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
                room: evt.room,
                date: dayjs(evt.start).format('YYYY-MM-DD'),
                startTime: dayjs(evt.start).format('HH:mm'),
                endTime: dayjs(evt.end).format('HH:mm'),
                monitor: evt.monitor,
                participantsList: evt.participantsList,
              }}
            >
              <Card className="w-full max-w-sm py-4 gap-4 min-w-[45%] pt-0">
                <CardContent className="px-4 p-0">
                  <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
                    <Image
                      src="https://dmxgym.com/wp-content/uploads/2024/05/trx.png"
                      alt="Photo by Drew Beamer"
                      fill
                      className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
                    />
                  </AspectRatio>
                </CardContent>
                <CardHeader className="px-4 pt-0">
                  <CardTitle>{evt.title}</CardTitle>
                  <CardDescription>
                    {dayjs(evt.start).format('dddd, HH:mm')} -{' '}
                    {dayjs(evt.end).format('HH:mm')}
                  </CardDescription>
                </CardHeader>
              </Card>
            </BookingSheetForm>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
