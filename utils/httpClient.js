// utils/httpClient.js
import axios from "axios";
import { TokenService, isAuthenticated, getCurrentUser } from "./tokenService";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

// Create a custom axios instance
const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor for adding the auth token
httpClient.interceptors.request.use(
  (config) => {
    const token = TokenService.getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token expiration and errors
httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration (401 Unauthorized)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // Here you could implement token refresh logic if needed
      // For now, we'll just log the user out on token expiration
      TokenService.removeToken();
      TokenService.removeUserData();

      // Redirect to login page if we're in the browser context
      if (typeof window !== "undefined") {
        window.location.href = "/auth/signin";
      }

      return Promise.reject(error);
    }

    // Handle other types of errors
    return Promise.reject(error);
  }
);

// Helper to standardize error handling
const handleApiError = (error) => {
  // Create a standardized error object
  const apiError = {
    status: error.response?.status || 500,
    message: "Something went wrong",
    data: null,
  };

  // Use the error message from the API if available
  if (error.response?.data) {
    apiError.message =
      error.response.data.error ||
      error.response.data.message ||
      apiError.message;
    apiError.data = error.response.data.data || null;
  }

  // Network errors
  if (error.message === "Network Error") {
    apiError.message =
      "Unable to connect to the server. Please check your internet connection.";
  }

  // Timeout errors
  if (error.code === "ECONNABORTED") {
    apiError.message =
      "The request took too long to complete. Please try again.";
  }

  return apiError;
};

// API wrapper functions for generic CRUD operations
const API = {
  // Generic CRUD methods
  get: async (url, params = {}) => {
    try {
      const response = await httpClient.get(url, { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  post: async (url, data = {}) => {
    try {
      const response = await httpClient.post(url, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  put: async (url, data = {}) => {
    try {
      const response = await httpClient.put(url, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  delete: async (url) => {
    try {
      const response = await httpClient.delete(url);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // File upload method
  upload: async (url, formData, onProgress = null) => {
    try {
      const response = await httpClient.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: onProgress
          ? (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(percentCompleted);
            }
          : undefined,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Re-export the authentication helper functions for backward compatibility
export { httpClient, handleApiError, isAuthenticated, getCurrentUser };
export default API;
