"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";

export default function MoveOutPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // 1: category selection, 2: room customization
  const [rooms, setRooms] = useState({
    "Living Room": 0,
    Terrace: 0,
    Bedroom: 0,
    Bathroom: 0,
    Kitchen: 0,
    "Dining Room": 0,
    Garage: 0,
    "Storage/Utility": 0,
  });
  const [propertySize, setPropertySize] = useState("");
  const [additionalServices, setAdditionalServices] = useState([]);
  const [preferredTime, setPreferredTime] = useState(""); // Added for time slot selection
  const [specialInstructions, setSpecialInstructions] = useState(""); // Added for special instructions
  const [totalRooms, setTotalRooms] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  // Moving service categories with descriptions and pricing
  const categories = {
    "Move-out Cleaning": {
      description: "Deep cleaning to get your security deposit back",
      services: [
        "Deep cleaning all rooms",
        "Appliance cleaning",
        "Window cleaning",
        "Floor care",
        "Inspection-ready finish",
      ],
      basePrice: 15000,
      pricePerRoom: 2500,
      duration: "4-8 hours",
      icon: "📦",
    },
    "Move-in Cleaning": {
      description: "Sanitize and prepare your new home before moving in",
      services: [
        "Complete sanitization",
        "Cabinet cleaning",
        "Appliance prep",
        "Fresh start cleaning",
        "Move-in ready",
      ],
      basePrice: 12000,
      pricePerRoom: 2000,
      duration: "3-6 hours",
      icon: "🏠",
    },
    "Full Moving Package": {
      description: "Complete moving solution with cleaning and packing",
      services: [
        "Professional packing",
        "Loading & transport",
        "Move-out cleaning",
        "Move-in setup",
        "Full-service experience",
      ],
      basePrice: 35000,
      pricePerRoom: 4000,
      duration: "1-2 days",
      icon: "🚚",
    },
    "End of Lease Clean": {
      description: "Guaranteed deposit return cleaning service",
      services: [
        "Bond-back guarantee",
        "Professional standards",
        "Detailed checklist",
        "Re-clean if needed",
        "Inspection support",
      ],
      basePrice: 18000,
      pricePerRoom: 3000,
      duration: "6-10 hours",
      icon: "✅",
    },
  };

  const propertySizes = [
    {
      id: "studio",
      name: "Studio/1BR",
      multiplier: 0.7,
      description: "Up to 1 bedroom",
    },
    {
      id: "small",
      name: "2-3 Bedrooms",
      multiplier: 1,
      description: "Small to medium home",
    },
    {
      id: "medium",
      name: "4-5 Bedrooms",
      multiplier: 1.5,
      description: "Large family home",
    },
    {
      id: "large",
      name: "5+ Bedrooms",
      multiplier: 2.2,
      description: "Very large property",
    },
  ];

  const additionalServiceOptions = [
    { id: "carpet-cleaning", name: "Carpet Cleaning", price: 5000, icon: "🧽" },
    {
      id: "pest-control",
      name: "Pest Control Treatment",
      price: 8000,
      icon: "🐛",
    },
    {
      id: "garden-cleanup",
      name: "Garden/Yard Cleanup",
      price: 6000,
      icon: "🌿",
    },
    {
      id: "appliance-service",
      name: "Appliance Deep Clean",
      price: 4000,
      icon: "🔧",
    },
    {
      id: "pressure-washing",
      name: "Pressure Washing",
      price: 7000,
      icon: "💨",
    },
    { id: "handyman", name: "Minor Repairs", price: 10000, icon: "🔨" },
  ];

  // Time slots for preferred time selection (aligned with house-cleaning.js and LaundryPage.js)
  const timeSlots = [
    "8:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
    "6:00 PM - 8:00 PM",
  ];

  // Calculate total rooms whenever rooms state changes
  useEffect(() => {
    const total = Object.values(rooms).reduce((sum, count) => sum + count, 0);
    setTotalRooms(total);
  }, [rooms]);

  // Detect if viewing on desktop
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setTimeout(() => {
      setCurrentStep(2);
    }, 300);
  };

  const handleBackToCategories = () => {
    setCurrentStep(1);
    setRooms({
      "Living Room": 0,
      Terrace: 0,
      Bedroom: 0,
      Bathroom: 0,
      Kitchen: 0,
      "Dining Room": 0,
      Garage: 0,
      "Storage/Utility": 0,
    });
    setPropertySize("");
    setAdditionalServices([]);
    setPreferredTime(""); // Reset preferred time
    setSpecialInstructions(""); // Reset special instructions
  };

  const handleIncrement = (room) => {
    setRooms((prev) => ({
      ...prev,
      [room]: prev[room] + 1,
    }));
  };

  const handleDecrement = (room) => {
    if (rooms[room] > 0) {
      setRooms((prev) => ({
        ...prev,
        [room]: prev[room] - 1,
      }));
    }
  };

  const toggleAdditionalService = (serviceId) => {
    setAdditionalServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const calculatePrice = () => {
    if (!selectedCategory || !propertySize) return 0;

    const categoryData = categories[selectedCategory];
    const sizeMultiplier =
      propertySizes.find((size) => size.id === propertySize)?.multiplier || 1;
    const additionalServicesCost = additionalServices.reduce(
      (total, serviceId) => {
        const service = additionalServiceOptions.find(
          (s) => s.id === serviceId
        );
        return total + (service?.price || 0);
      },
      0
    );

    const baseTotal =
      (categoryData.basePrice + totalRooms * categoryData.pricePerRoom) *
      sizeMultiplier;
    return Math.round(baseTotal + additionalServicesCost);
  };

  const handleContinue = () => {
    if (totalRooms > 0 && propertySize && preferredTime) {
      const moveOutData = {
        category: selectedCategory,
        rooms: rooms,
        propertySize: propertySize,
        additionalServices: additionalServices,
        estimatedPrice: calculatePrice(),
        duration: categories[selectedCategory].duration,
        preferredTime: preferredTime, // Added for booking-summary.js
        specialInstructions: specialInstructions, // Added for booking-summary.js
        turnaround: categories[selectedCategory].duration, // Alias for duration
        serviceDisplay: {
          // Added for consistency with LaundryPage.js
          categoryName: selectedCategory,
          roomCount: totalRooms,
          propertySizeName:
            propertySizes.find((s) => s.id === propertySize)?.name || "",
          additionalServices: additionalServices.map(
            (id) => additionalServiceOptions.find((s) => s.id === id)?.name
          ),
          estimatedPrice: calculatePrice(),
          duration: categories[selectedCategory].duration,
        },
      };

      // Clear other service data to prevent conflicts
      localStorage.removeItem("cleaningItems");
      localStorage.removeItem("laundryOption");
      localStorage.removeItem("repairRequest");
      localStorage.setItem("moveOutRooms", JSON.stringify(moveOutData));
      router.push("/booking-summary");
    }
  };

  const getRoomIcon = (roomName) => {
    switch (roomName) {
      case "Living Room":
        return (
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
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        );
      case "Bedroom":
        return (
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
              d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-9 3h4"
            />
          </svg>
        );
      case "Bathroom":
        return (
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
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        );
      case "Kitchen":
        return (
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
              d="M3 9.5L3 14.5M12 21.5V4.5M21 9.5V14.5M12 4.5C10.8954 4.5 10 5.39543 10 6.5V8.5C10 9.60457 10.8954 10.5 12 10.5C13.1046 10.5 14 9.60457 14 8.5V6.5C14 5.39543 13.1046 4.5 12 4.5Z"
            />
          </svg>
        );
      case "Storage/Utility":
        return (
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
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        );
      default:
        return (
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        );
    }
  };

  const isReadyToContinue = totalRooms > 0 && propertySize && preferredTime; // Updated to include preferredTime

  return (
    <>
      <Head>
        <title>Move-out/Move-in Services | Home Services</title>
        <meta
          name="description"
          content="Book our professional moving services"
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Top service info banner */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-3 text-center">
          <p className="text-sm">Professional Moving & Cleaning Services</p>
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
              Moving Services
            </h1>
            <p className="text-sm text-gray-500 hidden md:block">
              Professional moving and cleaning solutions
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8 pb-28 lg:pb-8">
          {/* Progress indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep >= 1 ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  Choose Service
                </span>
              </div>
              <div
                className={`w-12 h-0.5 ${
                  currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"
                }`}
              ></div>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 2
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep >= 2 ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  Customize
                </span>
              </div>
            </div>
          </div>

          {/* Slide container */}
          <div className="relative overflow-hidden">
            <div
              className={`flex transition-transform duration-500 ease-in-out ${
                currentStep === 1
                  ? "transform translate-x-0"
                  : "transform -translate-x-full"
              }`}
            >
              {/* Step 1: Category Selection */}
              <div className="w-full flex-shrink-0">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
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
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">
                        Choose Moving Service
                      </h2>
                      <p className="text-sm text-gray-500">
                        Select the type of moving service you need
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(categories).map(
                      ([categoryName, categoryData]) => (
                        <div
                          key={categoryName}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:border-blue-300 ${
                            selectedCategory === categoryName
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200"
                          }`}
                          onClick={() => handleCategorySelect(categoryName)}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-3">
                              <span className="text-2xl">
                                {categoryData.icon}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium text-gray-900">
                                  {categoryName}
                                </h3>
                                <div
                                  className={`w-4 h-4 rounded-full border-2 ${
                                    selectedCategory === categoryName
                                      ? "border-blue-500 bg-blue-500"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {selectedCategory === categoryName && (
                                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">
                                {categoryData.description}
                              </p>
                              <div className="text-xs text-gray-500">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-medium">Duration:</span>
                                  <span>{categoryData.duration}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">
                                    Starting from:
                                  </span>
                                  <span className="text-blue-600 font-semibold">
                                    ₦{categoryData.basePrice.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  {/* Selected category details */}
                  {selectedCategory && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {selectedCategory} includes:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {categories[selectedCategory].services.map(
                          (service, index) => (
                            <div key={index} className="flex items-center">
                              <svg
                                className="h-4 w-4 text-blue-500 mr-2"
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
                              <span className="text-sm text-gray-700">
                                {service}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Customization */}
              <div className="w-full flex-shrink-0">
                <div className="space-y-6">
                  {/* Room selection */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-6">
                      <button
                        onClick={handleBackToCategories}
                        className="mr-4 text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-full transition-all"
                        aria-label="Go back to categories"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
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
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
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
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">
                          Select Rooms
                        </h2>
                        <p className="text-sm text-gray-500">
                          {selectedCategory} • Enter number of rooms
                        </p>
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="mb-6 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${Math.min(totalRooms * 8, 100)}%` }}
                      ></div>
                    </div>

                    {/* Room selectors */}
                    <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                      {Object.keys(rooms).map((room) => (
                        <div
                          key={room}
                          className={`bg-white border-2 p-4 rounded-xl flex items-center justify-between transition-all duration-200 ${
                            rooms[room] > 0
                              ? "border-blue-400 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                rooms[room] > 0
                                  ? "bg-blue-200 text-blue-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {getRoomIcon(room)}
                            </div>
                            <span className="text-base font-medium text-gray-900">
                              {room}
                            </span>
                          </div>
                          <div className="flex items-center bg-gray-50 rounded-lg border border-gray-100">
                            <button
                              onClick={() => handleDecrement(room)}
                              className={`w-10 h-10 flex items-center justify-center rounded-l-lg ${
                                rooms[room] > 0
                                  ? "text-blue-600 hover:bg-gray-100"
                                  : "text-gray-300"
                              }`}
                              disabled={rooms[room] === 0}
                              aria-label={`Decrease ${room}`}
                            >
                              <span className="text-xl">−</span>
                            </button>
                            <span className="w-10 text-center font-semibold text-gray-900">
                              {rooms[room]}
                            </span>
                            <button
                              onClick={() => handleIncrement(room)}
                              className="w-10 h-10 flex items-center justify-center rounded-r-lg text-blue-600 hover:bg-gray-100"
                              aria-label={`Increase ${room}`}
                            >
                              <span className="text-xl">+</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Selected room count */}
                    <div className="mt-6 text-center">
                      <p className="text-gray-600">
                        <span className="font-semibold text-blue-600 text-xl">
                          {totalRooms}
                        </span>
                        <span className="ml-1 text-gray-700">
                          rooms selected
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Property size selection */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
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
                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                          />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">
                          Property Size
                        </h2>
                        <p className="text-sm text-gray-500">
                          Select your property size for accurate pricing
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {propertySizes.map((size) => (
                        <div
                          key={size.id}
                          className={`p-4 rounded-xl flex items-center justify-between border-2 transition-all duration-200 cursor-pointer ${
                            propertySize === size.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() => setPropertySize(size.id)}
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                                propertySize === size.id
                                  ? "border-blue-600"
                                  : "border-gray-300"
                              }`}
                            >
                              {propertySize === size.id && (
                                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                              )}
                            </div>
                            <div>
                              <span className="text-base font-medium text-gray-900">
                                {size.name}
                              </span>
                              <p className="text-sm text-gray-600">
                                {size.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional services */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
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
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">
                          Additional Services
                        </h2>
                        <p className="text-sm text-gray-500">
                          Optional add-ons to enhance your service
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {additionalServiceOptions.map((service) => (
                        <div
                          key={service.id}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            additionalServices.includes(service.id)
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() => toggleAdditionalService(service.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div
                                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center mr-3 ${
                                  additionalServices.includes(service.id)
                                    ? "border-blue-600 bg-blue-600"
                                    : "border-gray-300"
                                }`}
                              >
                                {additionalServices.includes(service.id) && (
                                  <svg
                                    className="h-4 w-4 text-white"
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
                                )}
                              </div>
                              <div className="flex items-center">
                                <span className="text-lg mr-2">
                                  {service.icon}
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                  {service.name}
                                </span>
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-blue-600">
                              ₦{service.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preferred time and special instructions */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Service Details
                    </h3>

                    {/* Preferred time */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred service time
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setPreferredTime(time)}
                            className={`p-3 text-sm rounded-lg border-2 transition-all duration-200 ${
                              preferredTime === time
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Special instructions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special instructions (optional)
                      </label>
                      <textarea
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Any special requests or areas that need extra attention..."
                      />
                    </div>
                  </div>

                  {/* Service guarantee */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Our Moving Promise
                    </h3>
                    <div className="space-y-2">
                      {[
                        "Professional and experienced moving team",
                        "Comprehensive insurance coverage",
                        "Flexible scheduling to fit your timeline",
                        "Quality cleaning materials and equipment",
                        "Satisfaction guarantee or money back",
                      ].map((promise, index) => (
                        <div key={index} className="flex items-start">
                          <svg
                            className="h-5 w-5 text-blue-500 mr-2 mt-0.5"
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
                          <p className="text-sm text-gray-700">{promise}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary and Continue button */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Service Summary
                        </h3>
                        <p className="text-sm text-gray-500">
                          {selectedCategory} • {totalRooms}{" "}
                          {totalRooms === 1 ? "room" : "rooms"} •{" "}
                          {propertySize &&
                            propertySizes.find((s) => s.id === propertySize)
                              ?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Duration: {categories[selectedCategory]?.duration} •{" "}
                          {additionalServices.length} add-ons selected
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Estimated Price</p>
                        <p className="text-xl font-bold text-blue-600">
                          ₦{calculatePrice().toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {isDesktop && (
                      <div className="mt-6">
                        <button
                          onClick={handleContinue}
                          disabled={!isReadyToContinue}
                          className={`w-full py-4 rounded-xl text-lg font-medium shadow-lg transition-all duration-300 ${
                            isReadyToContinue
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {isReadyToContinue
                            ? "Continue to Booking"
                            : "Complete all selections"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer for Mobile */}
        {currentStep === 2 && !isDesktop && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-20">
            <div className="max-w-3xl mx-auto">
              <button
                onClick={handleContinue}
                disabled={!isReadyToContinue}
                className={`w-full py-4 rounded-xl text-lg font-medium shadow-lg transition-all duration-300 ${
                  isReadyToContinue
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isReadyToContinue
                  ? "Continue to Booking"
                  : "Complete all selections"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
