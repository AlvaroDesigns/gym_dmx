export type ClassTypes = 'classes' | 'zones' | undefined;

export const ZONE_TYPE: ClassTypes = 'zones';
export const CLASS_TYPE: ClassTypes = 'classes';

export interface ClassData {
  name: string;
  description: string;
  maxCapacity: number;
  room: string;
  zoneId?: string | null;
}

export interface ZoneData {
  name: string;
  description?: string;
  imageUrl?: string;
}
