import axios from 'axios';

const api = axios.create({
  // Backend URL on Render
  baseURL: import.meta.env.VITE_API_URL || 'https://medflow-aow2.onrender.com',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
