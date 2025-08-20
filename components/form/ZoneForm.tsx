'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const zoneSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  imageUrl: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
});

type ZoneFormData = z.infer<typeof zoneSchema>;

interface ZoneFormProps {
  onSubmit: (data: ZoneFormData) => void;
  isLoading?: boolean;
  triggerText?: string;
}

export default function ZoneForm({
  onSubmit,
  isLoading = false,
  triggerText = 'Añadir zona',
}: ZoneFormProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<ZoneFormData>({
    resolver: zodResolver(zoneSchema),
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
    },
  });

  const handleSubmit = (data: ZoneFormData) => {
    onSubmit(data);
    setOpen(false);
    form.reset();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="default" size="sm">
          <IconPlus />
          {triggerText}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>Crear nueva zona</SheetTitle>
          <SheetDescription>
            Añade una nueva zona al gimnasio. Completa los campos y guarda los cambios.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 px-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la zona</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingresa el nombre de la zona"
                      {...field}
                      className="h-12"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ingresa la descripción de la zona"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de la imagen</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingresa la URL de la imagen (opcional)"
                      {...field}
                      className="h-12"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <SheetFooter>
          <Button
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isLoading}
            className="h-12"
          >
            {isLoading ? 'Creando...' : 'Crear zona'}
          </Button>
          <SheetClose asChild>
            <Button className="h-12" variant="outline">
              Cancelar
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
