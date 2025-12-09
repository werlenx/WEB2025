import axios from 'axios';

// Create axios instance
// Note: We use the /api proxy defined in vite.config.ts to avoid CORS issues locally
// and keeping the base url simpler.
// If the backend is running on a different port/host in prod, env vars should be used.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login if 401
      localStorage.removeItem('token');
      // Ideally we should use the router to redirect, but window.location is a fallback
      if (!window.location.pathname.includes('/auth')) {
         window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);
