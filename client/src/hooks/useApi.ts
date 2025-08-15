import axios, { AxiosRequestConfig } from 'axios';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthToken } from '../reducers/authSlice';

const domain = 'http://localhost:8000';

export const useApi = <T = any>() => {
  const token = useSelector(selectAuthToken);

  const apiConfig = axios.create({
    baseURL: domain,
    headers: {
      Authorization: `Bearer ${token && token}`,
      'Content-Type': 'application/json'
    }
  });

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
