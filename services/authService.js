// services/authService.js
import { httpClient, handleApiError } from "../utils/httpClient";
import { TokenService } from "../utils/tokenService";
import toastUtils from "../utils/toastUtils";
import toast from "react-hot-toast";

const AuthService = {
  // Login user
  login: async (email, password, showToast = false) => {
    let loadingToastId;

    try {
      if (showToast) {
        loadingToastId = toastUtils.loading("Logging in...");
      }

      const response = await httpClient.post("/api/v1/auth/login", {
        email,
        password,
      });

      // Handle the login response with your specific structure
      if (response.data.success && response.data.data) {
        const { token, ...userData } = response.data.data;

        // Save the token and user data
        TokenService.saveToken(token);
        TokenService.saveUserData(userData);

        if (showToast) {
          // Dismiss loading toast and show success
          if (loadingToastId) toast.dismiss(loadingToastId);
          toastUtils.success("Login successful! Welcome back.");
        }
      }

      return response.data;
    } catch (error) {
      if (showToast) {
        // Dismiss loading toast and show error
        if (loadingToastId) toast.dismiss(loadingToastId);
        toastUtils.handleApiError(error);
      }
      throw handleApiError(error);
    }
  },

  // Register new user
  register: async (userData, showToast = false) => {
    let loadingToastId;

    try {
      if (showToast) {
        loadingToastId = toastUtils.loading("Creating your account...");
      }

      const response = await httpClient.post("/api/v1/auth/register", userData);

      if (showToast && response.data.success) {
        if (loadingToastId) toast.dismiss(loadingToastId);
        toastUtils.success("Account created successfully!");
      }

      return response.data;
    } catch (error) {
      if (showToast) {
        if (loadingToastId) toast.dismiss(loadingToastId);
        toastUtils.handleApiError(error);
      }
      throw handleApiError(error);
    }
  },

  // Verify email with OTP
  verifyEmail: async (email, otp, showToast = false) => {
    let loadingToastId;

    try {
      if (showToast) {
        loadingToastId = toastUtils.loading("Verifying OTP...");
      }

      const response = await httpClient.post("/api/v1/auth/verifyotp", {
        email,
        otp,
      });

      if (showToast && response.data.success) {
        if (loadingToastId) toast.dismiss(loadingToastId);
        toastUtils.success("Email verified successfully!");
      }

      return response.data;
    } catch (error) {
      if (showToast) {
        if (loadingToastId) toast.dismiss(loadingToastId);
        toastUtils.handleApiError(error);
      }
      throw handleApiError(error);
    }
  },

  // Request password reset
  forgotPassword: async (email, showToast = false) => {
    let loadingToastId;

    try {
      if (showToast) {
        loadingToastId = toastUtils.loading("Sending reset email...");
      }

      const response = await httpClient.post(
        "/api/v1/auth/send-password-change-email",
        { email }
      );

      if (showToast && response.data.success) {
        if (loadingToastId) toast.dismiss(loadingToastId);
        toastUtils.success("Password reset email sent!");
      }

      return response.data;
    } catch (error) {
      if (showToast) {
        if (loadingToastId) toast.dismiss(loadingToastId);
        toastUtils.handleApiError(error);
      }
      throw handleApiError(error);
    }
  },

  // Verify password reset PIN
  verifyPasswordPin: async (email, pin, showToast = false) => {
    let loadingToastId;

    try {
      if (showToast) {
        loadingToastId = toastUtils.loading("Verifying PIN...");
      }

      const response = await httpClient.post("/api/v1/auth/verifypin", {
        email,
        pin,
      });

      if (showToast && response.data.success) {
        if (loadingToastId) toast.dismiss(loadingToastId);
        toastUtils.success("PIN verified successfully!");
      }

      return response.data;
    } catch (error) {
      if (showToast) {
        if (loadingToastId) toast.dismiss(loadingToastId);
        toastUtils.handleApiError(error);
      }
      throw handleApiError(error);
    }
  },

  // Change password
  changePassword: async (
    email,
    password,
    confirmPassword,
    showToast = false
  ) => {
    let loadingToastId;

    try {
      if (showToast) {
        loadingToastId = toastUtils.loading("Updating password...");
      }

      const response = await httpClient.post("/api/v1/auth/change-password", {
        email,
        password,
        confirmPassword,
      });

      if (showToast && response.data.success) {
        if (loadingToastId) toast.dismiss(loadingToastId);
        toastUtils.success("Password updated successfully!");
      }

      return response.data;
    } catch (error) {
      if (showToast) {
        if (loadingToastId) toast.dismiss(loadingToastId);
        toastUtils.handleApiError(error);
      }
      throw handleApiError(error);
    }
  },

  // Logout user
  logout: (showToast = false) => {
    TokenService.removeToken();
    TokenService.removeUserData();

    if (showToast) {
      toastUtils.success("Logged out successfully!");
    }

    // Optionally call logout API endpoint
    // return httpClient.post('/auth/logout');
  },

  // Create PIN
  createPin: async (user_id, pin, showToast = false) => {
    let loadingToastId;

    try {
      if (showToast) {
        loadingToastId = toastUtils.loading("Creating PIN...");
      }

      const response = await httpClient.post("/user/create-pin", {
        user_id,
        pin,
      });

      if (showToast && response.data.success) {
        if (loadingToastId) toast.dismiss(loadingToastId);
        toastUtils.success("PIN created successfully!");
      }

      return response.data;
    } catch (error) {
      if (showToast) {
        if (loadingToastId) toast.dismiss(loadingToastId);
        toastUtils.handleApiError(error);
      }
      throw handleApiError(error);
    }
  },

  // Verify PIN
  verifyPin: async (user_id, pin, showToast = false) => {
    let loadingToastId;

    try {
      if (showToast) {
        loadingToastId = toastUtils.loading("Verifying PIN...");
      }

      const response = await httpClient.post("/user/verify-pin", {
        user_id,
        pin,
      });

      if (showToast && response.data.success) {
        if (loadingToastId) toast.dismiss(loadingToastId);
        toastUtils.success("PIN verified successfully!");
      }

      return response.data;
    } catch (error) {
      if (showToast) {
        if (loadingToastId) toast.dismiss(loadingToastId);
        toastUtils.handleApiError(error);
      }
      throw handleApiError(error);
    }
  },

  // Fill profile data
  fillProfileData: async (profileData, showToast = false) => {
    let loadingToastId;

    try {
      if (showToast) {
        loadingToastId = toastUtils.loading("Updating profile...");
      }

      // Create a FormData object for the request
      const formDataToSend = new FormData();

      // Add all text fields
      if (profileData.firstName)
        formDataToSend.append("firstName", profileData.firstName);
      if (profileData.lastName)
        formDataToSend.append("lastName", profileData.lastName);
      if (profileData.username)
        formDataToSend.append("username", profileData.username);
      if (profileData.dateOfBirth)
        formDataToSend.append("dateOfBirth", profileData.dateOfBirth);
      if (profileData.email) formDataToSend.append("email", profileData.email);
      if (profileData.mobile)
        formDataToSend.append("mobile", profileData.mobile);
      if (profileData.address)
        formDataToSend.append("address", profileData.address);
      if (profileData.user_id)
        formDataToSend.append("user_id", profileData.user_id);

      // Add the image file if it exists
      if (profileData.image instanceof File) {
        formDataToSend.append("image", profileData.image);
      }

      // Send request to the correct endpoint
      const response = await httpClient.post(
        "/api/v1/user/fill-data",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Ensure cookies with auth token are sent
        }
      );

      if (showToast && response.data.success) {
        if (loadingToastId) toast.dismiss(loadingToastId);
        toastUtils.success("Profile updated successfully!");
      }

      return response.data;
    } catch (error) {
      if (showToast) {
        if (loadingToastId) toast.dismiss(loadingToastId);
        toastUtils.handleApiError(error);
      }
      throw handleApiError(error);
    }
  },

  // Get user info
  getUserInfo: async (showToast = false) => {
    let loadingToastId;

    try {
      if (showToast) {
        loadingToastId = toastUtils.loading("Loading user information...");
      }

      const response = await httpClient.get("/api/v1/user/user-info");

      if (showToast && response.data.success) {
        if (loadingToastId) toast.dismiss(loadingToastId);
        // Don't show success toast for fetching user info as it's automatic
      }

      return response.data;
    } catch (error) {
      if (showToast) {
        if (loadingToastId) toast.dismiss(loadingToastId);
        toastUtils.handleApiError(error);
      }
      throw handleApiError(error);
    }
  },

  // Update user profile
  updateUserProfile: async (profileData, showToast = false) => {
    let loadingToastId;

    try {
      if (showToast) {
        loadingToastId = toastUtils.loading("Updating profile...");
      }

      const response = await httpClient.put(
        "/api/v1/user/update-profile",
        profileData
      );

      if (showToast && response.data.success) {
        if (loadingToastId) toast.dismiss(loadingToastId);
        toastUtils.success("Profile updated successfully!");
      }

      return response.data;
    } catch (error) {
      if (showToast) {
        if (loadingToastId) toast.dismiss(loadingToastId);
        toastUtils.handleApiError(error);
      }
      throw handleApiError(error);
    }
  },

  // Upload profile image
  uploadProfileImage: async (imageFile, userId, showToast = false) => {
    let loadingToastId;

    try {
      if (showToast) {
        loadingToastId = toastUtils.loading("Uploading image...");
      }

      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("user_id", userId);

      const response = await httpClient.post(
        "/api/v1/user/upload-profile-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (showToast && response.data.success) {
        if (loadingToastId) toast.dismiss(loadingToastId);
        toastUtils.success("Profile image updated successfully!");
      }

      return response.data;
    } catch (error) {
      if (showToast) {
        if (loadingToastId) toast.dismiss(loadingToastId);
        toastUtils.handleApiError(error);
      }
      throw handleApiError(error);
    }
  },

  // Delete profile image
  deleteProfileImage: async (showToast = false) => {
    let loadingToastId;

    try {
      if (showToast) {
        loadingToastId = toastUtils.loading("Deleting image...");
      }

      const response = await httpClient.delete(
        "/api/v1/user/delete-profile-image"
      );

      if (showToast && response.data.success) {
        if (loadingToastId) toast.dismiss(loadingToastId);
        toastUtils.success("Profile image deleted successfully!");
      }

      return response.data;
    } catch (error) {
      if (showToast) {
        if (loadingToastId) toast.dismiss(loadingToastId);
        toastUtils.handleApiError(error);
      }
      throw handleApiError(error);
    }
  },
};

export default AuthService;
