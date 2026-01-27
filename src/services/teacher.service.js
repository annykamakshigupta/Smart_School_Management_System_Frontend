import axios from "axios";
import BASE_URL from "../config/baseUrl";

const API_URL = `${BASE_URL}`;

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("ssms_token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

/**
 * Get current teacher's profile ID from storage
 */
const getTeacherProfileId = () => {
  const userData = localStorage.getItem("ssms_user");
  if (!userData) {
    throw new Error("User not authenticated");
  }
  const user = JSON.parse(userData);
  // roleProfile contains the teacher profile data with _id
  if (user.roleProfile && user.roleProfile._id) {
    return user.roleProfile._id;
  }
  throw new Error("Teacher profile not found");
};

/**
 * Get current teacher's assigned classes and subjects
 * Auto-fetches based on logged-in teacher's profile ID
 */
export const getMyAssignments = async () => {
  try {
    const teacherId = getTeacherProfileId();
    const response = await axios.get(
      `${API_URL}/admin/teachers/${teacherId}/assignments`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching assignments",
    );
  }
};

/**
 * Get students in a specific class
 */
export const getStudentsByClass = async (classId) => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/students/class/${classId}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching students");
  }
};

/**
 * Get teacher's schedule
 */
export const getMySchedule = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/schedules/teacher`,
      getAuthHeaders(),
    );
    // Normalize to legacy shape expected by TeacherDashboard (array)
    return { data: response.data?.data?.items || [] };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching schedule");
  }
};

/**
 * Get subjects assigned to teacher
 */
export const getMySubjects = async () => {
  try {
    const teacherId = getTeacherProfileId();
    const response = await axios.get(
      `${API_URL}/subjects?teacherId=${teacherId}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching subjects");
  }
};

/**
 * Get classes assigned to teacher (as class teacher)
 */
export const getMyClasses = async () => {
  try {
    const teacherId = getTeacherProfileId();
    const response = await axios.get(
      `${API_URL}/classes?classTeacher=${teacherId}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching classes");
  }
};

export default {
  getMyAssignments,
  getStudentsByClass,
  getMySchedule,
  getMySubjects,
  getMyClasses,
};
