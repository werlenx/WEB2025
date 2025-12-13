import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = 'http://localhost:3333';

const getAuthToken = (): string | null => {
  return window.localStorage.getItem('authToken');
};

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        if (status === 401 && typeof window !== 'undefined') {
            console.error('Sessão expirada ou não autorizada (401). Redirecionamento forçado.');

            window.localStorage.removeItem('authToken');
            window.location.href = '/login';

            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);


export default apiClient;

export const saveToken = (token: string) => {
    window.localStorage.setItem('authToken', token);
};

export const clearToken = () => {
    window.localStorage.removeItem('authToken');
};