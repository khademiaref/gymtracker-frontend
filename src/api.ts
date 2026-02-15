
import axios, { AxiosError } from 'axios'; // Import AxiosError

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'; // Use Vercel env var or fallback for local dev

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => { // Explicitly type as AxiosError
    return Promise.reject(error);
  }
);

export default api;
