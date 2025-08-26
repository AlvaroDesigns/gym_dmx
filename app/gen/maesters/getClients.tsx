import { axiosInstance } from '@/lib/client';
import type { AxiosRequestConfig } from 'axios';

export interface MaestresResponse {
  employees: Array<{ text: string; value: string }>;
  zones: Array<{ text: string; value: string }>;
  classes: Array<{ text: string; value: string }>;
}

function getMaestresUrl() {
  const baseUrl = '/api/maestres'; // Esto funciona si estás del lado cliente o usando un proxy
  const url = new URL(baseUrl, 'http://localhost:4000'); // dummy base para usar URL

  return url.pathname + url.search;
}

function getMaestresUrlZones() {
  const baseUrl = '/api/maestres/zones';
  const url = new URL(baseUrl, 'http://localhost:4000');
  return url.pathname + url.search;
}

export async function getMaestres(
  config: AxiosRequestConfig = {},
): Promise<MaestresResponse> {
  const url = getMaestresUrl();

  const response = await axiosInstance.get<MaestresResponse>(url, config);

  return response.data;
}

export interface ZonesResponse {
  zones: Array<{ text: string; value: string }>;
}

export async function getMaestresZones(
  config: AxiosRequestConfig = {},
): Promise<ZonesResponse> {
  const url = getMaestresUrlZones();

  const response = await axiosInstance.get<ZonesResponse>(url, config);

  return response.data;
}
