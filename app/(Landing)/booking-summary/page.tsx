// pages/booking-summary.js
"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";

export default function BookingSummaryPage() {
  const router = useRouter();
  type ServiceData = {
    estimatedPrice?: number;
    [key: string]: any;
  };

  type Services = {
    cleaning?: ServiceData;
    gardening?: ServiceData;
    laundry?: ServiceData;
    moving?: ServiceData;
    [key: string]: ServiceData | undefined;
  };

  const [services, setServices] = useState<Services>({});
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

  // Load all service data from localStorage
  useEffect(() => {
    const loadedServices: Services = {};

    // Load house cleaning data
    const cleaningData = localStorage.getItem("cleaningItems");
    if (cleaningData) {
      try {
        const parsed = JSON.parse(cleaningData);
        loadedServices.cleaning = parsed;
      } catch (e) {
        console.error("Error parsing cleaning data:", e);
      }
    }

    // Load gardening data
    const gardeningData = localStorage.getItem("gardeningServices");
    if (gardeningData) {
      try {
        const parsed = JSON.parse(gardeningData);
        loadedServices.gardening = parsed;
      } catch (e) {
        console.error("Error parsing gardening data:", e);
      }
    }

    // Load laundry data
    const laundryData = localStorage.getItem("laundryOption");
    if (laundryData) {
      try {
        const parsed = JSON.parse(laundryData);
        loadedServices.laundry = parsed;
      } catch (e) {
        console.error("Error parsing laundry data:", e);
      }
    }

    // Load moving data
    const movingData = localStorage.getItem("moveOutRooms");
    if (movingData) {
      try {
        const parsed = JSON.parse(movingData);
        loadedServices.moving = parsed;
      } catch (e) {
        console.error("Error parsing moving data:", e);
      }
    }

    setServices(loadedServices);
  }, []);

  // Calculate total price
  const calculateTotalPrice = () => {
    let total = 0;

    if (services.cleaning?.estimatedPrice) {
      total += parseInt(String(services.cleaning.estimatedPrice)) || 0;
    }

    if (services.gardening?.estimatedPrice) {
      total += parseInt(String(services.gardening.estimatedPrice)) || 0;
    }

    if (services.laundry?.estimatedPrice) {
      total += parseInt(String(services.laundry.estimatedPrice)) || 0;
    }

    if (services.moving?.estimatedPrice) {
      total += parseInt(String(services.moving.estimatedPrice)) || 0;
    }

    return total;
  };

  // Get service icon
  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case "cleaning":
        return (
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
        );
      case "gardening":
        return (
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
        );
      case "laundry":
        return (
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
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      case "moving":
        return (
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
        );
      default:
        return null;
    }
  };

  // Get service color theme
  const getServiceTheme = (serviceType) => {
    switch (serviceType) {
      case "cleaning":
        return {
          bg: "bg-purple-50",
          border: "border-purple-200",
          text: "text-purple-700",
          icon: "text-purple-600",
        };
      case "gardening":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-700",
          icon: "text-green-600",
        };
      case "laundry":
        return {
          bg: "bg-purple-50",
          border: "border-purple-200",
          text: "text-purple-700",
          icon: "text-purple-600",
        };
      case "moving":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-700",
          icon: "text-blue-600",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
          icon: "text-gray-600",
        };
    }
  };

  // Format service details
 const formatServiceDetails = (serviceType: string, data: any) => {
   switch (serviceType) {
     case "cleaning":
       const roomCount = Object.values(data.items || {}).reduce(
         (sum: number, count) => sum + (typeof count === "number" ? count : 0),
         0
       );
       return {
         title: "House Cleaning",
         category: data.category || "Standard cleaning",
         details: `${roomCount} areas selected`,
         time: data.estimatedTime || "2-4 hours",
       };

     case "gardening":
       return {
         title: "Gardening Services",
         category: data.category || "Basic Maintenance",
         details: `${data.services?.length || 0} services • ${
           data.gardenSize || "Medium"
         } garden`,
         time: "2-6 hours",
       };

     case "laundry":
       return {
         title: "Laundry Service",
         category: data.category || "Standard Service",
         details: `${data.service || data.title || "Wash & Fold"} • ${
           data.itemCount || 5
         } items`,
         time: data.turnaround || "24-48 hours",
       };

     case "moving":
       const totalRooms = Object.values(data.rooms || {}).reduce(
         (sum: number, count) => sum + (typeof count === "number" ? count : 0),
         0
       );
       return {
         title: "Moving Services",
         category: data.category || "Move-out Cleaning",
         details: `${totalRooms} rooms • ${
           data.propertySize || "Medium"
         } property`,
         time: data.duration || "4-8 hours",
       };

     default:
       return {
         title: "Service",
         category: "Unknown",
         details: "No details available",
         time: "TBD",
       };
   }
 };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Save booking data
    const bookingData = {
      services,
      customerInfo,
      selectedDate,
      selectedTime,
      totalPrice: calculateTotalPrice(),
      bookingId: `HM${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("currentBooking", JSON.stringify(bookingData));

    setIsLoading(false);
    router.push("/booking-confirmation");
  };

  const isFormValid = () => {
    return (
      customerInfo.name &&
      customerInfo.email &&
      customerInfo.phone &&
      customerInfo.address &&
      selectedDate &&
      selectedTime &&
      Object.keys(services).length > 0
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

  return (
    <>
      <Head>
        <title>Booking Summary | Home Services</title>
        <meta
          name="description"
          content="Review and confirm your service booking"
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
              Booking Summary
            </h1>
            <p className="text-sm text-gray-500 hidden md:block">
              Review your services and book appointment
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
          {Object.keys(services).length === 0 ? (
            // No services selected
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
                No Services Selected
              </h2>
              <p className="text-gray-600 mb-6">
                Please select at least one service to continue with your
                booking.
              </p>
              <button
                onClick={() => router.push("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Browse Services
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Services Summary */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Selected Services
                  </h2>

                  <div className="space-y-4">
                    {Object.entries(services).map(([serviceType, data]) => {
                      const theme = getServiceTheme(serviceType);
                      const details = formatServiceDetails(serviceType, data);

                      return (
                        <div
                          key={serviceType}
                          className={`${theme.bg} ${theme.border} border-2 rounded-lg p-4`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start">
                              <div
                                className={`w-10 h-10 rounded-lg ${theme.bg} ${theme.icon} flex items-center justify-center mr-4`}
                              >
                                {getServiceIcon(serviceType)}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">
                                  {details.title}
                                </h3>
                                <p
                                  className={`text-sm ${theme.text} font-medium`}
                                >
                                  {details.category}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {details.details}
                                </p>
                                <div className="flex items-center mt-2 text-xs text-gray-500">
                                  <svg
                                    className="h-4 w-4 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                ₦{(data?.estimatedPrice || 0).toLocaleString()}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    
                                  </svg>
                                  Duration: {details.time}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">
                                ₦{(data.estimatedPrice || 0).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Enter the full address where services will be performed"
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
                          className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                          className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Any special requests or instructions for our team..."
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
                    {Object.entries(services).map(([serviceType, data]) => {
                      const details = formatServiceDetails(serviceType, data);
                      return (
                        <div
                          key={serviceType}
                          className="flex justify-between items-center py-2 border-b border-gray-100"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {details.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {details.category}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            ₦{(data.estimatedPrice || 0).toLocaleString()}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold text-gray-900">
                        Total
                      </p>
                      <p className="text-xl font-bold text-blue-600">
                        ₦{calculateTotalPrice().toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {selectedDate && selectedTime && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Appointment Details
                      </h4>
                      <p className="text-sm text-blue-700">
                        📅{" "}
                        {new Date(selectedDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-blue-700">⏰ {selectedTime}</p>
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={!isFormValid() || isLoading}
                    className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                      isFormValid() && !isLoading
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
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
                        Processing...
                      </div>
                    ) : (
                      "Confirm Booking"
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
