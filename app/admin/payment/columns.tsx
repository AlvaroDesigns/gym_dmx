'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  userName: string; // o userEmail si quieres mostrar email
  type: string;
  price: number;
  total: number;
  discount: number;
  status: 'UNPAID' | 'PAID' | 'PENDING'; // según tu enum de Prisma
  paymentDate: string; // ISO date string
  nextPaymentDate?: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'userName',
    header: 'Usuario',
    cell: ({ row }) => <span>{row.getValue('userName')}</span>,
  },
  {
    accessorKey: 'type',
    header: 'Tipo de pago',
  },
  {
    accessorKey: 'price',
    header: () => <div className="text-right">Precio</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      return <div className="text-right">{price.toFixed(2)} €</div>;
    },
  },
  {
    accessorKey: 'discount',
    header: 'Descuento',
    cell: ({ row }) => `${row.getValue('discount')}%`,
  },
  {
    accessorKey: 'total',
    header: () => <div className="text-right">Total</div>,
    cell: ({ row }) => {
      const total = parseFloat(row.getValue('total'));
      return <div className="text-right font-medium">{total.toFixed(2)} €</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => <span className="capitalize">{row.getValue('status')}</span>,
  },
  {
    accessorKey: 'paymentDate',
    header: 'Fecha de pago',
    cell: ({ row }) => new Date(row.getValue('paymentDate')).toLocaleDateString('es-ES'),
  },
  {
    accessorKey: 'nextPaymentDate',
    header: 'Próximo pago',
    cell: ({ row }) =>
      row.getValue('nextPaymentDate')
        ? new Date(row.getValue('nextPaymentDate')).toLocaleDateString('es-ES')
        : '—',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Ver usuario</DropdownMenuItem>
            <DropdownMenuItem>Ver detalles</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
