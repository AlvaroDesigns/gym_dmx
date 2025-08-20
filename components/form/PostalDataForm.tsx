'use client';

import { Card } from '@/components/ui/card';
import { FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldValues, UseFormReturn } from 'react-hook-form';

interface PostalDataFormProps<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>;
}

export function PostalDataForm<T extends FieldValues>({ form }: PostalDataFormProps<T>) {
  return (
    <Card className="w-full p-8 gap-4">
      <p className="text-[20px] leading-none font-semibold mb-3">Datos Postales</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="address">Dirección</Label>
              <Input className="h-12" type="text" id="address" {...field} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="postalCode">Código Postal</Label>
              <Input className="h-12" type="text" id="postalCode" {...field} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="province"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="provincia">Provincia</Label>
              <Input className="h-12" type="text" id="provincia" {...field} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="country">País</Label>
              <Input className="h-12" type="text" id="country" {...field} />
            </FormItem>
          )}
        />
      </div>
    </Card>
  );
}
