import { axiosInstance } from '@/lib/client';
import { RolesType } from '@/types';
import { UserData } from '@/types/user';
import type { AxiosRequestConfig } from 'axios';

interface GetUsersParams {
  roles?: RolesType;
  dni?: UserData['dni'];
  email?: UserData['email'];
}

function getUsersUrl(params: GetUsersParams = {}): string {
  const baseUrl = '/api/users'; // Esto funciona si estás del lado cliente o usando un proxy
  const url = new URL(baseUrl, 'http://localhost:4000'); // dummy base para usar URL

  if (params?.roles) {
    url.searchParams.set('roles', params?.roles);
  }

  if (params?.dni) {
    url.searchParams.set('dni', params?.dni);
  }

  if (params?.email) {
    url.searchParams.set('email', params?.email);
  }

  return url.pathname + url.search;
}

export async function getUsers(
  params: GetUsersParams = {},
  config: AxiosRequestConfig = {},
): Promise<UserData[]> {
  const url = getUsersUrl(params);

  const response = await axiosInstance.get<UserData[]>(url, config);

  return response.data;
}
