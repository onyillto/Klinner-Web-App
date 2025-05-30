// utils/toastUtils.js
import toast from "react-hot-toast";

export const toastConfig = {
  position: "top-right",
  duration: 4000,
  style: {
    background: "#363636",
    color: "#fff",
    padding: "16px",
    borderRadius: "8px",
  },
};

export const showSuccessToast = (message, options = {}) => {
  return toast.success(message, {
    ...toastConfig,
    style: {
      ...toastConfig.style,
      background: "#10B981",
    },
    duration: 3000,
    ...options,
  });
};

export const showErrorToast = (message, options = {}) => {
  return toast.error(message, {
    ...toastConfig,
    style: {
      ...toastConfig.style,
      background: "#EF4444",
    },
    ...options,
  });
};

export const showLoadingToast = (message, options = {}) => {
  return toast.loading(message, {
    ...toastConfig,
    ...options,
  });
};

export const showInfoToast = (message, options = {}) => {
  return toast(message, {
    ...toastConfig,
    icon: "ℹ️",
    style: {
      ...toastConfig.style,
      background: "#3B82F6",
    },
    ...options,
  });
};

// Function to handle API errors consistently
export const handleApiErrorToast = (error) => {
  let errorMessage = "An unexpected error occurred";

  if (error.message) {
    errorMessage = error.message;
  } else if (error.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (error.response?.data?.error) {
    errorMessage = error.response.data.error;
  } else if (error.response?.statusText) {
    errorMessage = error.response.statusText;
  }

  return showErrorToast(errorMessage);
};

export default {
  success: showSuccessToast,
  error: showErrorToast,
  loading: showLoadingToast,
  info: showInfoToast,
  handleApiError: handleApiErrorToast,
};
