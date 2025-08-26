import axios, { AxiosRequestConfig } from 'axios';

export type PostBookingPayload = {
  classId: string;
  // admite una de estas dos opciones
  dateTime?: string; // 'YYYY-MM-DDTHH:mm'
  date?: string; // 'YYYY-MM-DD'
  startTime?: string; // 'HH:mm'
};

export interface BookingResponse {
  id: string;
  userId: string;
  classId: string;
  date: string; // ISO
}

function postBookingUrl(): string {
  const baseUrl = '/api/bookings';
  const url = new URL(baseUrl, 'http://localhost:4000');
  return url.pathname + url.search;
}

export async function postBooking(
  data: PostBookingPayload,
  config: AxiosRequestConfig = {},
): Promise<BookingResponse> {
  const url = postBookingUrl();
  const response = await axios.post<BookingResponse>(url, data, config);
  return response.data;
}
