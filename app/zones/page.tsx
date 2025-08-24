'use client';

import EditSheetForm from '@/components/form/EditSheetForm';
import { ProductLayout } from '@/components/layout/product';
import { ClassSection } from '@/components/sections/class-sections';
import { LITERALS } from '@/data/literals';
import { getFieldsModalZones } from '@/data/modals';
import { useGetZones } from '@/hooks/zones/use-get-zones';
import { useCreateZone } from '@/hooks/zones/use-zones';
import { ZONE_TYPE, ZoneData } from '@/types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function Page() {
  const [openClassForm, setOpenClassForm] = useState(false);
  const { data: zones, isLoading } = useGetZones();

  const createZoneMutation = useCreateZone();
  const fields = getFieldsModalZones(ZONE_TYPE);

  const handleCreateZone = (data: ZoneData) => {
    createZoneMutation.mutate(
      { ...data },
      {
        onSuccess: () => {
          toast.success(`${LITERALS.ZONES} ${LITERALS.MESSAGES.CREATE}`);
        },
        onError: () => {
          toast.error(LITERALS.MESSAGES.ERROR);
        },
      },
    );
  };

  const formClass = useForm<ZoneData>({
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
    },
  });

  const onSubmitClass = (data: ZoneData) => {
    handleCreateZone(data);
    setOpenClassForm(false);
    formClass.reset();
  };

  return (
    <ProductLayout
      isView
      buttonProps={{ text: 'Añadir zonas', routingUri: 'custom', type: 'zone' }}
      isLoading={isLoading}
      customButton={
        <EditSheetForm
          open={openClassForm}
          setOpen={setOpenClassForm}
          form={formClass}
          onSubmit={onSubmitClass}
          sizeButton="sm"
          triggerText="Añadir zonas"
          title="Crear nueva zonas"
          description="Añade una nueva zona. Completa los campos y guarda los cambios."
          fields={fields as any}
        />
      }
    >
      <ClassSection data={zones} type={ZONE_TYPE} />
    </ProductLayout>
  );
}
