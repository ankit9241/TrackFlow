import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Your backend server URL
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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
// Helper function to ensure consistent date formatting
const formatDateForAPI = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Habit completions
export const toggleHabitCompletion = async (
  habitId,
  date,
  completed = true
) => {
  try {
    // Format the date in YYYY-MM-DD format for the API
    const formattedDate = formatDateForAPI(date);

    const response = await api.post("/habit-completions", {
      habitId,
      date: formattedDate,
      completed,
    });

    // Process the response to ensure consistent date format
    if (response.data && response.data.data && response.data.data.entry) {
      const entry = response.data.data.entry;
      return {
        ...response,
        data: {
          ...response.data,
          data: {
            ...response.data.data,
            entry: {
              ...entry,
              // Ensure date is in YYYY-MM-DD format
              date: entry.date ? formatDateForAPI(entry.date) : formattedDate,
            },
          },
        },
      };
    }
    return response;
  } catch (error) {
    console.error("Error toggling habit completion:", error);
    // Add more detailed error logging
    if (error.response) {
      console.error("Response error:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request setup error:", error.message);
    }
    throw error;
  }
};

export const getHabitCompletions = async (startDate, endDate) => {
  try {
    const response = await api.get("/habit-completions", {
      params: {
        startDate: formatDateForAPI(startDate),
        endDate: formatDateForAPI(endDate),
      },
    });

    // Handle different response formats and ensure consistent date format
    let completions = [];
    if (Array.isArray(response.data)) {
      completions = response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      completions = response.data.data;
    }

    // Ensure all dates are in YYYY-MM-DD format
    return completions.map((completion) => ({
      ...completion,
      date: completion.date
        ? new Date(completion.date).toISOString().split("T")[0]
        : null,
    }));
  } catch (error) {
    console.error("Error fetching habit completions:", error);
    return [];
  }
};
