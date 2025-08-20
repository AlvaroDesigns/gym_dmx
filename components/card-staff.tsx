'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { ROLE_OPTIONS } from '@/data/model';
import { useDeleteUsers } from '@/hooks/users/use-delete-users';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
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
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Switch } from './ui/switch';

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one item.',
  }),
});

const TestimonialCard = ({
  name = 'Álvaro Saiz Bonilla',
  staff = 'Supervisor, Comunicación',
  email = 'alvaro.saiz.bonilla@gmail.com',
  dni = '12345678J',
  editable = false,
  onClick,
}: {
  name?: string;
  staff?: string;
  email?: string;
  dni?: string;
  editable?: boolean;
  onClick?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const deleteUserMutation = useDeleteUsers();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: ['recents', 'home'],
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log('Form submitted:', data);
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUserMutation.mutateAsync({ dni });
      // Optionally call onClick to refresh the parent component
      if (onClick) {
        onClick();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <>
      <Card className="relative w-full flex flex-row bg-background shadow border-none">
        <CardContent className="flex flex-col gap-4 px-6 w-full sm:flex-row">
          <div className="flex items-center gap-3 w-full">
            <Avatar className="h-16 w-16 sm:h-18 sm:w-18">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <span className="text-[17px] leading-none font-semibold">{name}</span>
              <span className="text-sm leading-none text-muted-foreground font-bold">
                {staff.toUpperCase()}
              </span>
              <div className="flex flex-col gap-1 mt-2">
                <span className="text-sm leading-none text-muted-foreground">
                  {email}
                </span>
                <span className="text-sm leading-none text-muted-foreground">{dni}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-row">
            <div className="flex-1 sm:flex flex-col gap-2 border-l border-gray-300 px-6 justify-center hidden">
              <p className="text-sm leading-none text-muted-foreground">Estado</p>
              <Switch />
            </div>

            <div className=" flex flex-row sm:flex-col gap-2 sm:border-l border-gray-300 px-6 justify-center">
              {editable ? (
                <Button className="h-12 text-sm" variant="default" onClick={onClick}>
                  Editar
                </Button>
              ) : (
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button className="h-12 text-sm w-full sm:w-auto" variant="default">
                      Editar
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="sm:max-w-[425px]">
                    <SheetHeader>
                      <SheetTitle>Editar Staff</SheetTitle>
                      <SheetDescription>
                        Modifica tu perfil aquí. Guarda los cambios cuando termines.
                      </SheetDescription>
                    </SheetHeader>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6 px-5"
                      >
                        <FormField
                          control={form.control}
                          name="items"
                          render={() => (
                            <FormItem>
                              <Label htmlFor="name">Nombre</Label>
                              <Input
                                className="h-12"
                                type="text"
                                id="name"
                                defaultValue={name}
                              />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="items"
                          render={() => (
                            <FormItem>
                              <Label htmlFor="email">Email</Label>
                              <Input
                                className="h-12"
                                type="email"
                                id="email"
                                defaultValue={email}
                              />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="items"
                          render={() => (
                            <FormItem>
                              <Label htmlFor="name">Dni</Label>
                              <Input
                                className="h-12"
                                type="text"
                                id="dni"
                                defaultValue={dni}
                              />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="items"
                          render={() => (
                            <FormItem>
                              {ROLE_OPTIONS.map((item) => (
                                <FormField
                                  key={item.id}
                                  control={form.control}
                                  name="items"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={item.id}
                                        className="flex flex-row items-center gap-2"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(item.id)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([
                                                    ...field.value,
                                                    item.id,
                                                  ])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== item.id,
                                                    ),
                                                  );
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal">
                                          {item.label}
                                        </FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))}
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>

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
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="h-12 text-sm w-full sm:w-auto" variant="outline">
                    Borrar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Está completamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Eliminará permanentemente su
                      cuenta y eliminará sus datos de nuestros servidores
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
        </CardContent>
      </Card>
    </>
  );
};

export default TestimonialCard;
