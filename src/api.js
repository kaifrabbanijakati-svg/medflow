import axios from 'axios';

const api = axios.create({
  // Replace the URL below with your actual Render backend URL
  baseURL: import.meta.env.VITE_API_URL || 'https://your-render-url-here.onrender.com',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
