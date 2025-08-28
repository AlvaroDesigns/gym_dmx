'use client';

import TestimonialCard from '@/components/card-staff';
import { DataTable } from '@/components/data-table';
import { ProductLayout } from '@/components/layout/product';
import SkeletonHome from '@/components/skeletons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES_URL } from '@/config/url';
import { useViewToggle } from '@/hooks/use-view-toggle';
import { useGetUsers } from '@/hooks/users/use-get-users';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { columns, type Customer } from './columns';

export default function Page() {
  const router = useRouter();
  const [filter, setFilter] = useState('');
  const { currentView, handleViewChange } = useViewToggle<'default' | 'compiled'>(
    'default',
    ['default', 'compiled'],
  );

  const { data, isLoading } = useGetUsers({ roles: ['USER'] });

  const filteredStaff = data?.filter((customer) => {
    const fullName = `${customer.name} ${customer.surname}`.toLowerCase();
    return fullName.includes(filter.toLowerCase());
  });

  // Transform data to match Customer interface
  const transformedData: Customer[] =
    filteredStaff?.map((customer) => ({
      id: customer.dni, // Use DNI as ID since UserData doesn't have id
      name: customer.name,
      surname: customer.surname,
      lastName: customer.lastName,
      email: customer.email,
      dni: customer.dni,
      phone: customer.phone,
      roles: customer.roles?.map((role) => role.toString()) || [], // Convert Role enum to string array
      createdAt: new Date().toISOString(), // Use current date since UserData doesn't have createdAt
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
        text: 'Añadir Cliente',
        routingUri: 'internal',
        url: ROUTES_URL.CUSTOMER_CREATE,
      }}
    >
      {isLoading ? (
        <SkeletonHome />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                placeholder="Buscar cliente por nombre..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-background pl-10"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredStaff?.length || 0} cliente(s) encontrado(s)
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
              filteredStaff?.map((customer, index) => (
                <TestimonialCard
                  key={index}
                  {...customer}
                  name={`${customer.name} ${customer?.surname} ${customer.lastName || ''}`}
                  staff={customer.dni}
                  email={customer.email}
                  onClick={() =>
                    router.push(`${ROUTES_URL.CUSTOMERS}/${customer?.dni}/edit`)
                  }
                  editable
                />
              ))
            )}
          </div>
        </div>
      )}
    </ProductLayout>
  );
}
