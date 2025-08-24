'use client';

import TestimonialCard from '@/components/card-staff';
import { DataTable } from '@/components/data-table';
import { ProductLayout } from '@/components/layout/product';
import SkeletonUsers from '@/components/skeletons/skeleton-user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useViewToggle } from '@/hooks/use-view-toggle';
import { useGetUsers } from '@/hooks/users/use-get-users';
import { ROLES_EMPLOYEE } from '@/types';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { columns } from './columns';

export default function Page() {
  const router = useRouter();
  const [filter, setFilter] = useState('');
  const { currentView, handleViewChange } = useViewToggle<'default' | 'compiled'>(
    'default',
    ['default', 'compiled'],
  );

  const { data, isLoading } = useGetUsers({ roles: ROLES_EMPLOYEE });

  const filteredStaff = data?.filter((staff) => {
    const fullName = `${staff.name} ${staff.surname}`.toLowerCase();
    return fullName.includes(filter.toLowerCase());
  });

  // Transform data to match Customer interface
  const transformedData: any[] =
    filteredStaff?.map((customer) => ({
      id: customer.dni,
      name: customer.name,
      surname: customer.surname,
      lastName: customer.lastName,
      email: customer.email,
      dni: customer.dni,
      phone: customer.phone,
      roles: customer.roles?.map((role) => role.toString()) || [],
      createdAt: new Date().toISOString(),
    })) || [];

  const handleProductLayoutViewChange = (value: 'default' | 'compiled') => {
    handleViewChange(value);
  };

  return (
    <ProductLayout
      isView
      onChangeView={handleProductLayoutViewChange}
      view={currentView}
      buttonProps={{
        text: 'Añadir personal',
        routingUri: 'internal',
        url: '/staff/create_staff',
      }}
    >
      {isLoading ? (
        <SkeletonUsers />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                placeholder="Buscar empleado por nombre..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-background pl-10"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredStaff?.length || 0} empleado(s) encontrado(s)
            </div>
          </div>

          <div className="grid gap-4">
            {currentView === 'compiled' ? (
              <DataTable
                data={transformedData}
                columns={columns}
                enableDrag={true}
                enableSelection={true}
                enablePagination={true}
                enableColumnVisibility={true}
                showTabs={true}
                customActions={
                  <Button variant="outline" size="sm">
                    <span className="hidden lg:inline">Añadir Cliente</span>
                  </Button>
                }
              />
            ) : (
              filteredStaff?.map((staff, index) => (
                <TestimonialCard
                  editable
                  key={index}
                  {...staff}
                  onClick={() => router.push(`/staff/${staff.dni}/edit`)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </ProductLayout>
  );
}
