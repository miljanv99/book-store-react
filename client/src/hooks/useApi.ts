import axios, { AxiosRequestConfig } from 'axios';
import { useCallback, useState } from 'react';
import { apiConfig } from '../services';

type ApiResponseResult<T> = {
  data: T | null;
  sendRequest: (config: AxiosRequestConfig) => Promise<void>;
};

export const useApi = <T = any>(): ApiResponseResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const sendRequest = useCallback(async (config: AxiosRequestConfig) => {
    try {
      const response = await apiConfig(config);
      setData(response.data);
      console.log('useAPI response: ', response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      } else {
        console.log(error);
      }
      setData(null);
    }
  }, []);

  return { data, sendRequest };
};
