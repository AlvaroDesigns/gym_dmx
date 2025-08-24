export type ClassTypes = 'classes' | 'zones' | undefined;
export type RolesType = 'ADMIN' | 'USER' | 'EMPLOYEE';

export const ZONE_TYPE: ClassTypes = 'zones';
export const CLASS_TYPE: ClassTypes = 'classes';

export const ROLES_ADMIN: RolesType[] = ['ADMIN'];
export const ROLES_USER: RolesType[] = ['USER'];
export const ROLES_EMPLOYEE: RolesType[] = ['EMPLOYEE'];

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
