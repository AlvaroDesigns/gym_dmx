'use client';

import { AvatarSections } from '@/components/sections/avatar-sections';
import { useGetUsers } from '@/hooks/users/use-get-users';
import { useParams } from 'next/navigation';

import { ProductLayout } from '@/components/layout/product';
import EditUserForm from '@/components/sections/edit-users';

export default function Page() {
  const params = useParams();

  const { data: users, isLoading } = useGetUsers({
    roles: ['USER'],
    dni: params.$dni as string,
  });

  const data = Array.isArray(users) ? users[0] : users?.data?.[0];

  return (
    <ProductLayout isLoading={isLoading}>
      <AvatarSections name={data?.name ?? ''} status={false} />
      {/* User */}
      <div className="flex flex-col gap-4  md:gap-6 md:py-2 w-full">
        <EditUserForm roles={['USER']} />
      </div>
    </ProductLayout>
  );
}
