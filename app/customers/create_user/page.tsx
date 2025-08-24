'use client';

import { ProductLayout } from '@/components/layout/product';
import { AvatarSections } from '@/components/sections/avatar-sections';

import CreateUserForm from '@/components/sections/create-user';
import { FormSchema } from '@/config/schema';
import { LITERALS } from '@/data/literals';
import { usePostUsers } from '@/hooks/users/use-post-users';
import { z } from '@/lib/zod';
import { ROLES_USER } from '@/types';
import { provinceFromPostalCode } from '@/utils/postalCode';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
      province: '',
      country: '',
      birthDate: new Date().toISOString(),
    },
  });

  const { mutate, isPending, isError, isSuccess } = usePostUsers();

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const city = provinceFromPostalCode(data.postalCode);

    mutate(
      {
        ...data,
        city,
        surname: data.surname ?? '',
        lastName: data.lastname ?? '',
        roles: ROLES_USER,
      },
      {
        onSuccess: () => {
          toast.success(`${LITERALS.CUSTOMER} ${LITERALS.MESSAGES.CREATE}`);
        },
        onError: () => {
          toast.error(LITERALS.MESSAGES.ERROR);
        },
      },
    );
  };

  return (
    <ProductLayout isButton={false}>
      {/* Avatar */}
      <AvatarSections name="Nuevo Empleado" isBanned={false} />
      {/* User */}
      <div className="flex flex-col gap-4 md:gap-6 md:py-6 w-full">
        <CreateUserForm
          form={form}
          error={isError}
          loading={isPending}
          success={isSuccess}
          onSubmit={onSubmit}
        />
      </div>
    </ProductLayout>
  );
}
