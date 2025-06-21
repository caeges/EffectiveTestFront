// src/axiosInstance.js
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL || 'https://effitest.onrender.com';

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

// Interceptor para incluir el token JWT automáticamente en cada petición
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  console.log('🔐 Token JWT enviado en header:', token); // Opcional: para depuración
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
