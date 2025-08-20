'use client';

import { ProductLayout } from '@/components/layout/product';
import { AvatarSections } from '@/components/sections/avatar-sections';
import { zodResolver } from '@hookform/resolvers/zod';

import CreateUserForm from '@/components/sections/create-user';
import { usePostUsers } from '@/hooks/users/use-post-users';
import { useForm } from 'react-hook-form';
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

export default function Page() {
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
        roles: ['EMPLOYEE'],
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
    <ProductLayout isButton={false}>
      {/* Avatar */}
      <AvatarSections name="Nuevo Empleado" isBanned={false} />
      {/* User */}
      <div className="flex flex-col gap-4 md:gap-6 md:pb-4 w-full">
        <CreateUserForm />
      </div>
    </ProductLayout>
  );
}
