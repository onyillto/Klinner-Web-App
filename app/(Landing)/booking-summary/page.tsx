// pages/booking-summary.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Cookies from "js-cookie";

export default function BookingSummary() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Load booking data from localStorage
    const loadBookingData = () => {
      try {
        const storedBookingData = localStorage.getItem("bookingData");
        if (storedBookingData) {
          setBookingData(JSON.parse(storedBookingData));
        } else {
          // If no booking data, redirect back to cleaning page
          router.push("/house-cleaning");
        }
      } catch (error) {
        console.error("Error loading booking data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBookingData();
  }, [router]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";

    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);

    if (hour === 0) {
      return "12:00 AM";
    } else if (hour < 12) {
      return `${hour}:${minutes} AM`;
    } else if (hour === 12) {
      return `12:${minutes} PM`;
    } else {
      return `${hour - 12}:${minutes} PM`;
    }
  };

  const handleConfirmBooking = async () => {
    if (isProcessing) return; // Prevent double clicks

    setIsProcessing(true);

    try {
      // Retrieve the auth token from cookies
      const authToken = Cookies.get("auth_token");

      if (!authToken) {
        alert("Authentication required. Please log in again.");
        setIsProcessing(false);
        return;
      }

      const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
      const userId = userData.user_id;

      if (!userId) {
        alert("User ID not found. Please log in again.");
        setIsProcessing(false);
        return;
      }

      // Prepare service data for your createCleaningService endpoint
      const serviceData = {
        user_id: userId,
        serviceName: bookingData.serviceName || "Cleaning",
        serviceCategory:
          bookingData.serviceCategory || "Standard Home Cleaning",
        areas: bookingData.areas || [],
        bookingDate: bookingData.bookingDate,
        bookingTime: bookingData.bookingTime,
        location: bookingData.location,
      };

      console.log("Creating service with data:", serviceData);

      // Call YOUR createCleaningService endpoint (FIXED URL)
      const response = await fetch(
        "https://klinner.onrender.com/api/v1/service/create", // Fixed endpoint URL
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          credentials: "include",
          body: JSON.stringify(serviceData),
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage =
          errorData?.message || `Server error: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Backend response:", data);

      if (data.success && data.data) {
        const { cleaningService, payment } = data.data;
        const { authorization_url, access_code, reference } = payment;

        // Update booking data with backend response
        const confirmedBooking = {
          ...bookingData,
          // Service details from backend
          id: cleaningService._id,
          serviceId: cleaningService._id,
          serviceName: cleaningService.serviceName,
          serviceCategory: cleaningService.serviceCategory,
          areas: cleaningService.areas,
          serviceRate: cleaningService.serviceRate,

          // Booking details from backend
          bookingDate: cleaningService.booking.bookingDate,
          bookingTime: cleaningService.booking.bookingTime,
          location: cleaningService.booking.location,

          // Payment details
          paymentStatus: "pending",
          paymentReference: reference,
          authorization_url: authorization_url,
          access_code: access_code,

          // Metadata
          confirmed: true,
          createdAt: new Date().toISOString(),
        };

        console.log("Storing updated booking data:", confirmedBooking);

        // Store updated booking data
        localStorage.setItem("bookingData", JSON.stringify(confirmedBooking));

        // Redirect to Paystack payment
        console.log("Redirecting to payment URL:", authorization_url);
        window.location.href = authorization_url;
      } else {
        throw new Error(data.message || "Failed to create booking");
      }
    } catch (error) {
      console.error("Error during booking confirmation:", error);
      setIsProcessing(false);

      // Show user-friendly error message
      let errorMessage = "Booking failed. Please try again.";

      if (error.message.includes("User not found")) {
        errorMessage = "User account not found. Please log in again.";
      } else if (error.message.includes("All fields are required")) {
        errorMessage = "Please fill in all required fields.";
      } else if (error.message.includes("Network")) {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "Request timeout. Please try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    }
  };

  const handleEditBooking = () => {
    router.push("/house-cleaning");
  };

  // Calculate estimated time
  const calculateEstimatedTime = () => {
    if (!bookingData?.areas) return "N/A";

    const totalItems = bookingData.areas.length;
    const baseTime = 60; // 60 minutes base time
    const timePerItem = 30; // 30 minutes per item
    const totalMinutes = baseTime + totalItems * timePerItem;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`;
  };

  // Fixed: Calculate estimated price (returns number, not string)
  const calculatePrice = () => {
    if (!bookingData?.areas) return 0;

    const basePrice = 5000; // ₦5000 base price
    const pricePerItem = 2000; // ₦2000 per area
    const totalItems = bookingData.areas.length;

    return basePrice + totalItems * pricePerItem; // Return number, not string
  };

  // Helper function to format price as string
  const formatPrice = (price) => {
    return price.toLocaleString("en-US");
  };

  // Helper function to calculate areas fee
  const calculateAreasPrice = () => {
    if (!bookingData?.areas) return 0;
    return bookingData.areas.length * 2000;
  };

  if (loading) {
    return (
      <div className="min-h-screen text-black flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Loading your booking details...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen text-black flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
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
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            No Booking Data Found
          </h2>
          <p className="text-gray-600 mb-4">
            We couldn't find your booking information. Let's start over.
          </p>
          <button
            onClick={() => router.push("/house-cleaning")}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Start New Booking
          </button>
        </div>
      </div>
    );
  }

  // Calculate values for display
  const totalPrice = calculatePrice();
  const areasPrice = calculateAreasPrice();

  return (
    <>
      <Head>
        <title>Booking Summary | Home Services</title>
        <meta name="description" content="Review your booking details" />
      </Head>

      <div className="min-h-screen text-black bg-gray-50">
        {/* Top service info banner */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white p-3 text-center">
          <p className="text-sm">Professional Cleaning Services</p>
        </div>

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white p-4 flex items-center border-b shadow-sm">
          <button
            onClick={() => router.back()}
            className="mr-4 text-gray-800 hover:bg-gray-100 p-2 rounded-full transition-all"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Booking Summary
            </h1>
            <p className="text-sm text-gray-500 hidden md:block">
              Review your cleaning service details
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8 pb-32">
          {/* Service Details */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Service Details
                </h2>
                <p className="text-sm text-gray-500">
                  Overview of your cleaning service
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Type</span>
                  <span className="font-medium text-gray-900">
                    {bookingData.serviceCategory || "Standard Home Cleaning"}
                  </span>
                </div>
              </div>

              <div className="border-b pb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Areas to Clean</span>
                  <span className="font-medium text-gray-900">
                    {bookingData.areas?.length || 0} areas
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {bookingData.areas?.map((area, index) => (
                      <li key={index} className="flex items-center">
                        <svg
                          className="h-5 w-5 text-purple-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-800">{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-b pb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Time</span>
                  <span className="font-medium text-purple-600">
                    {calculateEstimatedTime()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Details */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Schedule Details
                </h2>
                <p className="text-sm text-gray-500">
                  When and where we'll be cleaning
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(bookingData.bookingDate)}
                  </span>
                </div>
              </div>

              <div className="border-b pb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium text-gray-900">
                    {formatTime(bookingData.bookingTime)}
                  </span>
                </div>
              </div>

              <div className="border-b pb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium text-gray-900">
                    {bookingData.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Details */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Pricing Details
                </h2>
                <p className="text-sm text-gray-500">
                  Breakdown of your service cost
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Fee</span>
                  <span className="font-medium text-gray-900">₦5,000.00</span>
                </div>
              </div>

              <div className="border-b pb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Areas Fee ({bookingData.areas?.length || 0} × ₦2,000.00)
                  </span>
                  <span className="font-medium text-gray-900">
                    ₦{formatPrice(areasPrice)}.00
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between">
                  <span className="text-gray-800 font-semibold">Total</span>
                  <span className="font-bold text-purple-600 text-xl">
                    ₦{formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed bottom action buttons */}
        <div className="fixed bottom-0 mt-6 left-0 right-0 p-4 bg-white border-t shadow-md">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-3">
            <button
              onClick={handleEditBooking}
              disabled={isProcessing}
              className={`py-3 px-6 border border-purple-600 text-purple-600 rounded-xl text-lg font-medium transition-colors md:flex-1 ${
                isProcessing
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-purple-50"
              }`}
            >
              Edit Booking
            </button>
            <button
              onClick={handleConfirmBooking}
              disabled={isProcessing}
              className={`py-3 px-6 bg-purple-600 text-white rounded-xl text-lg font-medium shadow-lg transition-colors md:flex-1 ${
                isProcessing
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-purple-700"
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Confirm & Pay"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
