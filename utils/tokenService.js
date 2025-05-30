// utils/tokenService.js
import { httpClient } from "./httpClient";

export const TokenService = {
  // Save token to cookie
  saveToken: (token) => {
    if (typeof window !== "undefined") {
      const cookieExpiry = 24 * 60 * 60; // 24 hours
      document.cookie = `auth_token=${token}; max-age=${cookieExpiry}; path=/; ${
        process.env.NODE_ENV !== "development" ? "secure; " : ""
      }samesite=strict`;
    }
  },

  // Get token from cookie
  getToken: () => {
    if (typeof window !== "undefined") {
      const cookies = document.cookie.split(";");
      const authCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("auth_token=")
      );
      return authCookie ? authCookie.split("=")[1] : null;
    }
    return null;
  },

  // Remove token from cookie
  removeToken: () => {
    if (typeof window !== "undefined") {
      document.cookie =
        "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  },

  // Save user data to localStorage
  saveUserData: (userData) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user_data", JSON.stringify(userData));
    }
  },

  // Get user data from localStorage
  getUserData: () => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user_data");
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },

  // Remove user data from localStorage
  removeUserData: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user_data");
    }
  },

  // Clear all stored data
  clearAll: () => {
    TokenService.removeToken();
    TokenService.removeUserData();
  },
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = TokenService.getToken();
  return !!token;
};

// Get current user from localStorage
export const getCurrentUser = () => {
  return TokenService.getUserData();
};

// Fetch fresh user data from the server
export const fetchUserData = async () => {
  try {
    if (!isAuthenticated()) {
      return null;
    }

    const response = await httpClient.get("/api/v1/user/user-info");

    if (response.data.success) {
      // Update stored user data with fresh data
      TokenService.saveUserData(response.data.data);
      return response.data;
    } else {
      // If API call fails, clear stored data
      TokenService.clearAll();
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    // If unauthorized or network error, clear stored data
    if (error.response?.status === 401) {
      TokenService.clearAll();
    }
    return null;
  }
};
