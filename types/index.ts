// Tipos compartidos para horarios de clases
import type { Weekday } from '@prisma/client';

export type ClassTypes = 'classes' | 'zones' | undefined;
export type RolesType = 'ADMIN' | 'USER' | 'EMPLOYEE';
export type DifficultyType = 'EASY' | 'MEDIUM' | 'HARD';

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

export interface ParticipantData {
  id: string;
  name: string | null;
  surname: string | null;
  instagram?: string | null;
  tiktok?: string | null;
}

export interface ClassEvent {
  id: string;
  date: string; // formato YYYY-MM-DD
  label: string;
  color?: string;
  description?: string;
  room?: string;
  startTime?: string;
  endTime?: string;
  participants?: number;
  maxCapacity?: number;
  monitor?: string;
  participantsList?: Array<ParticipantData>;
}

export interface ScheduleInput {
  weekday: Weekday;
  monitor: string;
  difficulty: DifficultyType;
  capacity: number;
  startTime: string;
  endTime: string;
}
