'use client';

import { Button } from '@/components/ui/button';
import { useGetUsers } from '@/hooks/users/use-get-users';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import { PersonalDataForm } from '@/components/form/PersonalDataForm';
import { PostalDataForm } from '@/components/form/PostalDataForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePutUsers } from '@/hooks/users/use-put-users';
import { UserData } from '@/types/user';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const FormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  surname: z.string().optional(),
  lastname: z.string().optional(),
  dni: z.string().min(1, 'DNI is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(9, 'Phone is required'),
  gender: z.enum(['M', 'F']),
  address: z.string().min(1, 'Address is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  province: z.string().min(1, 'Province is required'),
  country: z.string().min(1, 'Country is required'),
});

export default function EditUserForm({ roles }: { roles: UserData['roles'] }) {
  const params = useParams();
  const { data: users } = useGetUsers({
    roles: [],
    dni: params.$dni as string,
  });

  const data = Array.isArray(users) ? users[0] : users?.data?.[0];

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
        roles,
      },
      {
        onSuccess: () => {
          console.log('User updated successfully!');
          // You can add navigation or success message here
          // router.push('/customers');
        },
        onError: (error) => {
          console.error('Error updating user:', error);
          // You can add error handling here
        },
      },
    );
  };

  return (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Personales</TabsTrigger>
        <TabsTrigger value="password">Facturación</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-5 w-full">
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
  );
}
