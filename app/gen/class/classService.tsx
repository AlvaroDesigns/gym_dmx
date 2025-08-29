import type { PutClassData } from '@/hooks/class/use-put-class';
import { axiosInstance } from '@/lib/client';

import type { ClassData, ClassItem } from '@/types';
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
  data: ClassData,
  config: AxiosRequestConfig = {},
): Promise<ClassItem> {
  const url = classUrl();

  const response = await axiosInstance.post<ClassItem>(url, data, config);

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

export async function getClass(config: AxiosRequestConfig = {}): Promise<ClassItem[]> {
  const url = classUrl();

  const response = await axiosInstance.get<ClassItem[]>(url, config);

  return response.data;
}
