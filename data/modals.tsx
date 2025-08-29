import type { FieldConfig } from '@/components/form/EditSheetForm';
import { MAX_DAY_FOR_CALENDAR } from '@/config/configuration';
import { ClassData, ClassTypes, ZoneData } from '@/types';
import dayjs from 'dayjs';

type ClassOrZoneForm = ClassData | ZoneData;

export const getEditFieldsModalZones = (
  type: ClassTypes,
  name: string,
  description: string,
  room: string,
  maxCapacity: number,
): FieldConfig<ClassOrZoneForm>[] => {
  if (type === 'zones') {
    return [
      {
        type: 'text',
        name: 'name',
        label: 'Nombre de la zona',
        placeholder: 'Ingresa el nombre de la zona',
        defaultValue: name,
      },
      {
        type: 'textarea',
        name: 'description',
        label: 'Descripción de la clase',
        placeholder: 'Ingresa la descripción de la zona',
        defaultValue: description,
      },
    ];
  }

  return [
    {
      type: 'text',
      name: 'name',
      label: 'Nombre de la clase',
      placeholder: 'Ingresa el nombre de la clase',
      defaultValue: name,
    },
    {
      type: 'textarea',
      name: 'description',
      label: 'Descripción de la clase',
      placeholder: 'Ingresa la descripción de la clase',
      defaultValue: description,
    },
    {
      type: 'select',
      name: 'room',
      label: 'Sala',
      placeholder: 'Selecciona la sala',
      searchable: false,
      options: [
        { label: `Sala ${room}`, value: room },
        { label: 'Sala 1', value: 'sala1' },
        { label: 'Sala 2', value: 'sala2' },
        { label: 'Sala 3', value: 'sala3' },
      ],
    },
    {
      type: 'slider',
      name: 'maxCapacity',
      label: `Capacidad (${maxCapacity})`,
      defaultValue: [maxCapacity],
      max: 100,
      step: 1,
      suffix: 'personas',
    },
  ];
};

export function getFieldsModalZones(type: 'classes'): FieldConfig<ClassData>[];
export function getFieldsModalZones(type: 'zones'): FieldConfig<ZoneData>[];
export function getFieldsModalZones(type: ClassTypes): FieldConfig<ClassOrZoneForm>[] {
  if (type === 'zones') {
    return [
      {
        type: 'text',
        name: 'name',
        label: 'Nombre de la zona',
        placeholder: 'Ingresa el nombre de la zona',
      },
      {
        type: 'textarea',
        name: 'description',
        label: 'Descripción de la zona',
        placeholder: 'Ingresa la descripción de la zona',
      },
      {
        type: 'text',
        name: 'imageUrl',
        label: 'URL de la imagen',
        placeholder: 'Ingresa la URL de la imagen de la zona',
      },
    ];
  }

  return [
    {
      type: 'text',
      name: 'name',
      label: 'Nombre de la clase',
      placeholder: 'Ingresa el nombre de la clase',
    },
    {
      type: 'textarea',
      name: 'description',
      label: 'Descripción de la clase',
      placeholder: 'Ingresa la descripción de la clase',
    },
    {
      type: 'select',
      name: 'room',
      label: 'Sala',
      placeholder: 'Selecciona la sala',
      searchable: true,
      options: [
        { label: `Sala ${1}`, value: 'sala1' },
        { label: 'Sala 1', value: 'sala1' },
        { label: 'Sala 2', value: 'sala2' },
        { label: 'Sala 3', value: 'sala3' },
      ],
    },
    {
      type: 'slider',
      name: 'maxCapacity',
      label: `Capacidad (${20})`,
      defaultValue: [20],
      max: 100,
      step: 1,
      suffix: 'personas',
    },
  ];
}

type SelectOption = { label: string; value: string };
export interface CalendarFormData {
  className: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  maxCapacity: number;
  monitor: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export const getFieldsModalCalendar = (data?: {
  employees?: SelectOption[];
  zones?: SelectOption[];
  classes?: SelectOption[];
}): FieldConfig<CalendarFormData>[] => {
  const { employees = [], zones = [], classes = [] } = data ?? {};

  return [
    {
      type: 'select',
      name: 'className',
      label: 'Nombre de la clase *',
      placeholder: 'Ej: Yoga, Spinning, Pilates',
      searchable: true,
      options: classes,
    },
    {
      type: 'date',
      name: 'date',
      label: 'Fecha *',
      placeholder: 'Elige tu fecha de tu actividad',
      maxDate: dayjs().add(MAX_DAY_FOR_CALENDAR, 'day').toDate(),
    },
    {
      type: 'time',
      name: 'startTime',
      label: 'Hora de inicio *',
    },
    {
      type: 'time',
      name: 'endTime',
      label: 'Hora de fin *',
    },
    {
      type: 'select',
      name: 'room',
      label: 'Sala *',
      placeholder: 'Ej: Sala 1, Studio A',
      searchable: true,
      options: zones,
    },
    {
      type: 'number',
      name: 'maxCapacity',
      label: 'Capacidad máxima *',
    },
    {
      type: 'select',
      name: 'monitor',
      label: 'Nombre del monitor',
      placeholder: 'Ej: Juan Perez',
      searchable: true,
      options: employees,
    },
    {
      type: 'select',
      name: 'difficulty',
      label: 'Dificultad',
      placeholder: 'Ej: Sala 1, Studio A',
      searchable: true,
      options: [
        { label: 'Fácil', value: 'EASY' },
        { label: 'Media', value: 'MEDIUM' },
        { label: 'Difícil', value: 'HARD' },
      ],
    },
  ];
};
