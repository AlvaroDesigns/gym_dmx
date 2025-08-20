import { UserData } from '@/types/user';
import axios, { AxiosRequestConfig } from 'axios';

function getZonesUrl(): string {
  const baseUrl = '/api/zones'; // Esto funciona si estás del lado cliente o usando un proxy
  const url = new URL(baseUrl, 'http://localhost:4000'); // dummy base para usar URL

  return url.pathname + url.search;
}

export async function getZones(config: AxiosRequestConfig = {}): Promise<UserData[]> {
  const url = getZonesUrl();

  const response = await axios.get<UserData[]>(url, config);

  return response.data;
}
