'use client';

import { SimpleDataTable } from '@/components/data-table';
import { ProductLayout } from '@/components/layout/product';
import { columns, type Payment } from './columns';

const PAYMENTS: Payment[] = [
  {
    id: '1',
    userName: 'Juan Pérez',
    type: 'Mensual',
    price: 29.99,
    total: 29.99,
    discount: 0,
    status: 'PAID',
    paymentDate: '2024-01-15',
    nextPaymentDate: '2024-02-15',
  },
  {
    id: '2',
    userName: 'María García',
    type: 'Anual',
    price: 299.99,
    total: 269.99,
    discount: 10,
    status: 'PAID',
    paymentDate: '2024-01-10',
    nextPaymentDate: '2025-01-10',
  },
  {
    id: '3',
    userName: 'Carlos López',
    type: 'Mensual',
    price: 29.99,
    total: 29.99,
    discount: 0,
    status: 'PENDING',
    paymentDate: '2024-01-20',
  },
  {
    id: '4',
    userName: 'Ana Martínez',
    type: 'Trimestral',
    price: 79.99,
    total: 79.99,
    discount: 0,
    status: 'UNPAID',
    paymentDate: '2024-01-25',
  },
];

export default function Page() {
  return (
    <ProductLayout buttonProps={{ text: 'Añadir Pago', routingUri: 'modal' }}>
      <SimpleDataTable
        data={PAYMENTS}
        columns={columns}
        enablePagination={true}
        enableSorting={true}
        enableFiltering={true}
        pageSize={10}
      />
    </ProductLayout>
  );
}
