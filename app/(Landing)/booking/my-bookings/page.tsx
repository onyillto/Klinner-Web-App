// Updated BookingsPage.js - Supports all new service types and API endpoints
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import BottomNavigation from "../../../components/BottomNavigation";
import BookingDetailsModal from "../../../components/BookingDetailsModal";

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterServiceType, setFilterServiceType] = useState("all");
  const [error, setError] = useState(null);

  // Modal state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔍 Fetching user bookings...");

      // Get auth token
      const authToken =
        Cookies.get("auth_token") || localStorage.getItem("auth_token");

      if (!authToken) {
        setError("Authentication required. Please log in again.");
        setLoading(false);
        return;
      }

      // Use the new API endpoint
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
      const apiUrl = `${API_BASE_URL}/api/v1/services/my-services`;

      console.log("📡 Making API call to:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error Response:", errorText);
        throw new Error(
          `API Error (${response.status}): ${errorText || "Unknown error"}`
        );
      }

      const result = await response.json();
      console.log("✅ API Response:", result);

      if (result.success && result.data) {
        // Transform API data to match frontend expectations
        const transformedBookings = result.data.services.map((service) => ({
          id: service.id,
          service_id: service.service_id,
          serviceName: service.serviceName,
          serviceType: service.serviceType,
          serviceCategory: service.serviceCategory,
          status: service.status,
          paymentStatus: service.paymentStatus,
          date: service.bookingDate,
          time: service.bookingTime,
          address: service.location,
          price: `₦${service.serviceRate.toLocaleString()}`,
          createdAt: service.createdAt,
          updatedAt: service.updatedAt,

          // Service-specific details
          ...(service.serviceType === "house_cleaning" && {
            roomsCount: service.roomsCount || 0,
            package: service.package,
            frequency: service.frequency,
            areas: service.roomsCount ? [`${service.roomsCount} rooms`] : [],
          }),

          ...(service.serviceType === "gardening" && {
            servicesCount: service.servicesCount || 0,
            package: service.package,
            gardenSize: service.gardenSize,
            frequency: service.frequency,
            areas: service.servicesCount
              ? [`${service.servicesCount} garden services`]
              : [],
          }),

          ...(service.serviceType === "laundry" && {
            itemCount: service.itemCount || 0,
            service: service.service,
            areas: service.itemCount ? [`${service.itemCount} items`] : [],
          }),

          ...(service.serviceType === "repairs" && {
            repairType: service.repairType,
            urgency: service.urgency,
            areas: service.repairType ? [service.repairType] : [],
          }),

          ...(service.serviceType === "move_out" && {
            areas: ["Moving service"],
          }),
        }));

        console.log("🔄 Transformed bookings:", transformedBookings);

        // Sort bookings by creation date (newest first)
        const sortedBookings = transformedBookings.sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

        setBookings(sortedBookings);
      } else {
        setError(result.message || "Failed to fetch bookings");
      }
    } catch (error) {
      console.error("💥 Error fetching bookings:", error);

      // More specific error messages
      if (error.message.includes("fetch")) {
        setError(
          "Network error. Please check your internet connection and try again."
        );
      } else if (error.message.includes("500")) {
        setError(
          "Server error. Our team has been notified. Please try again later."
        );
      } else if (error.message.includes("404")) {
        setError("API endpoint not found. Please contact support.");
      } else if (error.message.includes("401")) {
        setError("Session expired. Please log in again.");
      } else {
        setError(`Failed to load bookings: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter bookings based on status and service type
  const filteredBookings = bookings.filter((booking) => {
    if (filterStatus !== "all" && booking.status !== filterStatus) {
      return false;
    }
    if (
      filterServiceType !== "all" &&
      booking.serviceType !== filterServiceType
    ) {
      return false;
    }
    return true;
  });

  // Format date for display
  const formatBookingDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-NG", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  // Format time for display
  const formatBookingTime = (timeString) => {
    if (!timeString) return "";

    // Handle time ranges like "8:00 AM - 10:00 AM"
    if (timeString.includes(" - ")) {
      return timeString;
    }

    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);

    if (hour === 0) return "12:00 AM";
    if (hour < 12) return `${hour}:${minutes || "00"} AM`;
    if (hour === 12) return `12:${minutes || "00"} PM`;
    return `${hour - 12}:${minutes || "00"} PM`;
  };

  // Get status badge color
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

  // Get service type display name and icon
  const getServiceTypeInfo = (serviceType) => {
    const serviceTypes = {
      house_cleaning: {
        name: "House Cleaning",
        icon: (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        ),
        color: "text-purple-600 bg-purple-100",
      },
      gardening: {
        name: "Gardening Service",
        icon: (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        ),
        color: "text-green-600 bg-green-100",
      },
      laundry: {
        name: "Laundry Service",
        icon: (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        ),
        color: "text-blue-600 bg-blue-100",
      },
      repairs: {
        name: "Repair Service",
        icon: (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ),
        color: "text-orange-600 bg-orange-100",
      },
      move_out: {
        name: "Moving Service",
        icon: (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        ),
        color: "text-indigo-600 bg-indigo-100",
      },
    };

    return (
      serviceTypes[serviceType] || {
        name: serviceType,
        icon: null,
        color: "text-gray-600 bg-gray-100",
      }
    );
  };

  // View booking details
  const viewBookingDetails = (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      setIsModalOpen(true);
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  // Handle booking actions
  const handleCancelBooking = async (bookingId) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      console.log("Cancelling booking:", bookingId);
      // TODO: Implement cancel booking API call
    }
  };

  const handleRescheduleBooking = (bookingId) => {
    router.push(`/bookings/${bookingId}/reschedule`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Bookings
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchUserBookings}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <title>My Bookings | Home Services</title>
      <meta
        name="description"
        content="View and manage your service bookings"
      />

      <div className="flex-1 flex flex-col lg:pl-56">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6 md:space-x-10">
              <div className="flex justify-start lg:w-0 lg:flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  My Bookings
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {/* Filters */}
          <div className="flex flex-col space-y-4 mb-6">
            {/* Status Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    filterStatus === "all"
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  All ({bookings.length})
                </button>
                {[
                  "pending",
                  "confirmed",
                  "in_progress",
                  "completed",
                  "cancelled",
                ].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      filterStatus === status
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() +
                      status.slice(1).replace("_", " ")}{" "}
                    ({bookings.filter((b) => b.status === status).length})
                  </button>
                ))}
              </div>
            </div>

            {/* Service Type Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Filter by Service Type
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterServiceType("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    filterServiceType === "all"
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  All Services
                </button>
                {[
                  "house_cleaning",
                  "gardening",
                  "laundry",
                  "repairs",
                  "move_out",
                ].map((type) => {
                  const count = bookings.filter(
                    (b) => b.serviceType === type
                  ).length;
                  if (count === 0) return null;

                  return (
                    <button
                      key={type}
                      onClick={() => setFilterServiceType(type)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                        filterServiceType === type
                          ? "bg-purple-600 text-white border-purple-600"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {getServiceTypeInfo(type).name} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="h-12 w-12 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No Bookings Found
              </h3>
              <p className="text-gray-500 mb-6">
                You don't have any bookings matching your current filter.
              </p>
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
              >
                Book a Service
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookings.map((booking) => {
                const serviceInfo = getServiceTypeInfo(booking.serviceType);

                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="sm:flex">
                      <div className="sm:w-1/4 md:w-1/5">
                        <div className="h-48 sm:h-full relative">
                          <div
                            className={`w-full h-full flex items-center justify-center ${serviceInfo.color}`}
                          >
                            {serviceInfo.icon}
                          </div>
                        </div>
                      </div>
                      <div className="sm:w-3/4 md:w-4/5 p-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                          <div>
                            <div className="flex items-center">
                              <h2 className="text-xl font-bold text-gray-900 mr-3">
                                {serviceInfo.name}
                              </h2>
                              <span
                                className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                  booking.status
                                )}`}
                              >
                                {booking.status.charAt(0).toUpperCase() +
                                  booking.status.slice(1).replace("_", " ")}
                              </span>
                            </div>
                            <p className="text-gray-500 mt-1">
                              ID: {booking.service_id || booking.id}
                            </p>
                          </div>
                          <div className="mt-2 md:mt-0 text-right">
                            <p className="text-lg font-bold text-purple-600">
                              {booking.price}
                            </p>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                booking.paymentStatus === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              Payment: {booking.paymentStatus}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center text-gray-500">
                              <svg
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="text-sm">
                                {formatBookingDate(booking.date)} at{" "}
                                {formatBookingTime(booking.time)}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-500 mt-2">
                              <svg
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              <span className="text-sm">{booking.address}</span>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-2">
                              Service Details
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {booking.areas &&
                                booking.areas.slice(0, 3).map((area, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800"
                                  >
                                    {area}
                                  </span>
                                ))}
                              {booking.areas && booking.areas.length > 3 && (
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                                  +{booking.areas.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                          <button
                            onClick={() => viewBookingDetails(booking.id)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
                          >
                            View Details
                          </button>

                          {booking.status === "pending" && (
                            <>
                              {/* Uncomment when these features are implemented */}
                              {/* <button
                                onClick={() => handleRescheduleBooking(booking.id)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                              >
                                Reschedule
                              </button>
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                              >
                                Cancel Booking
                              </button> */}
                            </>
                          )}

                          {booking.status === "completed" && (
                            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                              Leave Review
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      <BottomNavigation />
    </div>
  );
}
