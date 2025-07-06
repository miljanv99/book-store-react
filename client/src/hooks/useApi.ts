import axios, { AxiosRequestConfig } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { apiConfig } from '../services';

type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

type ApiResponseResult<T> = {
  data: T | null;
  sendRequest: (config: AxiosRequestConfig) => Promise<void>;
  status: RequestStatus;
  message: string;
};

export const useApi = <T = any>(): ApiResponseResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [message, setMessage] = useState<string>('');
  const sendRequest = useCallback(async (config: AxiosRequestConfig) => {
    try {
      const response = await apiConfig(config);
      setData(response.data);
      setStatus('success');
      setMessage(response.data['message']);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      } else {
        console.log(error);
      }
      setData(null);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    console.log('useAPI status: ', status);
    console.log('useAPI message: ', message);
  }, [status, message]);

  return { data, sendRequest, status, message };
};
