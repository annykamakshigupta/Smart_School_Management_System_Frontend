import BASE_URL from "../config/baseUrl";
const API_URL = BASE_URL;

// Token storage key (same as auth.service.js)
const TOKEN_KEY = "ssms_token";

// Get auth token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    console.warn("No authentication token found in localStorage");
    console.log("Available localStorage keys:", Object.keys(localStorage));
  } else {
    console.log("Token found in localStorage");
  }
  return token;
};

// Create headers with auth token
const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const scheduleService = {
  /**
   * Create a new schedule
   */
  async createSchedule(scheduleData) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Not authenticated. Please login first.");
      }

      console.log(
        "Creating schedule with token:",
        token ? "Token exists" : "No token"
      );

      const response = await fetch(`${API_URL}/schedules`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(scheduleData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          console.error(
            "Authentication failed. Token may be invalid or expired."
          );
          throw new Error("Authentication failed. Please login again.");
        }
        throw new Error(data.message || "Failed to create schedule");
      }

      return data;
    } catch (error) {
      console.error("Error creating schedule:", error);
      throw error;
    }
  },

  /**
   * Get all schedules with optional filters
   */
  async getSchedules(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${API_URL}/schedules${queryParams ? `?${queryParams}` : ""}`;

      const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          console.error("Authentication failed. Please login again.");
          // Optionally redirect to login
          // window.location.href = '/login';
        }
        throw new Error(data.message || "Failed to fetch schedules");
      }

      return data;
    } catch (error) {
      console.error("Error fetching schedules:", error);
      throw error;
    }
  },

  /**
   * Get a single schedule by ID
   */
  async getScheduleById(scheduleId) {
    try {
      const response = await fetch(`${API_URL}/schedules/${scheduleId}`, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch schedule");
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update a schedule
   */
  async updateSchedule(scheduleId, updateData) {
    try {
      const response = await fetch(`${API_URL}/schedules/${scheduleId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update schedule");
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a schedule
   */
  async deleteSchedule(scheduleId) {
    try {
      const response = await fetch(`${API_URL}/schedules/${scheduleId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete schedule");
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get weekly schedule for a class
   */
  async getWeeklyScheduleForClass(classId, section, academicYear) {
    try {
      const queryParams = academicYear ? `?academicYear=${academicYear}` : "";
      const response = await fetch(
        `${API_URL}/schedules/class/${classId}/section/${section}${queryParams}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          console.error("Authentication failed. Please login again.");
        }
        throw new Error(data.message || "Failed to fetch weekly schedule");
      }

      return data;
    } catch (error) {
      console.error("Error fetching class schedule:", error);
      throw error;
    }
  },

  /**
   * Get weekly schedule for a teacher
   */
  async getWeeklyScheduleForTeacher(teacherId, academicYear) {
    try {
      const queryParams = academicYear ? `?academicYear=${academicYear}` : "";
      const response = await fetch(
        `${API_URL}/schedules/teacher/${teacherId}${queryParams}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          console.error("Authentication failed. Please login again.");
        }
        throw new Error(data.message || "Failed to fetch weekly schedule");
      }

      return data;
    } catch (error) {
      console.error("Error fetching teacher schedule:", error);
      throw error;
    }
  },
};

export default scheduleService;
