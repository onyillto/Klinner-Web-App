"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNavigation from "../../../components/BottomNavigation";

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [filterStatus, setFilterStatus] = useState("all");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Add timeout for loading state (15 seconds max)
      const timeoutId = setTimeout(() => {
        setLoading(false);
        setError(
          "Request timed out. Please check your connection and try again."
        );
      }, 15000);

      // Get user ID from localStorage or wherever you store it
      const userData = localStorage.getItem("user");
      if (!userData) {
        clearTimeout(timeoutId);
        setError("User not found. Please log in again.");
        setLoading(false);
        return;
      }

      const user = JSON.parse(userData);
      const userId = user.user_id || user.id;

      console.log("🔍 Fetching bookings for user:", userId);

      // Update this URL to match your actual API base URL
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "https://your-api-domain.com";
      const apiUrl = `${API_BASE_URL}/api/v1/user/services/${userId}`;

      console.log("📡 Making API call to:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        },
      });

      clearTimeout(timeoutId); // Clear timeout on successful response

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ API Response:", result);

      if (result.success) {
        // Transform API data to match frontend expectations
        const transformedBookings = result.data.map((item) => ({
          id: item._id,
          serviceType: item.serviceCategory,
          serviceName: item.serviceName,
          status: item.booking.progress, // 'pending', 'confirmed', 'completed', 'cancelled'
          paymentStatus: item.booking.paymentStatus,
          date: item.booking.bookingDate,
          time: item.booking.bookingTime,
          address: item.booking.location,
          price: `₦${(item.serviceRate / 100).toLocaleString()}`, // Convert from kobo to naira
          areas: item.areas,
          providerName: "Klinner Professional", // Default since not in API
          providerImage: null, // Not provided in API
          serviceImage: null, // Not provided in API
          createdAt: item.createdAt,
          service_id: item.service_id,
        }));

        console.log("🔄 Transformed bookings:", transformedBookings);
        setBookings(transformedBookings);
      } else {
        setError(result.message || "Failed to fetch bookings");
      }
    } catch (error) {
      console.error("💥 Error fetching bookings:", error);
      setError(`Failed to load bookings: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter bookings based on active tab and status filter
  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    const today = new Date();

    // First filter by tab
    if (activeTab === "upcoming" && bookingDate < today) {
      return false;
    }
    if (activeTab === "past" && bookingDate >= today) {
      return false;
    }

    // Then filter by status
    if (filterStatus !== "all" && booking.status !== filterStatus) {
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

    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);

    if (hour === 0) return "12:00 AM";
    if (hour < 12) return `${hour}:${minutes} AM`;
    if (hour === 12) return `12:${minutes} PM`;
    return `${hour - 12}:${minutes} PM`;
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Navigate to booking details
  const viewBookingDetails = (bookingId) => {
    router.push(`/bookings/${bookingId}`);
  };

  // Handle booking actions
  const handleCancelBooking = async (bookingId) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      // Implement cancel booking API call
      console.log("Cancelling booking:", bookingId);
    }
  };

  const handleRescheduleBooking = (bookingId) => {
    // Navigate to reschedule page
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
      {/* SEO metadata */}
      <title>My Bookings | Klinner</title>
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
              <div className="flex items-center">
                <button
                  onClick={() => router.push("/house-cleaning")}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-purple-700"
                >
                  Book New Service
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "upcoming"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Upcoming Bookings
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "past"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Past Bookings
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filterStatus === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("confirmed")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filterStatus === "confirmed"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filterStatus === "pending"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus("completed")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filterStatus === "completed"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilterStatus("cancelled")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filterStatus === "cancelled"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Cancelled
            </button>
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
                  xmlns="http://www.w3.org/2000/svg"
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
                {activeTab === "upcoming"
                  ? "You don't have any upcoming bookings matching your filter."
                  : "You don't have any past bookings matching your filter."}
              </p>
              <button
                onClick={() => router.push("/house-cleaning")}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
              >
                Book a Service
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="sm:flex">
                    <div className="sm:w-1/4 md:w-1/5">
                      <div className="h-48 sm:h-full bg-gray-200 relative">
                        <div className="w-full h-full flex items-center justify-center bg-purple-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-purple-400"
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
                        </div>
                      </div>
                    </div>
                    <div className="sm:w-3/4 md:w-4/5 p-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                        <div>
                          <div className="flex items-center">
                            <h2 className="text-xl font-bold text-gray-900 mr-3">
                              {booking.serviceType}
                            </h2>
                            <span
                              className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {booking.status.charAt(0).toUpperCase() +
                                booking.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-gray-500 mt-1">ID: {booking.id}</p>
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
                              xmlns="http://www.w3.org/2000/svg"
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
                              xmlns="http://www.w3.org/2000/svg"
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
                            Areas to Clean
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {booking.areas.slice(0, 3).map((area, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800"
                              >
                                {area}
                              </span>
                            ))}
                            {booking.areas.length > 3 && (
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

                        {booking.status === "confirmed" && (
                          <button
                            onClick={() => handleRescheduleBooking(booking.id)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Reschedule
                          </button>
                        )}

                        {(booking.status === "confirmed" ||
                          booking.status === "pending") && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                          >
                            Cancel Booking
                          </button>
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
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Import Bottom Navigation & Desktop Sidebar */}
      <BottomNavigation />
    </div>
  );
}
