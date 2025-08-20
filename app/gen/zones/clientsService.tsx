import { UserData } from '@/types/user';
import axios, { AxiosRequestConfig } from 'axios';

function zonesUrl(): string {
  const baseUrl = '/api/zones';
  const url = new URL(baseUrl, 'http://localhost:4000');

  return url.pathname + url.search;
}

export async function deleteZones(
  data: { id: string },
  config: AxiosRequestConfig = {},
): Promise<{ message: string }> {
  const url = zonesUrl();

  const response = await axios.delete<{ message: string }>(url, {
    ...config,
    data,
  });

  return response.data;
}

export async function getZones(config: AxiosRequestConfig = {}): Promise<UserData[]> {
  const url = zonesUrl();

  const response = await axios.get<UserData[]>(url, config);

  return response.data;
}
