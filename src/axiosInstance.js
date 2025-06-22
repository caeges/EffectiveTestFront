// src/axiosInstance.js
import axios from 'axios';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token JWT a cada request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para manejar respuestas 401 (token expirado o inválido)
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;
    const message = error.response?.data;

    if (status === 401 && message === 'Token expirado') {
      toast.warning('⚠️ Tu sesión ha expirado. Inicia sesión nuevamente.');
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('user');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    }

    if (status === 401 && message === 'Token inválido') {
      toast.error('❌ Token inválido. Por favor, vuelve a iniciar sesión.');
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('user');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
