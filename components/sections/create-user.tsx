'use client';

import { PersonalDataForm } from '@/components/form/PersonalDataForm';
import { PostalDataForm } from '@/components/form/PostalDataForm';
import { Button } from '@/components/ui/button';

import { Form } from '@/components/ui/form';
import { FormSchema } from '@/config/schema';
import { z } from '@/lib/zod';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

export default function CreateUserForm({
  form,
  onSubmit,
  loading,
  error,
  success,
}: {
  form: UseFormReturn<z.infer<typeof FormSchema>>;
  onSubmit: (data: z.infer<typeof FormSchema>) => void;
  loading: boolean;
  error: boolean;
  success: boolean;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full">
        <PersonalDataForm form={form} />
        <PostalDataForm form={form} />
        <Button className="h-12 mt-3 w-full" type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
        {success && toast.success('Usuario creado exitosamente!')}
        {error &&
          toast.error(
            'Error al crear usuario. Por favor, verifica que el DNI y email no estén duplicados.',
          )}
      </form>
    </Form>
  );
}
