'use client';

import { ProductLayout } from '@/components/layout/product';
import { AvatarSections } from '@/components/sections/avatar-sections';

import CreateUserForm from '@/components/sections/create-user';

export default function Page() {
  return (
    <ProductLayout isButton={false}>
      {/* Avatar */}
      <AvatarSections name="Nuevo Empleado" isBanned={false} />
      {/* User */}
      <div className="flex flex-col gap-4 md:gap-6 md:py-6 w-full">
        <CreateUserForm />
      </div>
    </ProductLayout>
  );
}
