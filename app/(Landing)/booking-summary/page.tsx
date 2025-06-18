// pages/booking-summary.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Cookies from "js-cookie";

// Pricing configuration based on room types and sizes
const PRICING_CONFIG = {
  // Base service fee
  baseServiceFee: 10000, // ₦10,000 minimum service charge

  // Room-specific pricing with size variations
  roomPricing: {
    "Living Room": {
      small: 8000, // Up to 15 sqm
      medium: 12000, // 15-30 sqm
      large: 18000, // 30+ sqm
      description: "Sofa cleaning, floor mopping, dusting furniture",
    },
    Bedroom: {
      small: 6000, // Single/twin room
      medium: 9000, // Double/queen room
      large: 13000, // Master bedroom with walk-in closet
      description: "Bed making, floor cleaning, wardrobe organization",
    },
    Kitchen: {
      small: 10000, // Kitchenette/galley
      medium: 15000, // Standard kitchen
      large: 22000, // Large kitchen with island
      description: "Appliance cleaning, countertop sanitization, floor mopping",
    },
    Bathroom: {
      small: 8000, // Half bath/powder room
      medium: 12000, // Full bathroom
      large: 16000, // Master bathroom with tub
      description: "Deep sanitization, tile scrubbing, mirror cleaning",
    },
    "Dining Room": {
      small: 5000, // Small dining area
      medium: 8000, // Standard dining room
      large: 12000, // Large formal dining room
      description: "Table cleaning, floor mopping, chandelier dusting",
    },
    "Office/Study": {
      small: 4000, // Small home office
      medium: 7000, // Standard office
      large: 10000, // Large office with multiple desks
      description: "Desk organization, electronics dusting, floor cleaning",
    },
    "Balcony/Terrace": {
      small: 3000, // Small balcony
      medium: 5000, // Medium terrace
      large: 8000, // Large outdoor space
      description: "Sweeping, furniture cleaning, plant area tidying",
    },
    "Laundry Room": {
      small: 4000, // Basic laundry area
      medium: 6000, // Standard laundry room
      large: 8000, // Large laundry room with storage
      description: "Machine cleaning, floor mopping, organizing supplies",
    },
    Garage: {
      small: 5000, // Single car garage
      medium: 8000, // Double car garage
      large: 12000, // Large garage with storage
      description: "Floor sweeping, basic organization, cobweb removal",
    },
    Staircase: {
      small: 3000, // Single flight
      medium: 5000, // Two flights
      large: 7000, // Multiple flights or curved stairs
      description: "Step cleaning, railing polishing, carpet/floor care",
    },
  },

  // Service type multipliers
  serviceMultipliers: {
    "Standard Home Cleaning": 1.0,
    "Deep Cleaning": 1.5,
    "Post-Construction Cleaning": 2.0,
    "Move-in/Move-out Cleaning": 1.8,
    "Office Cleaning": 1.2,
  },

  // Frequency discounts
  frequencyDiscounts: {
    "One-time": 0,
    Weekly: 0.15, // 15% discount
    "Bi-weekly": 0.1, // 10% discount
    Monthly: 0.05, // 5% discount
  },
};

