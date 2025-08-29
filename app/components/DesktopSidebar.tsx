// File: components/DesktopSidebar.js
"use client";
import { useState, useEffect } from "react";

export default function DesktopSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingServices, setPendingServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Fetch pending services on component mount
  useEffect(() => {
    fetchPendingServices();
  }, []);

  const fetchPendingServices = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user ID from localStorage
      let userData, user, userId;

      if (typeof window !== "undefined" && window.localStorage) {
        try {
          userData = localStorage.getItem("user_data");
          if (!userData) {
            setError("User not found. Please log in again.");
            setLoading(false);
            return;
          }
          user = JSON.parse(userData);
          userId = user.user_id || user.id;

          if (!userId) {
            setError("Invalid user data. Please log in again.");
            setLoading(false);
            return;
          }
        } catch (parseError) {
          setError("Invalid user data. Please log in again.");
          setLoading(false);
          return;
        }
      } else {
        setError("localStorage not available.");
        setLoading(false);
        return;
      }

      // API call to fetch user services
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "https://api.klinner.com";
      const apiUrl = `${API_BASE_URL}/api/v1/user/services/${userId}`;

      // Get auth token
      let authToken = null;

      // Try to get token from cookie first
      if (typeof document !== "undefined") {
        const cookies = document.cookie.split(";");
        const authCookie = cookies.find((cookie) =>
          cookie.trim().startsWith("auth_token=")
        );
        if (authCookie) {
          authToken = authCookie.split("=")[1];
        }
      }

      // Fallback to localStorage if no cookie
      if (!authToken && typeof window !== "undefined" && window.localStorage) {
        authToken =
          localStorage.getItem("auth_token") || localStorage.getItem("token");
      }

      if (!authToken) {
        setError("Authentication required. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error (${response.status})`);
      }

      const result = await response.json();

      if (result.success) {
        // Filter pending services and get the 3 latest
        const allServices = result.data;
        const pendingOnly = allServices
          .filter((item) => item.booking.progress === "pending")
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);

        // Transform data for display
        const transformedServices = pendingOnly.map((item) => ({
          id: item._id,
          serviceName: item.serviceCategory,
          bookingDate: item.booking.bookingDate,
          bookingTime: item.booking.bookingTime,
          location: item.booking.location,
          price: `₦${item.serviceRate.toLocaleString()}`,
          areas: item.areas || [],
        }));

        setPendingServices(transformedServices);
      } else {
        setError("Failed to fetch services");
      }
    } catch (error) {
      console.error("Error fetching pending services:", error);
      setError("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatScheduleDate = (dateString, timeString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Format time
    const formatTime = (timeStr) => {
      if (!timeStr) return "";
      const [hours, minutes] = timeStr.split(":");
      const hour = parseInt(hours, 10);
      if (hour === 0) return "12:00 AM";
      if (hour < 12) return `${hour}:${minutes} AM`;
      if (hour === 12) return `12:${minutes} PM`;
      return `${hour - 12}:${minutes} PM`;
    };

    // Check if it's today or tomorrow
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${formatTime(timeString)}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${formatTime(timeString)}`;
    } else {
      const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      };
      return date.toLocaleDateString("en-US", options);
    }
  };

  // Render schedule items
  const renderScheduleItems = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={fetchPendingServices}
            className="text-xs text-red-800 underline mt-1"
          >
            Try again
          </button>
        </div>
      );
    }

    if (pendingServices.length === 0) {
      return (
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-500">No pending services</p>
          <p className="text-xs text-gray-400 mt-1">
            Book a new service to see it here
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {pendingServices.map((service, index) => (
          <div
            key={service.id}
            className="flex items-center p-3 bg-indigo-50 rounded-lg"
          >
            <div className="w-2 h-10 bg-indigo-600 rounded-full mr-3"></div>
            <div className="flex-1">
              <p className="font-medium text-indigo-600">
                {service.serviceName}
              </p>
              <p className="text-sm text-gray-500">
                {formatScheduleDate(service.bookingDate, service.bookingTime)}
              </p>
              <p className="text-xs text-gray-400">{service.location}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-indigo-600">
                {service.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Desktop version - visible only on large screens */}
      <div className="hidden lg:block col-span-3 bg-white rounded-lg shadow-sm p-6 h-fit">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-indigo-600 text-lg">My Schedule</h3>
            {!loading && (
              <button
                onClick={fetchPendingServices}
                className="text-xs text-indigo-500 hover:text-indigo-700"
                title="Refresh"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}
          </div>
          {renderScheduleItems()}
        </div>

       
      </div>

      {/* Mobile dropdown version - visible only on small/medium screens */}
      <div className="lg:hidden px-4 mb-6">
        <button
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
        >
          <div className="flex items-center">
            <span className="font-bold text-indigo-600">My Schedule</span>
            {pendingServices.length > 0 && (
              <span className="ml-2 bg-indigo-100 text-indigo-600 text-xs px-2 py-1 rounded-full">
                {pendingServices.length}
              </span>
            )}
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-indigo-600 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        {/* Dropdown content */}
        <div
          className={`mt-2 bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {isOpen && (
            <div className="p-4">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-indigo-600 text-lg">
                    My Schedule
                  </h3>
                  {!loading && (
                    <button
                      onClick={fetchPendingServices}
                      className="text-xs text-indigo-500 hover:text-indigo-700"
                      title="Refresh"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                {renderScheduleItems()}
              </div>

             
            </div>
          )}
        </div>
      </div>
    </>
  );
}
