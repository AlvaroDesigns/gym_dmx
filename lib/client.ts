import axios, { AxiosRequestConfig } from 'axios';

export const axiosInstance = axios.create({
  baseURL: '/',
});

axiosInstance.interceptors.request.use(
  async (config) => {
    config.headers['Content-Type'] = 'application/json';
    config.headers['x-nn-internal-origin'] = 'Web';
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Accept'] = '*/*';

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export type AxiosInstance = typeof axiosInstance;

export type RequestConfig<TData = unknown> = {
  url?: string;
  method: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE';
  params?: object;
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

export const client = async <TData, TError = unknown, TVariables = unknown>(
  config: RequestConfig<TVariables>,
): Promise<ResponseConfig<TData>> => {
  const url = new URL(config.url ?? '');
  const query = new URLSearchParams(url.search);

  config.params = config.params ?? {};

  if (query.size > 0) {
    query.forEach((value, key) => {
      config.params[key] = value;
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
