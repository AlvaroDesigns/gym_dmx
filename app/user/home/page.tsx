'use client';

import { BottomTabs } from '@/components/bottom-tabs';
import DateSheetForm from '@/components/form/DateSheetForm';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useGetUsers } from '@/hooks/users/use-get-users';
import { ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Fragment } from 'react';

const CLASS = [
  {
    name: 'Yoga',
    description: 'Relax and stretch with our Yoga class.',
    time: 'Friday, 6:00 PM - 7:00 PM',
  },
  {
    name: 'HIIT',
    description: 'High-Intensity Interval Training for maximum results.',
    time: 'Wednesday, 7:00 PM - 8:00 PM',
  },
  {
    name: 'HIT',
    description: 'High-Intensity Interval Training',
    time: 'Wednesday, 7:00 PM - 14:00 PM',
  },
];

export default function Page() {
  const { data } = useGetUsers({
    email: 'hello@alvarodesigns.com',
  });

  const user = data?.[0];

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        {/* User */}
        <div className="flex flex-col gap-4 p-6 md:gap-6 md:py-6">
          <div className="flex gap-4 items-center">
            <Avatar className="h-19 w-19">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <h2 className="text-[20px] leading-none font-semibold">
                ¡Hola {user?.name} {user?.surname}!
              </h2>
              <div className="flex flex-col gap-1">
                <span className="text-md leading-none text-muted-foreground">
                  Hoy puede ser un gran día.
                </span>
                <span className="text-md leading-none text-muted-foreground">
                  ¡Vamos a por ello!
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Class */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center px-6">
            <h2 className="text-xl font-bold">Agenda</h2>
            <DateSheetForm fullWidth>
              <p>Reservar</p>
            </DateSheetForm>
          </div>
          <div className="flex flex-row gap-4 p-6 pt-3 md:gap-6 md:py-6 overflow-auto">
            {CLASS.map((cls, index) => (
              <Fragment key={index}>
                <Sheet>
                  <SheetTrigger asChild>
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
                        <CardTitle>{cls.name}</CardTitle>
                        <CardDescription>{cls.time}</CardDescription>
                      </CardHeader>
                    </Card>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>¿Está completamente seguro?</SheetTitle>
                    </SheetHeader>
                    <AspectRatio ratio={16 / 9} className="bg-muted">
                      <Image
                        src="https://dmxgym.com/wp-content/uploads/2024/05/trx.png"
                        alt="Photo by Drew Beamer"
                        fill
                        className="h-full w-full  object-cover dark:brightness-[0.2] dark:grayscale"
                      />
                    </AspectRatio>
                    <div>
                      <div className="flex flex-col gap-4 px-4 md:gap-6 md:py-6">
                        <div className="flex gap-4 items-center">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col gap-2">
                            <span className="text-[16px] leading-none font-semibold">
                              {user?.name}
                            </span>
                            <div className="flex flex-row items-center gap-2">
                              <ClockIcon className="w-5 h-5 text-black" />
                              <span className="text-md leading-none text-muted-foreground">
                                18:00 - 19:00
                              </span>
                            </div>
                            <div className="flex flex-row items-center gap-2">
                              <MapPinIcon className="w-5 h-5 text-black" />
                              <span className="text-md leading-none text-muted-foreground">
                                Sala 1
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Separator className="my-4" />
                    </div>

                    <SheetFooter>
                      <Button className="h-12" type="submit">
                        Guardad Cambios
                      </Button>
                      <SheetClose asChild>
                        <Button className="h-12" variant="outline">
                          Cerrar
                        </Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </Fragment>
            ))}
          </div>
        </div>
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
