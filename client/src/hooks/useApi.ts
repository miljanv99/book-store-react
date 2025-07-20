import axios, { AxiosRequestConfig } from 'axios';
import { useCallback } from 'react';

const domain = 'http://localhost:8000';

const apiConfig = axios.create({
  baseURL: domain,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const useApi = <T = any>() => {
  const sendRequest = useCallback(async (config: AxiosRequestConfig) => {
    try {
      const response = await apiConfig<T>(config);
      return {
        data: response.data,
        status: response.status
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
        return error.response;
      } else {
        console.log(error);
      }
    }
  }, []);

  return sendRequest;
};
