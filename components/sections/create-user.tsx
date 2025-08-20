'use client';

import { PersonalDataForm } from '@/components/form/PersonalDataForm';
import { PostalDataForm } from '@/components/form/PostalDataForm';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import { usePostUsers } from '@/hooks/users/use-post-users';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

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
  provincia: z.string().min(1, 'Province is required'),
  country: z.string().min(1, 'Country is required'),
});

export default function CreateUserForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
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
      provincia: '',
      country: '',
    },
  });

  const { mutate, isPending, isError, isSuccess } = usePostUsers();

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    mutate(
      {
        ...data,
        surname: data.surname ?? '',
        lastName: data.lastname ?? '',
        roles: ['USER'],
      },
      {
        onSuccess: () => {
          console.log('User created successfully!');
          // You can add navigation or success message here
          // router.push('/customers');
        },
        onError: (error) => {
          console.error('Error creating user:', error);
          // You can add error handling here
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full">
        <PersonalDataForm form={form} />
        <PostalDataForm form={form} />
        <Button className="h-12 mt-3 w-full" type="submit" disabled={isPending}>
          {isPending ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
        {isSuccess && toast.success('Usuario creado exitosamente!')}
        {isError &&
          toast.error(
            'Error al crear usuario. Por favor, verifica que el DNI y email no estén duplicados.',
          )}
      </form>
    </Form>
  );
}
