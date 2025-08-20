# DataTable Dinámico - Guía de Uso

El componente `DataTable` ha sido refactorizado para ser completamente dinámico y reutilizable en múltiples páginas. Ahora acepta columnas y datos como props, permitiendo una mayor flexibilidad.

## Componentes Disponibles

### 1. DataTable (Completo)

Componente principal con todas las funcionalidades:

- Drag & Drop
- Selección de filas
- Paginación
- Visibilidad de columnas
- Ordenamiento
- Filtrado
- Tabs (opcional)

### 2. SimpleDataTable (Simplificado)

Versión simplificada sin tabs, drag & drop, selección ni visibilidad de columnas:

- Paginación
- Ordenamiento
- Filtrado

## Uso Básico

### 1. Crear las Columnas

Primero, define las columnas para tu tipo de datos:

```typescript
// app/my-page/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface MyDataType {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

export const columns: ColumnDef<MyDataType>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => <p>{row.original.name}</p>,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <p>{row.original.email}</p>,
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: 'actions',
    cell: () => (
      <Button variant="ghost" size="sm">
        Editar
      </Button>
    ),
  },
];
```

### 2. Usar en la Página

```typescript
// app/my-page/page.tsx
'use client';

import { DataTable } from '@/components/data-table';
import { columns, type MyDataType } from './columns';

const data: MyDataType[] = [
  { id: '1', name: 'Juan Pérez', email: 'juan@example.com', status: 'active' },
  { id: '2', name: 'María García', email: 'maria@example.com', status: 'inactive' },
];

export default function Page() {
  return (
    <DataTable
      data={data}
      columns={columns}
      enableDrag={true}
      enableSelection={true}
      enablePagination={true}
      enableColumnVisibility={true}
      showTabs={true}
    />
  );
}
```

## Props Disponibles

### DataTable Props

| Prop                     | Tipo                      | Default | Descripción                           |
| ------------------------ | ------------------------- | ------- | ------------------------------------- |
| `data`                   | `TData[]`                 | -       | Datos a mostrar en la tabla           |
| `columns`                | `ColumnDef<TData>[]`      | -       | Definición de columnas                |
| `enableDrag`             | `boolean`                 | `true`  | Habilitar drag & drop                 |
| `enableSelection`        | `boolean`                 | `true`  | Habilitar selección de filas          |
| `enablePagination`       | `boolean`                 | `true`  | Habilitar paginación                  |
| `enableColumnVisibility` | `boolean`                 | `true`  | Habilitar visibilidad de columnas     |
| `enableSorting`          | `boolean`                 | `true`  | Habilitar ordenamiento                |
| `enableFiltering`        | `boolean`                 | `true`  | Habilitar filtrado                    |
| `pageSize`               | `number`                  | `10`    | Tamaño de página por defecto          |
| `showTabs`               | `boolean`                 | `true`  | Mostrar tabs                          |
| `customActions`          | `React.ReactNode`         | -       | Acciones personalizadas en la toolbar |
| `onDataChange`           | `(data: TData[]) => void` | -       | Callback cuando cambian los datos     |
| `getRowId`               | `(row: TData) => string`  | -       | Función para obtener el ID de la fila |

### SimpleDataTable Props

Hereda todas las props de `DataTable` excepto:

- `showTabs` (siempre `false`)
- `enableDrag` (siempre `false`)
- `enableSelection` (siempre `false`)
- `enableColumnVisibility` (siempre `false`)

## Ejemplos de Uso

### Tabla Simple (Sin funcionalidades avanzadas)

```typescript
import { SimpleDataTable } from '@/components/data-table';

<SimpleDataTable
  data={data}
  columns={columns}
  enablePagination={true}
  enableSorting={true}
/>
```

### Tabla con Acciones Personalizadas

```typescript
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';

<DataTable
  data={data}
  columns={columns}
  customActions={
    <div className="flex gap-2">
      <Button variant="outline" size="sm">
        Exportar
      </Button>
      <Button variant="outline" size="sm">
        Importar
      </Button>
    </div>
  }
/>
```

### Tabla con Callback de Cambios

```typescript
import { DataTable } from '@/components/data-table';

<DataTable
  data={data}
  columns={columns}
  onDataChange={(newData) => {
    console.log('Datos actualizados:', newData);
    // Guardar en estado o enviar a API
  }}
/>
```

### Tabla con ID Personalizado

```typescript
import { DataTable } from '@/components/data-table';

<DataTable
  data={data}
  columns={columns}
  getRowId={(row) => row.customId} // Usar campo personalizado como ID
/>
```

## Migración desde el DataTable Anterior

Si tienes código que usa el DataTable anterior, aquí están los cambios necesarios:

### Antes:

```typescript
import { DataTable } from '@/components/table';

<DataTable data={data} />
```

### Después:

```typescript
import { DataTable } from '@/components/data-table';
import { columns } from './columns';

<DataTable data={data} columns={columns} />
```

## Consideraciones

1. **Tipos**: Asegúrate de que tus datos coincidan con la interfaz definida en las columnas
2. **IDs**: Cada fila debe tener un ID único para el drag & drop y selección
3. **Rendimiento**: Para grandes cantidades de datos, considera usar `enablePagination={true}`
4. **Accesibilidad**: El componente incluye atributos ARIA para accesibilidad

## Archivos de Ejemplo

- `app/class/columns.tsx` - Columnas para clases
- `app/customers/columns.tsx` - Columnas para clientes
- `app/payment/columns.tsx` - Columnas para pagos
- `app/class/page.tsx` - Uso completo del DataTable
- `app/customers/page.tsx` - Uso con datos de API
- `app/payment/page.tsx` - Uso del SimpleDataTable
