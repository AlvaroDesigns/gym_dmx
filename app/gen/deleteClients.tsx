import axios, { AxiosRequestConfig } from 'axios';

function deleteUsersUrl(): string {
  const baseUrl = '/api/users';
  const url = new URL(baseUrl, 'http://localhost:4000');

  return url.pathname + url.search;
}

export async function deleteUsers(
  data: { id: string },
  config: AxiosRequestConfig = {},
): Promise<{ message: string }> {
  const url = deleteUsersUrl();

  const response = await axios.delete<{ message: string }>(url, {
    ...config,
    data,
  });

  return response.data;
}
