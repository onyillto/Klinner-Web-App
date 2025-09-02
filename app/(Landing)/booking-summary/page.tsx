// pages/booking-summary.js - Universal booking summary for all services
"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function UniversalBookingSummaryPage() {
  const router = useRouter();

  const [serviceData, setServiceData] = useState(null);
  const [serviceType, setServiceType] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    specialInstructions: "",
  });
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [error, setError] = useState("");

  // Available time slots
  const timeSlots = [
    "8:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
    "6:00 PM - 8:00 PM",
  ];

  // Detect if viewing on desktop
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load service data from localStorage
  useEffect(() => {
    console.log("Loading service data from localStorage...");
    console.log("All localStorage keys:", Object.keys(localStorage));

    // Check for different service types in localStorage - INCLUDING GARDENING
    const serviceKeys = [
      { key: "cleaningItems", type: "house_cleaning", name: "House Cleaning" },
      { key: "laundryOption", type: "laundry", name: "Laundry Service" },
      { key: "moveOutRooms", type: "move_out", name: "Moving Service" },
      { key: "repairRequest", type: "repairs", name: "Repair Service" },
      { key: "gardeningDetails", type: "gardening", name: "Gardening Service" }, // GARDENING SUPPORT
    ];

    let foundService = null;
    for (const service of serviceKeys) {
      const data = localStorage.getItem(service.key);
      console.log(`Checking ${service.key}:`, data ? "FOUND" : "NOT FOUND");

      if (data) {
        try {
          const parsed = JSON.parse(data);
          console.log(`Loaded ${service.name} data:`, parsed);

          setServiceData(parsed);
          setServiceType(service.type);

          // Pre-fill preferred time if it exists
          if (parsed.preferredTime || parsed.pickupTime) {
            setSelectedTime(parsed.preferredTime || parsed.pickupTime);
          }

          foundService = service;
          break;
        } catch (e) {
          console.error(`Error parsing ${service.name} data:`, e);
        }
      }
    }

    if (!foundService) {
      console.error("No service found in localStorage");
      setError("No service selected. Please select a service first.");
    }
  }, []);

  // Get user ID from auth token or cookies
  const getUserId = () => {
    const userId = Cookies.get("user_id");
    if (userId) {
      return userId;
    }

    const authToken = Cookies.get("auth_token");
    if (authToken) {
      try {
        const payload = JSON.parse(atob(authToken.split(".")[1]));
        return payload.userId || payload.id || payload.sub;
      } catch (e) {
        console.error("Failed to decode auth token:", e);
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    console.log("Starting universal service booking submission...");
    console.log("Service Type:", serviceType);
    console.log("Service Data:", serviceData);
    console.log("Customer Info:", customerInfo);
    console.log("Date/Time:", selectedDate, selectedTime);

    try {
      if (!serviceData || !serviceType) {
        throw new Error("No service selected");
      }

      // Get user ID
      const userId = getUserId();
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }

      // Prepare the universal API payload
      const payload = {
        user_id: userId,
        serviceType: serviceType,
        serviceData: transformServiceData(
          serviceType,
          serviceData,
          selectedTime
        ),
        bookingDetails: {
          bookingDate: selectedDate,
          bookingTime: selectedTime.split(" - ")[0], // Extract start time only
          location: customerInfo.address,
        },
        customerInfo: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          specialInstructions:
            customerInfo.specialInstructions ||
            serviceData.specialInstructions ||
            "",
        },
      };

      console.log("API Payload:", JSON.stringify(payload, null, 2));

      // Get auth token
      const authToken = Cookies.get("auth_token");
      if (!authToken) {
        throw new Error("Authentication required. Please log in.");
      }

      // Call the universal backend API
      console.log("Making API request...");
      const response = await fetch(
        "https://klinner.onrender.com/api/v1/services/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      console.log("Response status:", response.status);

      let result;
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        throw new Error(
          `Invalid response from server: ${responseText.substring(0, 200)}`
        );
      }

      console.log("Parsed response:", result);

      if (!response.ok) {
        console.error("API request failed:", response.status, result);
        throw new Error(
          result.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      if (result.success && result.data) {
        console.log("Booking created successfully, preparing storage data...");

        // Save the complete booking data for confirmation page
        const bookingForStorage = {
          id: result.data.service._id,
          serviceId: result.data.service._id,
          serviceName: result.data.service.serviceName,
          serviceCategory: result.data.service.serviceCategory,
          serviceType: result.data.service.serviceType,
          serviceRate: result.data.service.serviceRate,
          bookingDate: result.data.service.booking.bookingDate,
          bookingTime: result.data.service.booking.bookingTime,
          location: result.data.service.booking.location,
          paymentStatus: result.data.service.booking.paymentStatus,
          paymentReference: result.data.payment?.reference,
          authorizationUrl: result.data.payment?.authorization_url,
          accessCode: result.data.payment?.access_code,
          customerInfo: customerInfo,
          serviceData: serviceData,
          selectedDate: selectedDate,
          selectedTime: selectedTime,
          totalPrice: serviceData.estimatedPrice,
          createdAt: new Date().toISOString(),
          pricingBreakdown: result.data.service.pricingBreakdown,
        };

        console.log("Saving booking data to localStorage...");
        localStorage.setItem("bookingData", JSON.stringify(bookingForStorage));

        // Handle redirect to payment
        if (result.data.payment?.authorization_url) {
          console.log(
            "Redirecting to Paystack:",
            result.data.payment.authorization_url
          );
          setTimeout(() => {
            window.location.href = result.data.payment.authorization_url;
          }, 500);
        } else {
          console.log("No payment URL, redirecting to confirmation page");
          router.push("/booking-confirmation");
        }
      } else {
        console.error("Unexpected response format:", result);
        throw new Error(
          result.message ||
            "Failed to create booking - unexpected response format"
        );
      }
    } catch (error) {
      console.error("Complete error details:", error);
      let errorMessage = "Failed to process booking. Please try again.";
      if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      console.log("Booking submission completed");
    }
  };

  // Transform service data based on service type
  const transformServiceData = (type, data, selectedTime) => {
    const baseData = { ...data, preferredTime: selectedTime };

    switch (type) {
      case "house_cleaning":
        return {
          category: data.category || "Standard Cleaning",
          package: data.package || "Standard Package",
          items: data.items || {},
          homeSize: data.homeSize || "small",
          frequency: data.frequency || "one-time",
          estimatedPrice: data.estimatedPrice || 0,
          estimatedTime: data.estimatedTime || "3-4 hours",
          preferredTime: selectedTime,
          specialInstructions: data.specialInstructions || "",
          turnaround: data.turnaround || "2-4 hours",
        };

      case "laundry":
        return {
          category: data.category || "Standard Service",
          service: data.service || "washed-folded",
          itemCount: data.itemCount || 5,
          pickupTime: selectedTime,
          specialInstructions: data.specialInstructions || "",
          turnaround: data.turnaround || "24-48 hours",
          estimatedPrice: data.estimatedPrice || 0,
        };

      case "move_out":
        return {
          category: data.category || "Move-out Cleaning",
          rooms: data.rooms || {},
          propertySize: data.propertySize || "small",
          additionalServices: data.additionalServices || [],
          duration: data.duration || "4-8 hours",
          estimatedPrice: data.estimatedPrice || 0,
        };

      case "repairs":
        return {
          repairType: data.repairType || "general",
          urgency: data.urgency || "standard",
          description: data.description || "",
          photosCount: data.photosCount || 0,
          estimatedPrice: data.estimatedPrice || 0,
        };

      case "gardening": // GARDENING TRANSFORMATION
        return {
          category: data.category || "Basic Maintenance",
          package: data.package || "Standard Package",
          services: data.services || {}, // Services object like house cleaning items
          gardenSize: data.gardenSize || "small",
          frequency: data.frequency || "one-time",
          estimatedPrice: data.estimatedPrice || 0,
          estimatedTime: data.estimatedTime || "1-2 days",
          preferredTime: selectedTime,
          specialInstructions: data.specialInstructions || "",
          turnaround: data.turnaround || "1-2 days",
        };

      default:
        return baseData;
    }
  };

  const isFormValid = () => {
    return (
      customerInfo.name &&
      customerInfo.email &&
      customerInfo.phone &&
      customerInfo.address &&
      selectedDate &&
      selectedTime &&
      serviceData
    );
  };

  // Generate date options (next 14 days)
  const getDateOptions = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      });
    }

    return dates;
  };

  // Get service name based on type
  const getServiceName = () => {
    const serviceNames = {
      house_cleaning: "House Cleaning",
      laundry: "Laundry Service",
      move_out: "Moving Service",
      repairs: "Repair Service",
      gardening: "Gardening Service", // GARDENING NAME MAPPING
    };
    return serviceNames[serviceType] || "Service";
  };

  // Get service display details based on type
  const getServiceDetails = () => {
    switch (serviceType) {
      case "house_cleaning":
        const roomCount = serviceData?.items
          ? Object.values(serviceData.items).reduce(
              (sum: number, count: number) => sum + count,
              0
            )
          : 0;
        return {
          category: serviceData?.category,
          details: `${serviceData?.package} • ${roomCount} rooms • ${serviceData?.homeSize} home`,
          duration: serviceData?.estimatedTime,
        };

      case "laundry":
        return {
          category: serviceData?.category,
          details: `${serviceData?.service} • ${serviceData?.itemCount} items`,
          duration: serviceData?.turnaround,
        };

      case "move_out":
        const totalRooms = serviceData?.rooms
          ? Object.values(serviceData.rooms).reduce(
              (sum: number, count: number) => sum + count,
              0
            )
          : 0;
        return {
          category: serviceData?.category,
          details: `${totalRooms} rooms • ${serviceData?.propertySize} property`,
          duration: serviceData?.duration,
        };

      case "repairs":
        return {
          category: serviceData?.repairType,
          details: `${serviceData?.urgency} priority`,
          duration: "As needed",
        };

      case "gardening": // GARDENING DETAILS DISPLAY
        const serviceCount = serviceData?.services
          ? Object.values(serviceData.services).reduce(
              (sum: number, count: number) => sum + count,
              0
            )
          : 0;
        const gardenSizeName = serviceData?.gardenSize || "small";
        const packageName = serviceData?.package || "Standard Package";
        return {
          category: serviceData?.category,
          details: `${packageName} • ${serviceCount} services • ${gardenSizeName} garden`,
          duration: serviceData?.estimatedTime || "1-2 days",
        };

      default:
        return { category: "Unknown", details: "", duration: "" };
    }
  };

  const serviceDetails = getServiceDetails();

  return (
    <>
      <Head>
        <title>{getServiceName()} Booking Summary | Home Services</title>
        <meta
          name="description"
          content={`Review and confirm your ${getServiceName().toLowerCase()} booking`}
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
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
              {getServiceName()} Booking
            </h1>
            <p className="text-sm text-gray-500 hidden md:block">
              Review and confirm your service booking
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
          {/* Error display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Booking Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!serviceData ? (
            // No service selected
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No Service Selected
              </h2>
              <p className="text-gray-600 mb-6">
                Please select a service to continue with booking.
              </p>
              <button
                onClick={() => router.push("/")}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Select Service
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Service Summary */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Selected Service
                  </h2>

                  <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mr-4">
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
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {getServiceName()}
                          </h3>
                          <p className="text-sm text-purple-700 font-medium">
                            {serviceDetails.category}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {serviceDetails.details}
                          </p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Duration: {serviceDetails.duration}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ₦{(serviceData.estimatedPrice || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Information Form */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Contact Information
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerInfo.name}
                          onChange={(e) =>
                            setCustomerInfo((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={customerInfo.phone}
                          onChange={(e) =>
                            setCustomerInfo((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="+234 xxx xxx xxxx"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={customerInfo.email}
                        onChange={(e) =>
                          setCustomerInfo((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Address *
                      </label>
                      <textarea
                        required
                        value={customerInfo.address}
                        onChange={(e) =>
                          setCustomerInfo((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={3}
                        placeholder="Enter the full address where service will be performed"
                      />
                    </div>

                    {/* Date and Time Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Date *
                        </label>
                        <select
                          required
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Select a date</option>
                          {getDateOptions().map((date) => (
                            <option key={date.value} value={date.value}>
                              {date.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Time *
                        </label>
                        <select
                          required
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Select a time</option>
                          {timeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Instructions (Optional)
                      </label>
                      <textarea
                        value={customerInfo.specialInstructions}
                        onChange={(e) =>
                          setCustomerInfo((prev) => ({
                            ...prev,
                            specialInstructions: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={3}
                        placeholder="Any special requests or instructions..."
                      />
                    </div>
                  </form>
                </div>
              </div>

              {/* Booking Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Booking Summary
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {getServiceName()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {serviceDetails.category}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        ₦{(serviceData.estimatedPrice || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold text-gray-900">
                        Total
                      </p>
                      <p className="text-xl font-bold text-purple-600">
                        ₦{(serviceData.estimatedPrice || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {selectedDate && selectedTime && (
                    <div className="bg-purple-50 p-4 rounded-lg mb-6">
                      <h4 className="font-medium text-purple-900 mb-2">
                        Appointment Details
                      </h4>
                      <p className="text-sm text-purple-700">
                        📅{" "}
                        {new Date(selectedDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-purple-700">
                        ⏰ {selectedTime}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={!isFormValid() || isLoading}
                    className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                      isFormValid() && !isLoading
                        ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
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
                        Creating booking & redirecting to payment...
                      </div>
                    ) : (
                      "Confirm Booking & Pay"
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    By confirming, you agree to our terms of service and privacy
                    policy.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
