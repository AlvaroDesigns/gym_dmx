import { axiosInstance } from '@/lib/client';
import { UserData, UserUpdateData } from '@/types/user';
import type { AxiosRequestConfig } from 'axios';

function postUsersUrl(): string {
  const baseUrl = '/api/users'; // Esto funciona si estás del lado cliente o usando un proxy
  const url = new URL(baseUrl, 'http://localhost:4000'); // dummy base para usar URL

  return url.pathname + url.search;
}

export async function postUsers(
  data: UserUpdateData,
  config: AxiosRequestConfig = {},
): Promise<UserData[]> {
  const url = postUsersUrl();

  const response = await axiosInstance.post<UserData[]>(url, data, config);

  return response.data;
}
