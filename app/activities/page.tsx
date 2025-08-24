'use client';

import { DataTable } from '@/components/data-table';
import EditSheetForm from '@/components/form/EditSheetForm';
import { ProductLayout } from '@/components/layout/product';
import { ClassSection } from '@/components/sections/class-sections';
import { Button } from '@/components/ui/button';
import { getFieldsModalZones } from '@/data/modals';
import { useGetClass } from '@/hooks/class/use-get-class';
import { useCreateClass } from '@/hooks/class/use-post-class';
import { useViewToggle } from '@/hooks/use-view-toggle';

import { LITERALS } from '@/data/literals';
import { CLASS_TYPE, ClassData } from '@/types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { columns } from './columns';

export default function Page() {
  const [openClassForm, setOpenClassForm] = useState(false);
  const { data: classes, isLoading } = useGetClass();

  const createClassMutation = useCreateClass();
  const fields = getFieldsModalZones(CLASS_TYPE);

  const { currentView, handleViewChange } = useViewToggle<'default' | 'compiled'>(
    'default',
    ['default', 'compiled'],
  );

  const handleProductLayoutViewChange = (value: 'default' | 'compiled') => {
    console.log('Cambió a vista:', value);
    handleViewChange(value);
  };

  const handleCreateClass = (data: ClassData) => {
    createClassMutation.mutate(
      {
        ...data,
      },
      {
        onSuccess: () => {
          toast.success(`${LITERALS.CLASS} ${LITERALS.MESSAGES.CREATE}`);
        },
        onError: () => {
          toast.error(LITERALS.MESSAGES.ERROR);
        },
      },
    );
  };

  const formClass = useForm<ClassData>({
    defaultValues: {
      name: '',
      description: '',
      maxCapacity: 0,
      room: '',
    },
  });

  const onSubmitClass = (data: ClassData) => {
    handleCreateClass(data);
    setOpenClassForm(false);
    formClass.reset();
  };

  return (
    <ProductLayout
      isView
      buttonProps={{ text: 'Añadir actividad', routingUri: 'custom', type: 'class' }}
      isLoading={isLoading}
      onChangeView={handleProductLayoutViewChange}
      view={currentView}
      customButton={
        <EditSheetForm
          open={openClassForm}
          setOpen={setOpenClassForm}
          form={formClass}
          onSubmit={onSubmitClass}
          sizeButton="sm"
          triggerText="Añadir actividades"
          title="Crear nueva actividad"
          description="Añade una nueva actividad. Completa los campos y guarda los cambios."
          fields={fields as any}
        />
      }
    >
      {currentView === 'compiled' ? (
        <DataTable
          data={classes ?? []}
          columns={columns}
          enableDrag={true}
          enableSelection={true}
          enablePagination={true}
          enableColumnVisibility={true}
          showTabs={true}
          customActions={
            <Button variant="outline" size="sm">
              <span className="hidden lg:inline">Añadir actividad</span>
            </Button>
          }
        />
      ) : (
        <ClassSection data={classes} type={CLASS_TYPE} />
      )}
    </ProductLayout>
  );
}
