'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconDotsVertical } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';

export interface Customer {
  id: string;
  name: string;
  surname: string;
  lastName?: string;
  email: string;
  dni: string;
  phone: string;
  roles: string[];
  createdAt: string;
}

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => {
      const fullName =
        `${row.original.name} ${row.original.surname} ${row.original.lastName || ''}`.trim();
      return <p>{fullName}</p>;
    },
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      return <p className="text-sm text-muted-foreground">{row.original.email}</p>;
    },
  },
  {
    accessorKey: 'dni',
    header: 'DNI',
    cell: ({ row }) => {
      return <p className="font-mono text-sm">{row.original.dni}</p>;
    },
  },
  {
    accessorKey: 'phone',
    header: 'Teléfono',
    cell: ({ row }) => {
      return <p className="text-sm">{row.original.phone}</p>;
    },
  },
  {
    accessorKey: 'roles',
    header: 'Rol',
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.roles.join(', ')}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Fecha de registro',
    cell: ({ row }) => {
      return (
        <p className="text-sm text-muted-foreground">
          {new Date(row.original.createdAt).toLocaleDateString('es-ES')}
        </p>
      );
    },
  },
  {
    id: 'actions',
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Editar</DropdownMenuItem>
          <DropdownMenuItem>Ver perfil</DropdownMenuItem>
          <DropdownMenuItem>Historial</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Eliminar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
