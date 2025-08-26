import axios, { AxiosRequestConfig } from 'axios';

export const axiosInstance = axios.create({
  baseURL: '/',
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    config.headers['Content-Type'] = 'application/json';
    config.headers['x-nn-internal-origin'] = 'Web';
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Accept'] = '*/*';

    // Intenta propagar token de next-auth vía Authorization si existe
    if (typeof document !== 'undefined') {
      const getCookie = (name: string): string | undefined => {
        const match = document.cookie
          .split('; ')
          .find((row) => row.startsWith(name + '='));
        return match ? decodeURIComponent(match.split('=')[1]) : undefined;
      };

      const tokenCookie =
        getCookie('__Secure-next-auth.session-token') ||
        getCookie('next-auth.session-token');
      if (tokenCookie && !config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${tokenCookie}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Redirección global en respuestas 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      if (typeof window !== 'undefined') {
        // En cliente, redirige a la página principal de login
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  },
);

export type AxiosInstance = typeof axiosInstance;

export type RequestConfig<TData = unknown> = {
  url?: string;
  method: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE';
  params?: Record<string, string>;
  data?: TData | FormData;
  responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';
  signal?: AbortSignal;
  headers?: HeadersInit;
};

export type ResponseConfig<TData = unknown> = {
  data: TData;
  status: number;
  statusText: string;
};

export type ResponseErrorConfig<TError = unknown> = {
  error: TError;
  status: number;
  statusText: string;
};

export const client = async <TData, TVariables = unknown>(
  config: RequestConfig<TVariables>,
): Promise<ResponseConfig<TData>> => {
  const url = new URL(config.url ?? '');
  const query = new URLSearchParams(url.search);

  config.params = config.params ?? {};

  if (query.size > 0) {
    config.params = config.params ?? {};
    query.forEach((value, key) => {
      config.params![key] = value;
    });
  }

  const response = await axiosInstance(url.toString(), {
    ...(config as AxiosRequestConfig),
  });

  const data = response.data;

  return {
    data,
    status: response.status,
    statusText: response.statusText,
  };
};

export default client;