export default function BookingSummary() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState({});

  useEffect(() => {
    // Load booking data from localStorage
    const loadBookingData = () => {
      try {
        const storedBookingData = localStorage.getItem("bookingData");
        if (storedBookingData) {
          const parsed = JSON.parse(storedBookingData);
          setBookingData(parsed);

          // Initialize default sizes for each area
          const defaultSizes = {};
          if (parsed.areas) {
            parsed.areas.forEach((area) => {
              defaultSizes[area] = "medium"; // Default to medium size
            });
          }
          setSelectedSizes(defaultSizes);
        } else {
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

  // Handle size selection for each room
  const handleSizeChange = (room, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [room]: size,
    }));
  };

  // Calculate price for individual room
  const calculateRoomPrice = (roomType, size) => {
    const roomConfig = PRICING_CONFIG.roomPricing[roomType];
    if (!roomConfig) return 5000; // Default price for unlisted rooms
    return roomConfig[size] || roomConfig.medium;
  };

  // Calculate total estimated time
  const calculateEstimatedTime = () => {
    if (!bookingData?.areas) return "N/A";

    let totalMinutes = 60; // Base time for setup and travel

    bookingData.areas.forEach((area) => {
      const size = selectedSizes[area] || "medium";
      // Time estimation based on room type and size
      switch (size) {
        case "small":
          totalMinutes += 30;
          break;
        case "medium":
          totalMinutes += 45;
          break;
        case "large":
          totalMinutes += 75;
          break;
        default:
          totalMinutes += 45;
      }
    });

    // Apply service type multiplier
    const serviceType = bookingData.serviceCategory || "Standard Home Cleaning";
    const multiplier = PRICING_CONFIG.serviceMultipliers[serviceType] || 1.0;
    totalMinutes = Math.round(totalMinutes * multiplier);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`;
  };

  // Calculate detailed pricing breakdown
  const calculatePricing = () => {
    if (!bookingData?.areas)
      return { breakdown: [], subtotal: 0, total: 0, savings: 0 };

    let subtotal = PRICING_CONFIG.baseServiceFee;
    const breakdown = [];

    // Add base service fee
    breakdown.push({
      item: "Base Service Fee",
      description: "Minimum service charge, equipment, and travel",
      quantity: 1,
      price: PRICING_CONFIG.baseServiceFee,
      total: PRICING_CONFIG.baseServiceFee,
    });

    // Calculate room-specific pricing
    const roomCounts = {};
    bookingData.areas.forEach((area) => {
      roomCounts[area] = (roomCounts[area] || 0) + 1;
    });

    Object.entries(roomCounts).forEach(([roomType, count]) => {
      const size = selectedSizes[roomType] || "medium";
      const roomPrice = calculateRoomPrice(roomType, size);
      const roomTotal = Number(roomPrice) * Number(count);
      subtotal += roomTotal;

      breakdown.push({
        item: `${roomType} (${size})`,
        description:
          PRICING_CONFIG.roomPricing[roomType]?.description ||
          "Standard cleaning",
        quantity: count,
        price: roomPrice,
        total: roomTotal,
      });
    });

    // Apply service type multiplier
    const serviceType = bookingData.serviceCategory || "Standard Home Cleaning";
    const serviceMultiplier =
      PRICING_CONFIG.serviceMultipliers[serviceType] || 1.0;

    if (serviceMultiplier !== 1.0) {
      const multiplierAmount = subtotal * (serviceMultiplier - 1);
      subtotal += multiplierAmount;

      breakdown.push({
        item: `${serviceType} Premium`,
        description: `Additional charge for specialized ${serviceType.toLowerCase()}`,
        quantity: 1,
        price: multiplierAmount,
        total: multiplierAmount,
      });
    }

    // Apply frequency discount (if any)
    const frequency = bookingData.frequency || "One-time";
    const discount = PRICING_CONFIG.frequencyDiscounts[frequency] || 0;
    const savings = subtotal * discount;
    const total = subtotal - savings;

    return {
      breakdown,
      subtotal: Math.round(subtotal),
      savings: Math.round(savings),
      total: Math.round(total),
      serviceMultiplier,
      discount,
    };
  };

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
    if (hour === 0) return "12:00 AM";
    if (hour < 12) return `${hour}:${minutes} AM`;
    if (hour === 12) return `12:${minutes} PM`;
    return `${hour - 12}:${minutes} PM`;
  };

  const handleConfirmBooking = async () => {
    setLoading(true);

    try {
      const authToken = Cookies.get("auth_token");
      if (!authToken) {
        alert("Authentication required. Please log in again.");
        setLoading(false);
        return;
      }

      const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
      const userId = userData.user_id;

      if (!userId) {
        alert("User ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      const pricing = calculatePricing();

      // ✅ FIXED: Send the total amount directly (no division by 100)
      const serviceRate = pricing.total;

      // 🔍 DEBUG LOGS (you can remove these later)
      console.log("🟢 FRONTEND DEBUG - AFTER FIX:");
      console.log("💰 pricing.total:", pricing.total);
      console.log("💰 serviceRate:", serviceRate);
      console.log(
        "💰 Expected Paystack amount: ₦" + serviceRate.toLocaleString()
      );

      const serviceData = {
        user_id: userId,
        serviceName: bookingData.serviceName || "Cleaning",
        serviceCategory:
          bookingData.serviceCategory || "Standard Home Cleaning",
        areas: bookingData.areas || [],
        roomSizes: selectedSizes,
        bookingDate: bookingData.bookingDate,
        bookingTime: bookingData.bookingTime,
        location: bookingData.location,
        serviceRate, // ✅ Now this will be 19000 instead of "190.00"
        estimatedDuration: calculateEstimatedTime(),
        pricingBreakdown: pricing.breakdown,
      };

      console.log("📤 What we're sending to backend:", serviceData.serviceRate);

      const response = await fetch(
        "http://localhost:3002/api/v1/service/create-service",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(serviceData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Server error: ${response.status} ${errorText}`);
        setLoading(false);
        return;
      }

      const data = await response.json();
      const { authorization_url, access_code, reference } = data.data.payment;
      const serviceId = data.data.cleaningService._id;

      const confirmedBooking = {
        ...bookingData,
        id: serviceId,
        confirmed: true,
        paymentStatus: "pending",
        paymentReference: reference,
        finalPrice: pricing.total,
        roomSizes: selectedSizes,
        estimatedDuration: calculateEstimatedTime(),
      };

      localStorage.setItem("bookingData", JSON.stringify(confirmedBooking));
      window.location.href = authorization_url;
    } catch (error) {
      console.error("Error during booking confirmation:", error);
      setLoading(false);
      alert(`Booking failed: ${error.message}`);
    }
  };

  // ✅ FIXED: Edit button uses router.back() instead of router.push()
  const handleEditBooking = () => {
    router.back();
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

  const pricing = calculatePricing();

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
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Areas to Clean</span>
                  <span className="font-medium text-gray-900">
                    {bookingData.areas?.length || 0} areas
                  </span>
                </div>

                {/* Room size selection */}
                <div className="space-y-4">
                  {bookingData.areas?.map((area, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
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
                          <span className="font-medium text-gray-800">
                            {area}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-purple-600">
                          ₦
                          {calculateRoomPrice(
                            area,
                            selectedSizes[area] || "medium"
                          ).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        {["small", "medium", "large"].map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSizeChange(area, size)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              selectedSizes[area] === size
                                ? "bg-purple-600 text-white"
                                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            {size.charAt(0).toUpperCase() + size.slice(1)}
                          </button>
                        ))}
                      </div>

                      <p className="text-xs text-gray-500 mt-2">
                        {PRICING_CONFIG.roomPricing[area]?.description ||
                          "Standard cleaning included"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-b pb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Duration</span>
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

          {/* Detailed Pricing Breakdown */}
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
                  Pricing Breakdown
                </h2>
                <p className="text-sm text-gray-500">
                  Detailed cost calculation
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {pricing.breakdown.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">
                        {item.item}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-sm text-gray-500 ml-2">
                          ×{item.quantity}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.description}
                    </p>
                  </div>
                  <span className="font-medium text-gray-900 ml-4">
                    ₦{item.total.toLocaleString()}
                  </span>
                </div>
              ))}

              {pricing.savings > 0 && (
                <div className="flex justify-between items-center py-2 text-green-600">
                  <span className="font-medium">
                    Frequency Discount ({Math.round(pricing.discount * 100)}%)
                  </span>
                  <span className="font-medium">
                    -₦{pricing.savings.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="pt-4 border-t-2 border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-purple-600">
                    ₦{pricing.total.toLocaleString()}
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
              className="py-3 px-6 border border-purple-600 text-purple-600 rounded-xl text-lg font-medium hover:bg-purple-50 transition-colors md:flex-1"
            >
              Edit Booking
            </button>
            <button
              onClick={handleConfirmBooking}
              className="py-3 px-6 bg-purple-600 text-white rounded-xl text-lg font-medium shadow-lg hover:bg-purple-700 transition-colors md:flex-1"
            >
              Confirm & Pay ₦{pricing.total.toLocaleString()}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
