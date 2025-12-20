import api from "./axios";

export default api;

const formatDateForAPI = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const toggleHabitCompletion = async (
  habitId,
  date,
  completed = true
) => {
  try {
    const formattedDate = formatDateForAPI(date);

    const response = await api.post("/habit-completions", {
      habitId,
      date: formattedDate,
      completed,
    });

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

    let completions = [];
    if (Array.isArray(response.data)) {
      completions = response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      completions = response.data.data;
    }

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
