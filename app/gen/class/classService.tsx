import type { PutClassData } from '@/hooks/class/use-put-class';
import { axiosInstance } from '@/lib/client';
import { UserData } from '@/types/user';
import type { AxiosRequestConfig } from 'axios';

function classUrl(): string {
  const baseUrl = '/api/class';
  const url = new URL(baseUrl, 'http://localhost:4000');

  return url.pathname + url.search;
}

export async function deleteClass(
  data: { id: string },
  config: AxiosRequestConfig = {},
): Promise<{ message: string }> {
  const url = classUrl();

  const response = await axiosInstance.delete<{ message: string }>(url, {
    ...config,
    data,
  });

  return response.data;
}

export async function postClass(
  data: any,
  config: AxiosRequestConfig = {},
): Promise<UserData[]> {
  const url = classUrl();

  const response = await axiosInstance.post<UserData[]>(url, data, config);

  return response.data;
}

export async function putClass(
  data: PutClassData,
  config: AxiosRequestConfig = {},
): Promise<any> {
  const url = classUrl();

  const response = await axiosInstance.put(url, data, config);

  return response.data;
}

export async function getClass(config: AxiosRequestConfig = {}): Promise<UserData[]> {
  const url = classUrl();

  const response = await axiosInstance.get<UserData[]>(url, config);

  return response.data;
}
