'use client';

import TestimonialCard from '@/components/card-staff';
import { DataTable } from '@/components/data-table';
import { ProductLayout } from '@/components/layout/product';
import { ListHorizontal } from '@/components/sections/list-horizontal';
import SkeletonHome from '@/components/skeletons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Pagination controls are handled inside ListHorizontal for card view
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

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useGetUsers({
    roles: ['USER'],
    page: pageIndex + 1,
    pageSize,
  });

  const rawUsers = Array.isArray(data) ? data : data?.data;
  const filteredStaff = rawUsers?.filter((customer) => {
    const fullName = `${customer.name} ${customer.surname}`.toLowerCase();
    return fullName.includes(filter.toLowerCase());
  });
  const pageCount = (Array.isArray(data) ? 1 : data?.totalPages) || 1;

  // Transform data to match Customer interface
  const transformedData: Customer[] =
    filteredStaff?.map((customer) => ({
      id: customer.dni,
      name: customer.name,
      surname: customer.surname,
      lastName: customer.lastName,
      email: customer.email,
      dni: customer.dni,
      phone: customer.phone,
      active: customer.active ?? true,
      createdAt: customer.createdAt || new Date().toISOString(),
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
                pageSize={pageSize}
                manualPagination={true}
                pageCount={(Array.isArray(data) ? 1 : data?.totalPages) || 1}
                onPageChange={(nextPageIndex, nextPageSize) => {
                  if (nextPageSize !== pageSize) setPageSize(nextPageSize);
                  if (nextPageIndex !== pageIndex) setPageIndex(nextPageIndex);
                }}
                customActions={
                  <Button variant="outline" size="sm">
                    <span className="hidden lg:inline">Añadir Cliente</span>
                  </Button>
                }
              />
            ) : (
              <ListHorizontal
                items={filteredStaff}
                renderItem={(customer, index) => (
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
                )}
                pageIndex={pageIndex}
                pageSize={pageSize}
                setPageIndex={setPageIndex}
                setPageSize={setPageSize}
                pageCount={pageCount}
                totalCount={
                  Array.isArray(data) ? filteredStaff?.length || 0 : data?.total || 0
                }
              />
            )}
          </div>
        </div>
      )}
    </ProductLayout>
  );
}
