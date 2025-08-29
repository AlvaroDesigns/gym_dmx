'use client';

import { AvatarSections } from '@/components/sections/avatar-sections';
import { Button } from '@/components/ui/button';
import { useGetUsers } from '@/hooks/users/use-get-users';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import { PersonalDataForm } from '@/components/form/PersonalDataForm';
import { PostalDataForm } from '@/components/form/PostalDataForm';
import { ProductLayout } from '@/components/layout/product';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormSchema } from '@/config/schema';
import { LITERALS } from '@/data/literals';
import { usePutUsers } from '@/hooks/users/use-put-users';
import { z } from '@/lib/zod';
import { ROLES_EMPLOYEE } from '@/types';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function Page() {
  const params = useParams();
  const { data: users, isLoading } = useGetUsers({
    roles: [],
    dni: params.$dni as string,
  });

  const data = users?.at(0);

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'all',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      surname: '',
      lastname: '',
      dni: '',
      email: '',
      phone: '',
      gender: 'M',
      address: '',
      postalCode: '',
      province: '',
      country: '',
    },
  });

  // Actualizar los valores del formulario cuando los datos lleguen de la API
  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name || '',
        surname: data.surname || '',
        lastname: data.lastName || '',
        dni: data.dni || '',
        email: data.email || '',
        phone: data.phone || '',
        gender: data.gender || 'M',
        address: data.address || '',
        postalCode: data.postalCode || '',
        province: data.province || '',
        country: data.country || '',
      });
    }
  }, [data, form]);

  const { mutate, isPending, isError, isSuccess } = usePutUsers();

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (!data) return;

    mutate(
      {
        ...data,
        surname: data.surname ?? '',
        lastName: data.lastname ?? '',
        roles: ROLES_EMPLOYEE,
      },
      {
        onSuccess: () => {
          toast.success(`${LITERALS.STAFF} ${LITERALS.MESSAGES.UPDATE}`);
        },
        onError: () => {
          toast.error(LITERALS.MESSAGES.ERROR);
        },
      },
    );
  };

  return (
    <ProductLayout isView isLoading={isLoading}>
      <AvatarSections name={data?.name ?? ''} status={false} />
      {/* User */}
      <div className="flex flex-col gap-4  md:gap-6 md:py-2 w-full">
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Personales</TabsTrigger>
            <TabsTrigger value="password">Facturación</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-4 space-y-5 w-full"
            >
              <PersonalDataForm form={form} />
              <PostalDataForm form={form} />
              <Button className="h-12 mt-3 w-full" type="submit" disabled={isPending}>
                {isPending ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
              {isSuccess && toast.success('Usuario modificado exitosamente!')}
              {isError &&
                toast.error(
                  'Error al crear usuario. Por favor, verifica que el DNI y email no estén duplicados.',
                )}
            </form>
          </TabsContent>
          <TabsContent value="password">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full">
              <PersonalDataForm form={form} />
              <PostalDataForm form={form} />
              <Button className="h-12 mt-3 w-full" type="submit">
                Guardar Cambios
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </ProductLayout>
  );
}
