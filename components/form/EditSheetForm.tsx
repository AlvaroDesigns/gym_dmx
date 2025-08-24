'use client';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';

import { FieldValues, Path } from 'react-hook-form';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DatePicker } from '../datePicker';

type FieldOption = {
  value: string;
  label: string;
};

// Ahora FieldConfig recibe T
type FieldConfig<T extends FieldValues> =
  | {
      type: 'text' | 'textarea' | 'number' | 'time';
      name: Path<T>;
      label: string;
      placeholder?: string;
      defaultValue?: string;
    }
  | {
      type: 'date';
      name: Path<T>;
      label: string;
      placeholder?: string;
      maxDate?: Date;
    }
  | {
      type: 'select';
      name: Path<T>;
      label: string;
      placeholder?: string;
      options: FieldOption[];
      searchable?: boolean;
    }
  | {
      type: 'slider';
      name: Path<T>;
      label: string;
      defaultValue?: number[];
      max?: number;
      step?: number;
      suffix?: string;
    };

export interface EditSheetFormProps<T extends FieldValues = FieldValues> {
  open: boolean;
  fullWidth?: boolean;
  startButtonContent?: React.ReactNode;
  endButtonContent?: React.ReactNode;
  sizeButton?: 'default' | 'sm';
  setOpen: (open: boolean) => void;
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  triggerText?: string;
  title?: string;
  description?: string;
  fields: FieldConfig<T>[];
}

function SearchableTimeSelect({
  value,
  onValueChange,
  placeholder,
  options,
}: {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options: string[];
}) {
  const [query, setQuery] = React.useState('');
  const filtered = React.useMemo(() => {
    const q = query.trim();
    if (!q) return options;
    return options.filter((opt) => opt.toLowerCase().includes(q.toLowerCase()));
  }, [options, query]);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full min-h-12">
        <SelectValue placeholder={placeholder || 'Selecciona hora'} />
      </SelectTrigger>
      <SelectContent>
        <div className="p-2 sticky top-0 bg-background">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar..."
            className="h-9"
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
        <SelectGroup>
          {filtered.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function SearchableSelect({
  value,
  onValueChange,
  placeholder,
  options,
}: {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options: FieldOption[];
}) {
  const [query, setQuery] = React.useState('');
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (opt) => opt.label.toLowerCase().includes(q) || opt.value.toLowerCase().includes(q),
    );
  }, [options, query]);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full min-h-12">
        <SelectValue placeholder={placeholder || 'Selecciona'} />
      </SelectTrigger>
      <SelectContent>
        <div className="p-2 sticky top-0 bg-background">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar..."
            className="h-9"
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
        <SelectGroup>
          {filtered.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default function EditSheetForm<T extends FieldValues>({
  fullWidth = false,
  startButtonContent,
  endButtonContent,
  sizeButton = 'default',
  open,
  setOpen,
  form,
  onSubmit,
  triggerText = 'Editar',
  title = 'Editar',
  description = 'Modifica tus datos aquí. Guarda los cambios cuando termines.',
  fields,
}: EditSheetFormProps<T>) {
  const timeOptions = React.useMemo(() => {
    const start = dayjs().startOf('day');
    return Array.from({ length: 24 * 4 }, (_, i) =>
      start.add(i * 15, 'minute').format('HH:mm'),
    );
  }, []);

  return (
    <Sheet open={open} onOpenChange={(open: boolean) => setOpen(open)}>
      <SheetTrigger asChild>
        <Button
          className={cn(
            `${sizeButton === 'default' ? 'h-12 text-sm w-full ' : 'h-10'}`,
            `${fullWidth ? 'w-full' : 'sm:w-auto'}`,
          )}
          variant="default"
          size={sizeButton}
        >
          {startButtonContent}
          {triggerText}
          {endButtonContent}
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 px-5 overflow-y-auto mb-4"
          >
            {fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={() => (
                  <FormItem>
                    <Label htmlFor={field.name}>{field.label}</Label>

                    {(field.type === 'text' || field.type === 'number') && (
                      <Input
                        id={field.name}
                        placeholder={field.placeholder ?? ''}
                        type={field.type}
                        className="h-12"
                        value={form.watch(field.name) ?? ''}
                        onChange={(e) =>
                          (form as any).setValue(field.name, e.target.value)
                        }
                      />
                    )}

                    {field.type === 'date' && (
                      <DatePicker
                        id={field.name}
                        placeholder={field.placeholder ?? ''}
                        className="h-12"
                        value={form.watch(field.name) ?? ''}
                        maxDate={field.maxDate}
                        onChange={(dateStr) =>
                          (form as any).setValue(field.name, dateStr)
                        }
                      />
                    )}

                    {field.type === 'time' && (
                      <SearchableTimeSelect
                        value={form.watch(field.name) ?? ''}
                        onValueChange={(value) =>
                          (form as any).setValue(field.name, value)
                        }
                        placeholder={field.placeholder}
                        options={timeOptions}
                      />
                    )}

                    {field.type === 'textarea' && (
                      <Textarea
                        id={field.name}
                        placeholder={field.placeholder ?? ''}
                        value={form.watch(field.name) ?? ''}
                        onChange={(e) =>
                          (form as any).setValue(field.name, e.target.value)
                        }
                      />
                    )}

                    {field.type === 'select' &&
                      (field.searchable ? (
                        <SearchableSelect
                          value={form.watch(field.name) ?? ''}
                          onValueChange={(value) =>
                            (form as any).setValue(field.name, value)
                          }
                          placeholder={field.placeholder}
                          options={field.options}
                        />
                      ) : (
                        <Select
                          value={form.watch(field.name) ?? ''}
                          onValueChange={(value) =>
                            (form as any).setValue(field.name, value)
                          }
                        >
                          <SelectTrigger className="w-full min-h-12">
                            <SelectValue
                              placeholder={field.placeholder || 'Selecciona'}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {field.options?.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      ))}

                    {field.type === 'slider' && (
                      <div>
                        <Slider
                          value={[form.watch(field.name) ?? 0]}
                          max={field.max || 100}
                          step={field.step || 1}
                          onValueChange={(value) =>
                            (form as any).setValue(field.name, value[0])
                          }
                        />
                        {field.suffix && (
                          <span className="text-muted-foreground text-sm">
                            {form.watch(field.name) ?? 0} {field.suffix}
                          </span>
                        )}
                      </div>
                    )}
                  </FormItem>
                )}
              />
            ))}
          </form>
        </Form>
        <SheetFooter>
          <Button className="h-12" type="submit" onClick={form.handleSubmit(onSubmit)}>
            Guardar Cambios
          </Button>
          <SheetClose asChild>
            <Button className="h-12" variant="outline">
              Cerrar
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
