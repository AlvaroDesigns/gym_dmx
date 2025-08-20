import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LITERALS } from '@/data/literals';
import { getEditFieldsModalZones } from '@/data/modals';
import { useDeleteClass } from '@/hooks/class/use-delete-class';
import { usePutClass } from '@/hooks/class/use-put-class';
import { useDeleteZones } from '@/hooks/zones/use-delete-zones';
import { useUpdateZone } from '@/hooks/zones/use-zones';
import { cn } from '@/lib/utils';
import { ClassTypes, ZONE_TYPE } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import EditSheetForm from './form/EditSheetForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface ClassSectionProps {
  id: string;
  name: string;
  description: string;
  maxCapacity: number;
  room: string;
  type?: ClassTypes;
  index: number;
  onClick?: () => void;
}

const FormClassSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  room: z.string().optional(),
  maxCapacity: z.number().min(1, 'Capacity must be at least 1'),
});

const FormZonesSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  imageUrl: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
});

const COLORS = {
  0: 'border-l-fuchsia-100',
  1: 'border-l-amber-100',
  2: 'border-l-red-100',
  3: 'border-l-green-100',
  4: 'border-l-blue-100',
  5: 'border-l-purple-100',
  6: 'border-l-pink-100',
  7: 'border-l-yellow-100',
  8: 'border-l-gray-100',
  9: 'border-l-neutral-100',
  10: 'border-l-stone-100',
  11: 'border-l-emerald-100',
  12: 'border-l-teal-100',
  13: 'border-l-cyan-100',
  14: 'border-l-sky-100',
  15: 'border-l-lime-100',
  16: 'border-l-rose-100',
  17: 'border-l-fuchsia-100',
  18: 'border-l-amber-100',
  19: 'border-l-red-100',
  20: 'border-l-green-100',
  21: 'border-l-blue-100',
};

export const IntegrationCard = ({
  id,
  name,
  description,
  maxCapacity,
  room,
  type,
  index,
  onClick,
}: ClassSectionProps) => {
  const [open, setOpen] = React.useState(false);

  // Zones
  const deleteUserMutation = useDeleteZones();
  const updateZoneMutation = useUpdateZone();

  // Class
  const deleteClassMutation = useDeleteClass();
  const updateClassMutation = usePutClass();

  const isZone = type === ZONE_TYPE;
  type ClassFormValues = z.infer<typeof FormClassSchema>;
  type ZoneFormValues = z.infer<typeof FormZonesSchema>;
  type FormValues = ClassFormValues | ZoneFormValues;

  const form = useForm<FormValues>({
    resolver: zodResolver(isZone ? FormZonesSchema : FormClassSchema),
    defaultValues: (isZone
      ? {
          name,
          description,
          imageUrl: '',
        }
      : {
          name,
          description,
          room,
          maxCapacity,
        }) as any,
  });

  const fieldsData = getEditFieldsModalZones(type, name, description, room, maxCapacity);

  const onSubmit = async (data: FormValues) => {
    try {
      if (isZone) {
        const d = data as ZoneFormValues;
        await updateZoneMutation.mutateAsync({
          id,
          name: d.name,
          description: d.description,
        });
      } else {
        const d = data as ClassFormValues;
        await updateClassMutation.mutateAsync({
          id,
          name: d.name,
          description: d.description,
          maxCapacity: d.maxCapacity,
          room: d.room,
        });
      }

      setOpen(false);

      if (onClick) {
        onClick();
      }
      toast.success(
        `${type === ZONE_TYPE ? LITERALS.ZONES : LITERALS.CLASS} ${LITERALS.MESSAGES.UPDATE}`,
      );
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : LITERALS.MESSAGES.ERROR);
    }
  };

  const handleDeleteUser = async () => {
    try {
      if (type === ZONE_TYPE) {
        await deleteUserMutation.mutateAsync({ id });
      } else {
        await deleteClassMutation.mutateAsync({ id });
      }

      if (onClick) {
        onClick();
        toast.success('Zona eliminada exitosamente');
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar la zona');
    }
  };

  return (
    <Card
      className={cn(
        'px-6 py-2',
        `${type === 'classes' ? `border-l-16 ${COLORS[index as keyof typeof COLORS]}` : 'pb-5'}`,
      )}
    >
      <div className={`relative flex flex-row gap-4`}>
        {type === ZONE_TYPE && (
          <div className="bg-muted rounded-lg mt-3 w-32 h-32 sm:w-40 shrink-0">
            <Image
              src="https://www.profitness.es/wp-content/uploads/2023/06/Ocimax-03-2023-042-scaled.jpg"
              alt="Photo by Drew Beamer"
              width={160}
              height={160}
              sizes="(min-width: 640px) 10rem, 8rem"
              className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        )}

        <div className="space-y-2 py-2 flex flex-col w-full">
          <h3 className="text-lg font-medium">{name}</h3>
          <p className="text-muted-foreground line-clamp-2 text-sm">{description}</p>
          {type === 'classes' ? (
            <div className="flex flex-col mt-4">
              <p className="text-muted-foreground line-clamp-2 text-sm">
                <strong>SALA: </strong>
                {room}
              </p>
              <p className="text-muted-foreground line-clamp-2 text-sm">
                <strong>CAPACIDAD: </strong>
                {maxCapacity} personas
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col justify-center border-l border-gray-200 pl-6 gap-2">
          <div
            className={`h-12 text-sm flex gap-2 w-full sm:w-auto flex-col justify-center`}
          >
            <EditSheetForm
              fullWidth
              open={open}
              setOpen={setOpen}
              form={form}
              onSubmit={onSubmit}
              triggerText="Editar"
              fields={fieldsData}
            />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className={'h-12 text-sm w-full sm:w-auto'} variant="outline">
                  Borrar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Está completamente seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Eliminará permanentemente su cuenta
                    y eliminará sus datos de nuestros servidores
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteUser}
                    disabled={deleteUserMutation.isPending}
                  >
                    {deleteUserMutation.isPending ? 'Borrando...' : 'Continuar'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </Card>
  );
};
