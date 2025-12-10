import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333',
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
