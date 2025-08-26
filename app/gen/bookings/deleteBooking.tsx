import axios, { AxiosRequestConfig } from 'axios';

export type DeleteBookingPayload = {
  classId: string;
  dateTime?: string; // 'YYYY-MM-DDTHH:mm'
  date?: string; // 'YYYY-MM-DD'
  startTime?: string; // 'HH:mm'
};

function bookingsUrl(): string {
  const baseUrl = '/api/bookings';
  const url = new URL(baseUrl, 'http://localhost:4000');
  return url.pathname + url.search;
}

export async function deleteBooking(
  data: DeleteBookingPayload,
  config: AxiosRequestConfig = {},
): Promise<{ message: string }> {
  const url = bookingsUrl();

  const response = await axios.delete<{ message: string }>(url, {
    ...config,
    data,
  });

  return response.data;
}
