'use client';

import { Card } from '@/components/ui/card';
import { FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dayjs } from '@/lib/dayjs';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { DatePicker } from '../datePicker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface PersonalDataFormProps<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>;
}

export function PersonalDataForm<T extends FieldValues>({
  form,
}: PersonalDataFormProps<T>) {
  return (
    <Card className="w-full p-8 gap-4">
      <p className="text-[20px] leading-none font-semibold mb-3">Datos Personales</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="surname">Nombre</Label>
              <Input className="h-12" placeholder="Introduce tu nombre" {...field} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="surname"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="surname">Primer Apellido</Label>
              <Input
                className="h-12"
                placeholder="Introduce tu apellido"
                type="text"
                id="surname"
                {...field}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="lastname">Segundo Apellido</Label>
              <Input
                className="h-12"
                type="text"
                id="lastname"
                placeholder="Introduce tu segundo apellido"
                {...field}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dni"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="dni">DNI</Label>
              <Input
                className="h-12"
                type="text"
                id="dni"
                placeholder="Introduce tu segundo dni"
                {...field}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="email">Email</Label>
              <Input
                className="h-12"
                type="email"
                id="email"
                placeholder="Introduce tu email"
                {...field}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                className="h-12"
                type="text"
                id="phone"
                placeholder="Introduce tu segundo telefono"
                {...field}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <Label>Género</Label>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <>
                  <SelectTrigger className="w-full min-h-12">
                    <SelectValue placeholder="Selecciona un genero" />
                  </SelectTrigger>
                </>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Femenino</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <Label>Fecha de Nacimiento</Label>
              <DatePicker
                id="birthDate"
                placeholder="Selecciona una fecha"
                className="w-full min-h-12"
                minDate={dayjs().subtract(80, 'year').startOf('day').toDate()}
                maxDate={dayjs().toDate()}
                {...field}
              />
            </FormItem>
          )}
        />
      </div>
    </Card>
  );
}
