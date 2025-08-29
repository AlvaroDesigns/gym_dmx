'use client';

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconGripVertical,
} from '@tabler/icons-react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent } from '@/components/ui/tabs';

// Create a separate component for the drag handle
function DragHandle({ id }: { id: string | number }) {
  const { attributes, listeners } = useSortable({
    id: id.toString(),
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

function DraggableRow<TData>({
  row,
  columns,
  enableDrag = true,
}: {
  row: Row<TData>;
  columns: ColumnDef<TData>[];
  enableDrag?: boolean;
}) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: (row.original as any).id?.toString() || row.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && 'selected'}
      data-dragging={isDragging}
      ref={enableDrag ? setNodeRef : undefined}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={
        enableDrag
          ? {
              transform: CSS.Transform.toString(transform),
              transition: transition,
            }
          : undefined
      }
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  enableDrag?: boolean;
  enableSelection?: boolean;
  enablePagination?: boolean;
  enableColumnVisibility?: boolean;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  pageSize?: number;
  showTabs?: boolean;
  customActions?: React.ReactNode;
  onDataChange?: (data: TData[]) => void;
  getRowId?: (row: TData) => string;
  manualPagination?: boolean;
  pageCount?: number;
  onPageChange?: (pageIndex: number, pageSize: number) => void;
}

export function DataTable<TData>({
  data: initialData,
  columns,
  enableDrag = true,
  enableSelection = true,
  enablePagination = true,
  enableColumnVisibility = true,
  enableSorting = true,
  enableFiltering = true,
  pageSize = 10,
  showTabs = true,
  customActions,
  onDataChange,
  getRowId,
  manualPagination = false,
  pageCount,
  onPageChange,
}: DataTableProps<TData>) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize,
  });
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  // Update data when initialData changes
  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () =>
      data?.map((item) => getRowId?.(item) || (item as any).id?.toString() || '') || [],
    [data, getRowId],
  );

  // Add drag column if enabled
  const finalColumns = React.useMemo(() => {
    const cols = [...columns];

    if (enableDrag) {
      cols.unshift({
        id: 'drag',
        header: () => null,
        cell: ({ row }) => (
          <DragHandle
            id={getRowId?.(row.original) || (row.original as any).id || row.id}
          />
        ),
      });
    }

    if (enableSelection) {
      cols.unshift({
        id: 'select',
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && 'indeterminate')
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      });
    }

    return cols;
  }, [columns, enableDrag, enableSelection, getRowId]);

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: {
      sorting: enableSorting ? sorting : [],
      columnVisibility: enableColumnVisibility ? columnVisibility : {},
      rowSelection: enableSelection ? rowSelection : {},
      columnFilters: enableFiltering ? columnFilters : [],
      pagination: enablePagination ? pagination : { pageIndex: 0, pageSize: data.length },
    },
    getRowId: (row) =>
      getRowId?.(row) || (row as any).id?.toString() || Math.random().toString(),
    enableRowSelection: enableSelection,
    enableSorting,
    enableColumnFilters: enableFiltering,
    onRowSelectionChange: enableSelection ? setRowSelection : undefined,
    onSortingChange: enableSorting ? setSorting : undefined,
    onColumnFiltersChange: enableFiltering ? setColumnFilters : undefined,
    onColumnVisibilityChange: enableColumnVisibility ? setColumnVisibility : undefined,
    onPaginationChange: enablePagination
      ? (updater) => {
          setPagination((prev) => {
            const next = typeof updater === 'function' ? (updater as any)(prev) : updater;
            if (manualPagination) {
              onPageChange?.(next.pageIndex, next.pageSize);
            }
            return next;
          });
        }
      : undefined,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination,
    pageCount: manualPagination ? pageCount ?? -1 : undefined,
  });

  function handleDragEnd(event: DragEndEvent) {
    if (!enableDrag) return;

    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((currentData) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        const newData = arrayMove(currentData, oldIndex, newIndex);
        onDataChange?.(newData);
        return newData;
      });
    }
  }

  const tableContent = (
    <div className="overflow-hidden rounded-lg border">
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
        id={sortableId}
      >
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:first:w-8">
            {table.getRowModel().rows?.length ? (
              enableDrag ? (
                <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow
                      key={row.id}
                      row={row}
                      columns={finalColumns}
                      enableDrag={enableDrag}
                    />
                  ))}
                </SortableContext>
              ) : (
                table
                  .getRowModel()
                  .rows.map((row) => (
                    <DraggableRow
                      key={row.id}
                      row={row}
                      columns={finalColumns}
                      enableDrag={false}
                    />
                  ))
              )
            ) : (
              <TableRow>
                <TableCell colSpan={finalColumns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DndContext>
    </div>
  );

  const paginationContent = enablePagination && (
    <div className="flex items-center justify-between px-4">
      <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
        {table.getFilteredSelectedRowModel().rows.length} of{' '}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex w-full items-center gap-8 lg:w-fit">
        <div className="hidden items-center gap-2 lg:flex">
          <Label htmlFor="rows-per-page" className="text-sm font-medium">
            Rows per page
          </Label>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              const newSize = Number(value);
              if (manualPagination) {
                onPageChange?.(table.getState().pagination.pageIndex, newSize);
              }
              table.setPageSize(newSize);
            }}
          >
            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-fit items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <IconChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <IconChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <IconChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <IconChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );

  if (showTabs) {
    return (
      <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6">
        <TabsContent
          value="outline"
          className="relative flex flex-col gap-4 overflow-auto"
        >
          {tableContent}
          {paginationContent}
        </TabsContent>
        <TabsContent value="past-performance" className="flex flex-col px-4 lg:px-6">
          <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
        </TabsContent>
        <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
          <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
        </TabsContent>
        <TabsContent value="focus-documents" className="flex flex-col px-4 lg:px-6">
          <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
        </TabsContent>
      </Tabs>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {tableContent}
      {paginationContent}
    </div>
  );
}

// Export a simpler version for basic use cases
export function SimpleDataTable<TData>({
  data,
  columns,
  ...props
}: Omit<
  DataTableProps<TData>,
  'showTabs' | 'enableDrag' | 'enableSelection' | 'enableColumnVisibility'
>) {
  return (
    <DataTable
      data={data}
      columns={columns}
      showTabs={false}
      enableDrag={false}
      enableSelection={false}
      enableColumnVisibility={false}
      {...props}
    />
  );
}
