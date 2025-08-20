import { UserData } from '@/types/user';
import axios, { AxiosRequestConfig } from 'axios';

function calendarUrl(): string {
  const baseUrl = '/api/events';
  const url = new URL(baseUrl, 'http://localhost:4000');

  return url.pathname + url.search;
}

export interface CalendarEventDto {
  id: string;
  date: string; // YYYY-MM-DD
  label: string;
  description?: string;
  color: string;
  room: string;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  participants: number;
  maxCapacity: number;
}

export async function getCalendar(
  params: { startDate: string; endDate: string },
  config: AxiosRequestConfig = {},
): Promise<CalendarEventDto[]> {
  const base = calendarUrl();
  const url = `${base}?startDate=${encodeURIComponent(params.startDate)}&endDate=${encodeURIComponent(
    params.endDate,
  )}`;

  const response = await axios.get<CalendarEventDto[]>(url, config);
  return response.data;
}

export async function deleteCalendar(
  data: { id: string },
  config: AxiosRequestConfig = {},
): Promise<{ message: string }> {
  const url = calendarUrl();

  const response = await axios.delete<{ message: string }>(url, {
    ...config,
    data,
  });

  return response.data;
}

export interface PostCalendarPayload {
  className: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  room: string;
  maxCapacity: number;
  monitor: string; // userId del monitor
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export async function postCalendar(
  data: PostCalendarPayload,
  config: AxiosRequestConfig = {},
): Promise<UserData[]> {
  const url = calendarUrl();

  const response = await axios.post<UserData[]>(url, data, config);

  return response.data;
}
