import { ROUTES_URL } from '@/config/url';
import { ClassTypes } from '@/types';
import { IconAlertSquareRounded, IconArrowNarrowRightDashed } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { IntegrationCard } from '../card-class';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface ClassSectionProps {
  data: any;
  type: ClassTypes;
}

export const ClassSection = ({ data, type }: ClassSectionProps) => {
  const router = useRouter();

  if (data?.length === 0) {
    return (
      <Card>
        <div className="flex flex-row justify-start items-center ">
          <div className="flex flex-row items-center gap-2 mx-4 min-w-16 justify-center">
            <IconAlertSquareRounded className="h-12 w-12" />
          </div>
          <div className="text-left border-l">
            <div className="ml-8">
              <h2 className="text-balance text-xl font-semibold md:text-2xl">
                Información de tus clases
              </h2>
              <p className="text-muted-foreground line-clamp-2 text-sm">
                Para poder crear tus clases primero debes añadir la zona en la que se van
                a realizar.
              </p>
            </div>
            <Button
              variant="link"
              size="sm"
              className="ml-6 items-center flex justify-center"
              onClick={() => router.push(ROUTES_URL.ZONES)}
            >
              Añadir zona
              <IconArrowNarrowRightDashed />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
      {data?.map((item: any, index: number) => (
        <IntegrationCard key={item?.id} {...item} type={type} index={index} />
      ))}
    </div>
  );
};
