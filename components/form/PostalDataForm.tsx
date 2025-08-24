'use client';

import { Card } from '@/components/ui/card';
import { FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Path, UseFormReturn } from 'react-hook-form';

type PostalFormFields = {
  address: string;
  postalCode: string;
  province: string;
  country: string;
};

interface PostalDataFormProps<T extends PostalFormFields> {
  form: UseFormReturn<T>;
}

export function PostalDataForm<T extends PostalFormFields>({
  form,
}: PostalDataFormProps<T>) {
  return (
    <Card className="w-full p-8 gap-4">
      <p className="text-[20px] leading-none font-semibold mb-3">Datos Postales</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={'address' as Path<T>}
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="address">Dirección</Label>
              <Input
                className="h-12"
                type="text"
                id="address"
                placeholder="Introduce tu dirección"
                {...field}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={'postalCode' as Path<T>}
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="postalCode">Código Postal</Label>
              <Input
                className="h-12"
                type="text"
                id="postalCode"
                placeholder="Introduce tu codigo postal"
                {...field}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={'province' as Path<T>}
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="province">Provincia</Label>
              <Input
                className="h-12"
                type="text"
                id="province"
                placeholder="Introduce tu provincia"
                {...field}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={'country' as Path<T>}
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="country">País</Label>
              <Input
                className="h-12"
                type="text"
                id="country"
                placeholder="Introduce tu país"
                {...field}
              />
            </FormItem>
          )}
        />
      </div>
    </Card>
  );
}
