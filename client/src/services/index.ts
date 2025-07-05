import axios from 'axios';

export const domain = 'http://localhost:8000';

export const apiConfig = axios.create({
  baseURL: domain,
  headers: {
    'Content-Type': 'application/json'
  }
});
