import axios from 'axios';
import { getToken, logout } from '../services/storageService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_KEY = import.meta.env.VITE_API_KEY;

const authErrors = [
  'The link has expired',
  'Invalid token',
  'Resource does not exist',
];

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10 * 60 * 1000,
  headers: {
    'Content-Type': 'application/json',
    'api-key': API_KEY,
    'ngrok-skip-browser-warning': '1',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      if (
        !window.location.href.includes('demo') &&
        !authErrors.includes(error?.response?.data?.message)
      ) {
        logout();
        console.error('Invalid User, Please login again.');
      } else if (error?.response?.data?.message === 'Resource does not exist') {
        console.error('Access Denied: You do not have the necessary permissions to edit this resource.');
      } else {
        console.error('Invalid reference token');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;