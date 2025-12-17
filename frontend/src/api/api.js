import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend server URL
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
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

export default api;

// Habit completions
export const toggleHabitCompletion = async (habitId, date, completed = true) => {
  const response = await api.post('/habit-completions', { 
    habitId, 
    date: new Date(date).toISOString().split('T')[0],
    completed 
  });
  return response.data;
};

export const getHabitCompletions = async (startDate, endDate) => {
  const response = await api.get('/habit-completions', {
    params: {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }
  });
  return response.data;
};
