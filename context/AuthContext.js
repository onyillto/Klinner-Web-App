"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthService from "./../services/authService";
import {
  isAuthenticated,
  getCurrentUser,
  TokenService,
  fetchUserData,
} from "../utils/tokenService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      if (typeof window !== "undefined") {
        if (isAuthenticated()) {
          // Fetch fresh user data from server using token
          const userData = await fetchUserData();

          if (userData && userData.success) {
            setUser(userData.data);
          } else {
            // If fetch fails, clear invalid token and logout
            TokenService.clearAll();
            setUser(null);
          }
        }
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Define the login function
  const loginUser = async (email, password) => {
    try {
      const response = await AuthService.login(email, password);

      if (response.success) {
        // Fetch complete user data after login using the new endpoint
        const userData = await fetchUserData();
        if (userData && userData.success) {
          setUser(userData.data);
        }

        return { success: true };
      } else {
        return { success: false, message: response.error || "Login failed" };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || "An error occurred during login",
      };
    }
  };

  // Register function
  const registerUser = async (userData) => {
    try {
      const response = await AuthService.register(userData);
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message || "Registration failed",
      };
    }
  };

  // Logout function
  const logoutUser = () => {
    AuthService.logout();
    setUser(null);
    router.push("/auth/signin"); // Fixed typo: sigin -> signin
  };

  // Refresh user data function
  const refreshUserData = async () => {
    if (isAuthenticated()) {
      const userData = await fetchUserData();
      if (userData && userData.success) {
        setUser(userData.data);
        return userData.data;
      }
    }
    return null;
  };

  // Context values
  const values = {
    user,
    loading,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    refreshUserData, // Updated function name
    isAuthenticated: () => isAuthenticated(),
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
