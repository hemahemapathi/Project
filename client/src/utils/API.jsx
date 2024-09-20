import axios from "axios";

// Set up base URL for the API
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api", // Update with your backend URL
});

// Helper function for setting headers with token
const getAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

/* --- PROJECT ROUTES --- */

// Get project by projectId
export const getProject = async (projectId, token) => {
  return api.get(`/projects/${projectId}`, getAuthHeaders(token));
};

// Get all projects for a manager
export const getAllManagersProjects = async (token) => {
  return api.get(`/user/myprojects`, getAuthHeaders(token));
};

// Create new project
export const createProject = async (projectData, token) => {
  return api.post(`/projects`, projectData, getAuthHeaders(token));
};

// Update existing project
export const updateProject = async (projectId, projectData, token) => {
  return api.put(`/projects/${projectId}`, projectData, getAuthHeaders(token));
};

// Delete project by projectId
export const deleteProject = async (projectId, token) => {
  return api.delete(`/projects/${projectId}`, getAuthHeaders(token));
};

/* --- FEATURE ROUTES --- */

// Get all features by projectId
export const getAllFeatures = async (projectId, token) => {
  return api.get(`/projects/${projectId}/features`, getAuthHeaders(token));
};

// Get feature by projectId and featureId
export const getFeature = async (projectId, featureId, token) => {
  return api.get(`/projects/${projectId}/features/${featureId}`, getAuthHeaders(token));
};

// Create new feature
export const createFeature = async (projectId, featureData, token) => {
  return api.post(`/projects/${projectId}/features`, featureData, getAuthHeaders(token));
};

// Update feature by featureId
export const updateFeature = async (projectId, featureId, featureData, token) => {
  return api.put(`/projects/${projectId}/features/${featureId}`, featureData, getAuthHeaders(token));
};

// Delete feature by featureId
export const deleteFeature = async (projectId, featureId, token) => {
  return api.delete(`/projects/${projectId}/features/${featureId}`, getAuthHeaders(token));
};

/* --- TASK ROUTES --- */

// Get all tasks by projectId and featureId
export const getAllTasks = async (projectId, featureId, token) => {
  return api.get(`/projects/${projectId}/features/${featureId}/tasks`, getAuthHeaders(token));
};

// Get task by taskId
export const getTask = async (projectId, featureId, taskId, token) => {
  return api.get(`/projects/${projectId}/features/${featureId}/tasks/${taskId}`, getAuthHeaders(token));
};

// Create new task
export const createTask = async (projectId, featureId, taskData, token) => {
  return api.post(`/projects/${projectId}/features/${featureId}/tasks`, taskData, getAuthHeaders(token));
};

// Update task by taskId
export const updateTask = async (projectId, featureId, taskId, taskData, token) => {
  return api.put(`/projects/${projectId}/features/${featureId}/tasks/${taskId}`, taskData, getAuthHeaders(token));
};

// Delete task by taskId
export const deleteTask = async (projectId, featureId, taskId, token) => {
  return api.delete(`/projects/${projectId}/features/${featureId}/tasks/${taskId}`, getAuthHeaders(token));
};

/* --- USER ROUTES --- */

// Get current user info
export const getUser = async (token) => {
  return api.get(`/user/me`, getAuthHeaders(token));
};

// Sign up new user
export const signupUser = async (userData) => {
  return api.post(`/user`, userData);
};

// Log in existing user
export const loginUser = async (userData) => {
  return api.post(`/user/login`, userData);
};

/* --- TEAM MEMBER ROUTES --- */

// Get all team members for manager
export const getAllManagersTeamMembers = async (token) => {
  return api.get(`/user/myteam`, getAuthHeaders(token));
};

// Get a team member by ID
export const getTeamMember = async (teamMemberId, token) => {
  return api.get(`/teamMembers/${teamMemberId}`, getAuthHeaders(token));
};

// Create a new team member
export const createTeamMember = async (teamMemberData, token) => {
  return api.post(`/teamMembers`, teamMemberData, getAuthHeaders(token));
};

// Update a team member by ID
export const updateTeamMember = async (teamMemberId, teamMemberData, token) => {
  return api.put(`/teamMembers/${teamMemberId}`, teamMemberData, getAuthHeaders(token));
};

// Delete a team member by ID
export const deleteTeamMember = async (teamMemberId, token) => {
  return api.delete(`/teamMembers/${teamMemberId}`, getAuthHeaders(token));
};

// Add team member API function
export const addTeamMember = async (teamMemberData, token) => {
  try {
    const response = await api.post(`/teamMembers`, teamMemberData, getAuthHeaders(token));
    return response;
  } catch (err) {
    console.error("Error adding team member:", err);
    throw err;
  }
};
export const assignProjectToUser = async (userId, projectId, token) => {
  return api.post(`/user/${userId}/projects/${projectId}`, {}, getAuthHeaders(token));
};