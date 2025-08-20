import { UserData } from '@/types/user';
import axios, { AxiosRequestConfig } from 'axios';

type RolesType = 'ADMIN' | 'USER' | 'EMPLOYEE';

interface GetUsersParams {
  roles?: RolesType;
  dni?: UserData['dni'];
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

  return url.pathname + url.search;
}

export async function getUsers(
  params: GetUsersParams = {},
  config: AxiosRequestConfig = {},
): Promise<UserData[]> {
  const url = getUsersUrl(params);

  const response = await axios.get<UserData[]>(url, config);

  return response.data;
}
