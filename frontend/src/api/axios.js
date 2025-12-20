import axios from 'axios';

const getBaseURL = () => {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  // Remove trailing slash if present and append /api
  return `${base.replace(/\/+$/, '')}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true
});

// Add request interceptor to include the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
