// pages/house-cleaning.js
"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";

export default function HouseCleaningPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // 1: category selection, 2: service customization
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [items, setItems] = useState({
    "Living Room": 0,
    Bedrooms: 0,
    Bathrooms: 0,
    Kitchen: 0,
    "Dining Room": 0,
    "Terrace/Balcony": 0,
    Garage: 0,
    "Study/Office": 0,
  });
  const [homeSize, setHomeSize] = useState("");
  const [frequency, setFrequency] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  // Cleaning categories with descriptions and pricing
  const categories = {
    "Standard Cleaning": {
      description: "Regular maintenance cleaning for ongoing upkeep",
      turnaround: "2-4 hours",
      basePrice: 8000,
      pricePerRoom: 1200,
      icon: "🧹",
    },
    "Deep Cleaning": {
      description: "Thorough, detailed cleaning including hard-to-reach areas",
      turnaround: "4-6 hours",
      basePrice: 15000,
      pricePerRoom: 2000,
      icon: "✨",
    },
    "Move-in Cleaning": {
      description: "Complete cleaning for your new home before moving in",
      turnaround: "5-8 hours",
      basePrice: 20000,
      pricePerRoom: 2500,
      icon: "📦",
    },
    "Move-out Cleaning": {
      description: "Thorough cleaning to get your deposit back",
      turnaround: "5-8 hours",
      basePrice: 22000,
      pricePerRoom: 2800,
      icon: "🏠",
    },
  };

  const cleaningPackages = [
    {
      id: "basic",
      title: "Basic Package",
      description: "Essential cleaning for budget-conscious customers",
      features: ["Dusting", "Vacuuming", "Mopping", "Trash removal"],
      multiplier: 0.8,
    },
    {
      id: "standard",
      title: "Standard Package",
      description: "Complete cleaning with attention to detail",
      features: [
        "All basic services",
        "Window cleaning",
        "Appliance exterior",
        "Bathroom sanitizing",
      ],
      multiplier: 1,
    },
    {
      id: "premium",
      title: "Premium Package",
      description: "Comprehensive cleaning with extra care",
      features: [
        "All standard services",
        "Inside appliances",
        "Baseboards",
        "Light fixtures",
        "Cabinet fronts",
      ],
      multiplier: 1.4,
    },
    {
      id: "luxury",
      title: "Luxury Package",
      description: "White-glove service with meticulous attention",
      features: [
        "All premium services",
        "Interior windows",
        "Detailed organization",
        "Premium products",
        "Quality inspection",
      ],
      multiplier: 1.8,
    },
  ];

  const homeSizes = [
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

  const frequencies = [
    {
      id: "one-time",
      name: "One-time Service",
      discount: 0,
      description: "Single cleaning session",
    },
    {
      id: "monthly",
      name: "Monthly",
      discount: 0.05,
      description: "Once per month",
    },
    {
      id: "bi-weekly",
      name: "Bi-weekly",
      discount: 0.1,
      description: "Every two weeks",
    },
    { id: "weekly", name: "Weekly", discount: 0.15, description: "Every week" },
  ];

  const timeSlots = [
    "8:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
    "6:00 PM - 8:00 PM",
  ];

  // Calculate total items whenever items state changes
  useEffect(() => {
    const total = Object.values(items).reduce((sum, count) => sum + count, 0);
    setTotalItems(total);
  }, [items]);

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
    setSelectedPackage(null);
    setItems({
      "Living Room": 0,
      Bedrooms: 0,
      Bathrooms: 0,
      Kitchen: 0,
      "Dining Room": 0,
      "Terrace/Balcony": 0,
      Garage: 0,
      "Study/Office": 0,
    });
    setHomeSize("");
    setFrequency("");
    setSpecialInstructions("");
    setPreferredTime("");
  };

  const handleIncrement = (item) => {
    setItems((prev) => ({
      ...prev,
      [item]: prev[item] + 1,
    }));
  };

  const handleDecrement = (item) => {
    if (items[item] > 0) {
      setItems((prev) => ({
        ...prev,
        [item]: prev[item] - 1,
      }));
    }
  };

  const calculatePrice = () => {
    if (!selectedCategory || !selectedPackage || !homeSize || !frequency)
      return 0;

    const categoryData = categories[selectedCategory];
    const packageMultiplier = selectedPackage.multiplier;
    const sizeMultiplier =
      homeSizes.find((size) => size.id === homeSize)?.multiplier || 1;
    const frequencyDiscount =
      frequencies.find((freq) => freq.id === frequency)?.discount || 0;

    const baseTotal =
      (categoryData.basePrice + totalItems * categoryData.pricePerRoom) *
      packageMultiplier *
      sizeMultiplier;
    const discountedPrice = baseTotal * (1 - frequencyDiscount);

    return Math.round(discountedPrice);
  };

  const getEstimatedTime = () => {
    if (!selectedCategory) return "2-4 hours";
    const baseTurnaround = categories[selectedCategory].turnaround;

    if (selectedPackage) {
      if (selectedPackage.multiplier >= 1.8) return "6-10 hours";
      if (selectedPackage.multiplier >= 1.4) return "4-8 hours";
      if (selectedPackage.multiplier >= 1) return baseTurnaround;
      return "2-3 hours";
    }

    return baseTurnaround;
  };

  const getRoomIcon = (roomName) => {
    switch (roomName) {
      case "Living Room":
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
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        );
      case "Bedrooms":
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
              d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-9 3h4"
            />
          </svg>
        );
      case "Bathrooms":
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
      case "Kitchen":
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
              d="M3 9.5L3 14.5M12 21.5V4.5M21 9.5V14.5M12 4.5C10.8954 4.5 10 5.39543 10 6.5V8.5C10 9.60457 10.8954 10.5 12 10.5C13.1046 10.5 14 9.60457 14 8.5V6.5C14 5.39543 13.1046 4.5 12 4.5Z"
            />
          </svg>
        );
      default:
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        );
    }
  };

  const handleContinue = () => {
    if (selectedPackage && homeSize && frequency && preferredTime) {
      const cleaningData = {
        category: selectedCategory,
        package: selectedPackage.title,
        items: items,
        homeSize: homeSize,
        frequency: frequency,
        estimatedPrice: calculatePrice(),
        estimatedTime: getEstimatedTime(),
        preferredTime: preferredTime,
        specialInstructions: specialInstructions,
        turnaround: categories[selectedCategory].turnaround,
      };
      localStorage.setItem("cleaningItems", JSON.stringify(cleaningData));
      router.push("/booking-summary");
    }
  };

  const isReadyToContinue =
    selectedPackage && homeSize && frequency && preferredTime;

  return (
    <>
      <Head>
        <title>House Cleaning | Home Services</title>
        <meta
          name="description"
          content="Book our professional house cleaning service"
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Top service info banner */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white p-3 text-center">
          <p className="text-sm">Professional House Cleaning Services</p>
        </div>

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white p-4 flex items-center border-b shadow-sm">
          <button
            onClick={() => router.back()}
            className="mr-4 text-gray-800 hover:bg-gray-100 p-2 rounded-full transition-all"
            aria-label="Go back"
          >
            <svg
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
            <h1 className="text-2xl font-bold text-gray-900">House Cleaning</h1>
            <p className="text-sm text-gray-500 hidden md:block">
              Customize your cleaning service
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
          {/* Progress indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 1
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep >= 1 ? "text-purple-600" : "text-gray-500"
                  }`}
                >
                  Choose Service
                </span>
              </div>
              <div
                className={`w-12 h-0.5 ${
                  currentStep >= 2 ? "bg-purple-600" : "bg-gray-200"
                }`}
              ></div>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 2
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep >= 2 ? "text-purple-600" : "text-gray-500"
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
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
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
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">
                        Choose Cleaning Service
                      </h2>
                      <p className="text-sm text-gray-500">
                        Select the type of cleaning service you need
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(categories).map(
                      ([categoryName, categoryData]) => (
                        <div
                          key={categoryName}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:border-purple-300 ${
                            selectedCategory === categoryName
                              ? "border-purple-500 bg-purple-50"
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
                                      ? "border-purple-500 bg-purple-500"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {selectedCategory === categoryName && (
                                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {categoryData.description}
                              </p>
                              <div className="text-xs text-gray-500">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">Duration:</span>
                                  <span>{categoryData.turnaround}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">
                                    Starting from:
                                  </span>
                                  <span className="text-purple-600 font-semibold">
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
                        {[
                          "Professional cleaning team",
                          "All cleaning supplies included",
                          "Quality assurance inspection",
                          "Flexible scheduling",
                          "Satisfaction guarantee",
                          "Insured and bonded service",
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <svg
                              className="h-4 w-4 text-purple-500 mr-2"
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
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Service Customization */}
              <div className="w-full flex-shrink-0">
                <div className="space-y-6">
                  {/* Cleaning packages */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-6">
                      <button
                        onClick={handleBackToCategories}
                        className="mr-4 text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-full transition-all"
                        aria-label="Go back to categories"
                      >
                        <svg
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
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
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
                      </div>
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">
                          Choose Package
                        </h2>
                        <p className="text-sm text-gray-500">
                          {selectedCategory} • Select your cleaning package
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cleaningPackages.map((pkg) => (
                        <div
                          key={pkg.id}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            selectedPackage?.id === pkg.id
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200 hover:border-purple-300"
                          }`}
                          onClick={() => setSelectedPackage(pkg)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-900">
                              {pkg.title}
                            </h3>
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                selectedPackage?.id === pkg.id
                                  ? "border-purple-600"
                                  : "border-gray-300"
                              }`}
                            >
                              {selectedPackage?.id === pkg.id && (
                                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {pkg.description}
                          </p>
                          <div className="space-y-1">
                            {pkg.features.slice(0, 3).map((feature, index) => (
                              <div
                                key={index}
                                className="flex items-center text-xs text-gray-500"
                              >
                                <svg
                                  className="h-3 w-3 text-green-500 mr-1"
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
                                {feature}
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 text-right">
                            <span className="text-sm font-medium text-purple-600">
                              {pkg.multiplier === 1
                                ? "Standard Rate"
                                : `${Math.round((pkg.multiplier - 1) * 100)}% ${
                                    pkg.multiplier > 1 ? "more" : "less"
                                  }`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Room selection */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Select Rooms to Clean
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {Object.keys(items).map((item) => (
                        <div
                          key={item}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                            items[item] > 0
                              ? "border-purple-400 bg-purple-50"
                              : "border-gray-200 hover:border-purple-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                                  items[item] > 0
                                    ? "bg-purple-200 text-purple-700"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {getRoomIcon(item)}
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {item}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <button
                              onClick={() => handleDecrement(item)}
                              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                items[item] > 0
                                  ? "text-purple-600 hover:bg-purple-100"
                                  : "text-gray-300"
                              }`}
                              disabled={items[item] === 0}
                            >
                              <span className="text-sm">−</span>
                            </button>
                            <span className="text-sm font-semibold text-gray-900">
                              {items[item]}
                            </span>
                            <button
                              onClick={() => handleIncrement(item)}
                              className="w-6 h-6 rounded-full text-purple-600 hover:bg-purple-100 flex items-center justify-center"
                            >
                              <span className="text-sm">+</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-center text-sm text-gray-500">
                      <span className="font-semibold text-purple-600">
                        {totalItems}
                      </span>{" "}
                      rooms selected
                    </div>
                  </div>

                  {/* Home size and frequency */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Home size */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Home Size
                      </h3>
                      <div className="space-y-3">
                        {homeSizes.map((size) => (
                          <div
                            key={size.id}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                              homeSize === size.id
                                ? "border-purple-500 bg-purple-50"
                                : "border-gray-200 hover:border-purple-300"
                            }`}
                            onClick={() => setHomeSize(size.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div
                                  className={`w-4 h-4 rounded-full border-2 mr-3 ${
                                    homeSize === size.id
                                      ? "border-purple-600"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {homeSize === size.id && (
                                    <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                                  )}
                                </div>
                                <div>
                                  <span className="font-medium text-gray-900">
                                    {size.name}
                                  </span>
                                  <p className="text-xs text-gray-500">
                                    {size.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Frequency */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Service Frequency
                      </h3>
                      <div className="space-y-3">
                        {frequencies.map((freq) => (
                          <div
                            key={freq.id}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                              frequency === freq.id
                                ? "border-purple-500 bg-purple-50"
                                : "border-gray-200 hover:border-purple-300"
                            }`}
                            onClick={() => setFrequency(freq.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div
                                  className={`w-4 h-4 rounded-full border-2 mr-3 ${
                                    frequency === freq.id
                                      ? "border-purple-600"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {frequency === freq.id && (
                                    <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                                  )}
                                </div>
                                <div>
                                  <span className="font-medium text-gray-900">
                                    {freq.name}
                                  </span>
                                  <p className="text-xs text-gray-500">
                                    {freq.description}
                                  </p>
                                </div>
                              </div>
                              <span className="text-sm font-medium text-green-600">
                                {freq.discount > 0
                                  ? `-${Math.round(freq.discount * 100)}%`
                                  : "Standard"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
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
                        Preferred cleaning time
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setPreferredTime(time)}
                            className={`p-3 text-sm rounded-lg border-2 transition-all duration-200 ${
                              preferredTime === time
                                ? "border-purple-500 bg-purple-50 text-purple-700"
                                : "border-gray-200 hover:border-purple-300"
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={3}
                        placeholder="Any special requests or areas that need extra attention..."
                      />
                    </div>
                  </div>

                  {/* Service guarantee */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Our Cleaning Promise
                    </h3>
                    <div className="space-y-2">
                      {[
                        "Trained and background-checked cleaning professionals",
                        "Eco-friendly cleaning products and equipment",
                        "Comprehensive insurance coverage",
                        "Quality assurance inspection after every service",
                        "100% satisfaction guarantee or we'll re-clean for free",
                      ].map((promise, index) => (
                        <div key={index} className="flex items-start">
                          <svg
                            className="h-5 w-5 text-purple-500 mr-2 mt-0.5"
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
                          {selectedCategory} • {selectedPackage?.title} •{" "}
                          {totalItems} rooms
                        </p>
                        <p className="text-xs text-gray-500">
                          Estimated duration: {getEstimatedTime()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Estimated Price</p>
                        <p className="text-xl font-bold text-purple-600">
                          ₦{calculatePrice().toLocaleString()}
                        </p>
                        {frequency !== "one-time" && (
                          <p className="text-xs text-green-600">
                            {frequencies.find((f) => f.id === frequency)
                              ?.discount > 0 &&
                              `Saved ₦${Math.round(
                                (calculatePrice() *
                                  frequencies.find((f) => f.id === frequency)
                                    .discount) /
                                  (1 -
                                    frequencies.find((f) => f.id === frequency)
                                      .discount)
                              ).toLocaleString()}`}
                          </p>
                        )}
                      </div>
                    </div>

                    <div
                      className={
                        isDesktop
                          ? "mt-6"
                          : "fixed bottom-0 left-0 right-0 p-4 bg-white border-t"
                      }
                    >
                      <button
                        onClick={handleContinue}
                        disabled={!isReadyToContinue}
                        className={`w-full py-4 rounded-xl text-lg font-medium shadow-lg transition-all duration-300 ${
                          isReadyToContinue
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {isReadyToContinue
                          ? "Continue to Booking"
                          : "Complete all selections"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
