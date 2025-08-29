import { axiosInstance } from '@/lib/client';
import { UserData } from '@/types/user';
import type { AxiosRequestConfig } from 'axios';

interface GetUsersParams {
  roles?: string; // admite lista separada por comas
  dni?: UserData['dni'];
  email?: UserData['email'];
  page?: number;
  pageSize?: number;
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

  if (params?.page) {
    url.searchParams.set('page', String(params.page));
  }

  if (params?.pageSize) {
    url.searchParams.set('pageSize', String(params.pageSize));
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

export interface PaginatedUsersResponse {
  data: UserData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getUsersPaginated(
  params: Required<Pick<GetUsersParams, 'page' | 'pageSize'>> &
    Omit<GetUsersParams, 'page' | 'pageSize'>,
  config: AxiosRequestConfig = {},
): Promise<PaginatedUsersResponse> {
  const url = getUsersUrl(params);
  const response = await axiosInstance.get<PaginatedUsersResponse>(url, config);
  return response.data;
}
