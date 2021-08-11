import axios, { AxiosRequestConfig } from 'axios';

import { setupCache } from 'axios-cache-adapter';

const config: AxiosRequestConfig = { baseURL: process.env.NEXT_PUBLIC_BASE_PATH || '' };

const cache = setupCache({
  readHeaders: true, // this is used to cache data based on max-age headers
});

const axiosInstance = axios.create({
  ...config,
  adapter: cache.adapter,
});

export const fetcher = async (resource: any, init: any) =>
  axiosInstance
    .get(resource, init)
    .then((res) => res.data)
    .catch((error) => {
      console.error(error); //eslint-disable-line
      throw error;
    });

export default axiosInstance;
