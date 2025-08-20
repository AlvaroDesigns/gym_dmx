import axios, { AxiosRequestConfig } from 'axios';

type RolesType = 'ADMIN' | 'USER';

interface UserType {
  lastName: string;
  dni: string | undefined;
  email: string | undefined;
  surname?: string;
  id: string;
  name: string;
  roles: RolesType;
}

function getPaymentsUrl() {
  const baseUrl = '/api/payments'; // Esto funciona si estás del lado cliente o usando un proxy
  const url = new URL(baseUrl, 'http://localhost:4000'); // dummy base para usar URL

  return url.pathname + url.search;
}

export async function getPayments(config: AxiosRequestConfig = {}): Promise<UserType[]> {
  const url = getPaymentsUrl();

  const response = await axios.get<UserType[]>(url, config);

  return response.data;
}
