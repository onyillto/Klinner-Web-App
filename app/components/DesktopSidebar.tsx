// File: components/DesktopSidebar.js - Updated for new API and service types
"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function DesktopSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [recentServices, setRecentServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Fetch recent services on component mount
  useEffect(() => {
    fetchRecentServices();
  }, []);

  const fetchRecentServices = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔍 Fetching recent services for sidebar...");

      // Get auth token
      const authToken =
        Cookies.get("auth_token") || localStorage.getItem("auth_token");

      if (!authToken) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      // Use the new API endpoint with limit for recent services
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
      const apiUrl = `${API_BASE_URL}/api/v1/services/my-services?limit=3&sortBy=createdAt&sortOrder=desc`;

      console.log("📡 Making API call to:", apiUrl);

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
      console.log("✅ Sidebar API Response:", result);

      if (result.success && result.data) {
        // Transform services for sidebar display
        const transformedServices = result.data.services.map((service) => ({
          id: service.id,
          service_id: service.service_id,
          serviceName: getServiceDisplayName(service.serviceType, service),
          serviceType: service.serviceType,
          status: service.status,
          paymentStatus: service.paymentStatus,
          bookingDate: service.bookingDate,
          bookingTime: service.bookingTime,
          location: service.location,
          price: `₦${service.serviceRate.toLocaleString()}`,
          serviceIcon: getServiceIcon(service.serviceType),
          serviceColor: getServiceColor(service.serviceType),

          // Service-specific details for display
          ...(service.serviceType === "house_cleaning" && {
            details: service.roomsCount
              ? `${service.roomsCount} rooms`
              : service.package,
          }),
          ...(service.serviceType === "gardening" && {
            details: service.servicesCount
              ? `${service.servicesCount} services`
              : service.gardenSize,
          }),
          ...(service.serviceType === "laundry" && {
            details: service.itemCount
              ? `${service.itemCount} items`
              : service.service,
          }),
          ...(service.serviceType === "repairs" && {
            details: service.repairType || "Repair service",
          }),
          ...(service.serviceType === "move_out" && {
            details: "Moving service",
          }),
        }));

        setRecentServices(transformedServices);
      } else {
        setError("Failed to fetch services");
      }
    } catch (error) {
      console.error("Error fetching recent services:", error);
      if (error.message.includes("401")) {
        setError("Please log in again");
      } else {
        setError("Failed to load services");
      }
    } finally {
      setLoading(false);
    }
  };

  // Get service display name based on type and specific data
  const getServiceDisplayName = (serviceType, service) => {
    const baseNames = {
      house_cleaning: "House Cleaning",
      gardening: "Gardening",
      laundry: "Laundry",
      repairs: "Repair",
      move_out: "Moving",
    };

    const baseName = baseNames[serviceType] || "Service";

    // Add specific details if available
    if (serviceType === "house_cleaning" && service.package) {
      return `${baseName} - ${service.package}`;
    }
    if (serviceType === "gardening" && service.package) {
      return `${baseName} - ${service.package}`;
    }
    if (serviceType === "repairs" && service.repairType) {
      return `${service.repairType} Repair`;
    }

    return baseName;
  };

  // Get service type icon
  const getServiceIcon = (serviceType) => {
    const icons = {
      house_cleaning: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
      ),
      gardening: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
      laundry: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      repairs: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      move_out: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    };

    return (
      icons[serviceType] || (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      )
    );
  };

  // Get service type color
  const getServiceColor = (serviceType) => {
    const colors = {
      house_cleaning: "text-purple-600 bg-purple-50",
      gardening: "text-green-600 bg-green-50",
      laundry: "text-blue-600 bg-blue-50",
      repairs: "text-orange-600 bg-orange-50",
      move_out: "text-indigo-600 bg-indigo-50",
    };

    return colors[serviceType] || "text-gray-600 bg-gray-50";
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date for display
  const formatScheduleDate = (dateString, timeString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Format time - handle time ranges like "8:00 AM - 10:00 AM"
    const formatTime = (timeStr) => {
      if (!timeStr) return "";

      // If it's already formatted (contains AM/PM), return as is
      if (timeStr.includes("AM") || timeStr.includes("PM")) {
        return timeStr;
      }

      // Otherwise format it
      const [hours, minutes] = timeStr.split(":");
      const hour = parseInt(hours, 10);
      if (hour === 0) return "12:00 AM";
      if (hour < 12) return `${hour}:${minutes || "00"} AM`;
      if (hour === 12) return `12:${minutes || "00"} PM`;
      return `${hour - 12}:${minutes || "00"} PM`;
    };

    // Check if it's today or tomorrow
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${formatTime(timeString)}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${formatTime(timeString)}`;
    } else {
      const options: Intl.DateTimeFormatOptions = {
        month: "short" as const,
        day: "numeric" as const,
      };
      return `${date.toLocaleDateString("en-US", options)}, ${formatTime(
        timeString
      )}`;
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
            onClick={fetchRecentServices}
            className="text-xs text-red-800 underline mt-1"
          >
            Try again
          </button>
        </div>
      );
    }

    if (recentServices.length === 0) {
      return (
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-500">No recent services</p>
          <p className="text-xs text-gray-400 mt-1">
            Book a new service to see it here
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {recentServices.map((service) => (
          <div
            key={service.id}
            className={`flex items-center p-3 rounded-lg border ${service.serviceColor}`}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white mr-3">
              {service.serviceIcon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900 truncate">
                  {service.serviceName}
                </p>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(
                    service.status
                  )}`}
                >
                  {service.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {formatScheduleDate(service.bookingDate, service.bookingTime)}
              </p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500 truncate">
                  {service.details && `${service.details} • `}
                  {service.location.length > 20
                    ? `${service.location.substring(0, 20)}...`
                    : service.location}
                </p>
                <p className="text-sm font-semibold text-gray-900 ml-2">
                  {service.price}
                </p>
              </div>
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
            <h3 className="font-bold text-indigo-600 text-lg">
              Recent Services
            </h3>
            {!loading && (
              <button
                onClick={fetchRecentServices}
                className="text-xs text-indigo-500 hover:text-indigo-700 p-1 rounded"
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
            <span className="font-bold text-indigo-600">Recent Services</span>
            {recentServices.length > 0 && (
              <span className="ml-2 bg-indigo-100 text-indigo-600 text-xs px-2 py-1 rounded-full">
                {recentServices.length}
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
                    Recent Services
                  </h3>
                  {!loading && (
                    <button
                      onClick={fetchRecentServices}
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
