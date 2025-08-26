import { axiosInstance } from '@/lib/client';
import { UserData } from '@/types/user';
import type { AxiosRequestConfig } from 'axios';

function getClassUrl(): string {
  const baseUrl = '/api/class'; // Esto funciona si estás del lado cliente o usando un proxy
  const url = new URL(baseUrl, 'http://localhost:4000'); // dummy base para usar URL

  return url.pathname + url.search;
}

export async function getClass(config: AxiosRequestConfig = {}): Promise<UserData[]> {
  const url = getClassUrl();

  const response = await axiosInstance.get<UserData[]>(url, config);

  return response.data;
}
