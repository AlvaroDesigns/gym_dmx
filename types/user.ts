import { Gender, Role } from '@prisma/client';

export interface UserData {
  id?: string;
  name: string;
  surname: string;
  lastName?: string;
  dni: string;
  email: string;
  phone: string;
  gender: Gender;
  address: string;
  postalCode: string;
  province: string;
  country: string;
  roles?: Role[];
  password?: string;
  instagram?: string | null;
  tiktok?: string | null;
  privateProfile?: boolean;
  active?: boolean;
  createdAt?: string;
}

export interface UserUpdateData {
  name?: string;
  surname?: string;
  lastName?: string;
  gender?: Gender;
  dni?: string;
  phone?: string;
  postalCode?: string;
  address?: string;
  city?: string;
  country?: string;
  province?: string;
  email?: string;
  roles?: Role[];
  password?: string;
  instagram?: string | null;
  tiktok?: string | null;
  privateProfile?: boolean;
}
