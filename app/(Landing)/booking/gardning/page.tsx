"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";

export default function GardeningPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [services, setServices] = useState({
    "Lawn Mowing": 0,
    "Hedge Trimming": 0,
    Weeding: 0,
    Planting: 0,
    Pruning: 0,
    "Leaf Removal": 0,
  });
  const [gardenSize, setGardenSize] = useState("");
  const [frequency, setFrequency] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [totalServices, setTotalServices] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  // Gardening categories - simplified structure like house cleaning
  const categories = {
    "Basic Maintenance": {
      description: "Essential garden upkeep for regular maintenance",
      turnaround: "1-2 days",
      basePrice: 5000,
      pricePerService: 800,
      icon: "🌱",
    },
    "Landscape Care": {
      description: "Comprehensive garden and landscape management",
      turnaround: "2-3 days",
      basePrice: 8000,
      pricePerService: 1200,
      icon: "🌳",
    },
    "Seasonal Service": {
      description: "Seasonal cleanup and preparation services",
      turnaround: "1-3 days",
      basePrice: 6500,
      pricePerService: 1000,
      icon: "🍂",
    },
    "Premium Garden Care": {
      description: "Complete garden transformation and maintenance",
      turnaround: "3-5 days",
      basePrice: 12000,
      pricePerService: 1500,
      icon: "🌺",
    },
  };

  // Simplified packages like house cleaning
  const gardeningPackages = [
    {
      id: "basic",
      title: "Basic Package",
      description: "Essential gardening for budget-conscious customers",
      features: [
        "Basic lawn care",
        "Simple weeding",
        "Debris removal",
        "Basic cleanup",
      ],
      multiplier: 0.8,
    },
    {
      id: "standard",
      title: "Standard Package",
      description: "Complete gardening with attention to detail",
      features: [
        "All basic services",
        "Hedge shaping",
        "Plant care",
        "Garden bed maintenance",
      ],
      multiplier: 1,
    },
    {
      id: "premium",
      title: "Premium Package",
      description: "Comprehensive gardening with extra care",
      features: [
        "All standard services",
        "Detailed pruning",
        "Soil treatment",
        "Seasonal planting",
        "Garden design advice",
      ],
      multiplier: 1.4,
    },
    {
      id: "luxury",
      title: "Luxury Package",
      description: "Professional landscaping with meticulous attention",
      features: [
        "All premium services",
        "Custom landscaping",
        "Premium plant selection",
        "Ongoing maintenance plan",
        "Quality inspection",
      ],
      multiplier: 1.8,
    },
  ];

  const gardenSizes = [
    {
      id: "small",
      name: "Small Garden",
      multiplier: 0.7,
      description: "Up to 100 sq meters",
    },
    {
      id: "medium",
      name: "Medium Garden",
      multiplier: 1,
      description: "100-250 sq meters",
    },
    {
      id: "large",
      name: "Large Garden",
      multiplier: 1.5,
      description: "250-500 sq meters",
    },
    {
      id: "xlarge",
      name: "Very Large Garden",
      multiplier: 2.2,
      description: "500+ sq meters",
    },
  ];

  const frequencies = [
    {
      id: "one-time",
      name: "One-time Service",
      discount: 0,
      description: "Single gardening session",
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
    {
      id: "weekly",
      name: "Weekly",
      discount: 0.15,
      description: "Every week",
    },
  ];

  const timeSlots = [
    "8:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
    "6:00 PM - 8:00 PM",
  ];

  // Calculate total services whenever services state changes
  useEffect(() => {
    const total = Object.values(services).reduce(
      (sum, count) => sum + count,
      0
    );
    setTotalServices(total);
  }, [services]);

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
    setServices({
      "Lawn Mowing": 0,
      "Hedge Trimming": 0,
      Weeding: 0,
      Planting: 0,
      Pruning: 0,
      "Leaf Removal": 0,
    });
    setGardenSize("");
    setFrequency("");
    setSpecialInstructions("");
    setPreferredTime("");
  };

  const handleIncrement = (service) => {
    setServices((prev) => ({
      ...prev,
      [service]: prev[service] + 1,
    }));
  };

  const handleDecrement = (service) => {
    if (services[service] > 0) {
      setServices((prev) => ({
        ...prev,
        [service]: prev[service] - 1,
      }));
    }
  };

  const calculatePrice = () => {
    if (!selectedCategory || !selectedPackage || !gardenSize || !frequency)
      return 0;

    const categoryData = categories[selectedCategory];
    const packageMultiplier = selectedPackage.multiplier;
    const sizeMultiplier =
      gardenSizes.find((size) => size.id === gardenSize)?.multiplier || 1;
    const frequencyDiscount =
      frequencies.find((freq) => freq.id === frequency)?.discount || 0;

    const baseTotal =
      (categoryData.basePrice + totalServices * categoryData.pricePerService) *
      packageMultiplier *
      sizeMultiplier;
    const discountedPrice = baseTotal * (1 - frequencyDiscount);

    return Math.round(discountedPrice);
  };

  const getEstimatedTime = () => {
    if (!selectedCategory) return "1-2 days";
    const baseTurnaround = categories[selectedCategory].turnaround;

    if (selectedPackage) {
      if (selectedPackage.multiplier >= 1.8) return "4-6 days";
      if (selectedPackage.multiplier >= 1.4) return "3-5 days";
      if (selectedPackage.multiplier >= 1) return baseTurnaround;
      return "1-2 days";
    }

    return baseTurnaround;
  };

  const getServiceIcon = (serviceName) => {
    switch (serviceName) {
      case "Lawn Mowing":
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
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        );
      case "Hedge Trimming":
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
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
        );
      case "Weeding":
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
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        );
      case "Planting":
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      case "Pruning":
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
              d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        );
    }
  };

  const handleContinue = () => {
    if (selectedPackage && gardenSize && frequency && preferredTime) {
      // Structure data like house cleaning for consistency
      const gardeningData = {
        category: selectedCategory,
        package: selectedPackage.title,
        services: services, // Changed from 'items' to 'services' but same structure
        gardenSize: gardenSize,
        frequency: frequency,
        estimatedPrice: calculatePrice(),
        estimatedTime: getEstimatedTime(),
        preferredTime: preferredTime,
        specialInstructions: specialInstructions,
        turnaround: categories[selectedCategory].turnaround,
      };

      console.log("Saving gardeningDetails:", gardeningData);

      // Clear other service data to prevent conflicts
      localStorage.removeItem("cleaningItems");
      localStorage.removeItem("laundryOption");
      localStorage.removeItem("moveOutRooms");
      localStorage.removeItem("repairRequest");

      localStorage.setItem("gardeningDetails", JSON.stringify(gardeningData));
      router.push("/booking-summary");
    }
  };

  const isReadyToContinue =
    selectedPackage && gardenSize && frequency && preferredTime;

  return (
    <>
      <Head>
        <title>Gardening Services | Home Services</title>
        <meta
          name="description"
          content="Book our professional gardening services"
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Top service info banner */}
        <div className="bg-gradient-to-r from-green-700 to-green-900 text-white p-3 text-center">
          <p className="text-sm">Professional Gardening Services</p>
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
            <h1 className="text-2xl font-bold text-gray-900">
              Gardening Services
            </h1>
            <p className="text-sm text-gray-700 hidden md:block">
              Customize your gardening service
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
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  1
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep >= 1 ? "text-green-600" : "text-gray-700"
                  }`}
                >
                  Choose Service
                </span>
              </div>
              <div
                className={`w-12 h-0.5 ${
                  currentStep >= 2 ? "bg-green-600" : "bg-gray-200"
                }`}
              ></div>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 2
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  2
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep >= 2 ? "text-green-600" : "text-gray-700"
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
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
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
                        Choose Gardening Service
                      </h2>
                      <p className="text-sm text-gray-700">
                        Select the type of gardening service you need
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(categories).map(
                      ([categoryName, categoryData]) => (
                        <div
                          key={categoryName}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:border-green-300 ${
                            selectedCategory === categoryName
                              ? "border-green-500 bg-green-50"
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
                                      ? "border-green-500 bg-green-500"
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
                              <div className="text-xs text-gray-700">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">Duration:</span>
                                  <span>{categoryData.turnaround}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">
                                    Starting from:
                                  </span>
                                  <span className="text-green-600 font-semibold">
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
                          "Professional gardening team",
                          "All gardening tools included",
                          "Quality assurance inspection",
                          "Flexible scheduling",
                          "Satisfaction guarantee",
                          "Eco-friendly practices",
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <svg
                              className="h-4 w-4 text-green-500 mr-2"
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
                  {/* Gardening packages */}
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
                      <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
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
                        <p className="text-sm text-gray-700">
                          {selectedCategory} • Select your gardening package
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {gardeningPackages.map((pkg) => (
                        <div
                          key={pkg.id}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            selectedPackage?.id === pkg.id
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-green-300"
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
                                  ? "border-green-600"
                                  : "border-gray-300"
                              }`}
                            >
                              {selectedPackage?.id === pkg.id && (
                                <div className="w-3 h-3 rounded-full bg-green-600"></div>
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
                                className="flex items-center text-xs text-gray-700"
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
                            <span className="text-sm font-medium text-green-600">
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

                  {/* Service selection */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Select Services
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                      {Object.keys(services).map((service) => (
                        <div
                          key={service}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                            services[service] > 0
                              ? "border-green-400 bg-green-50"
                              : "border-gray-200 hover:border-green-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                                  services[service] > 0
                                    ? "bg-green-200 text-green-700"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {getServiceIcon(service)}
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {service}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <button
                              onClick={() => handleDecrement(service)}
                              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                services[service] > 0
                                  ? "text-green-600 hover:bg-green-100"
                                  : "text-gray-300"
                              }`}
                              disabled={services[service] === 0}
                            >
                              <span className="text-sm">−</span>
                            </button>
                            <span className="text-sm font-semibold text-gray-900">
                              {services[service]}
                            </span>
                            <button
                              onClick={() => handleIncrement(service)}
                              className="w-6 h-6 rounded-full text-green-600 hover:bg-green-100 flex items-center justify-center"
                            >
                              <span className="text-sm">+</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-center text-sm text-gray-700">
                      <span className="font-semibold text-green-600">
                        {totalServices}
                      </span>{" "}
                      services selected
                    </div>
                  </div>

                  {/* Garden size and frequency */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Garden size */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Garden Size
                      </h3>
                      <div className="space-y-3">
                        {gardenSizes.map((size) => (
                          <div
                            key={size.id}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                              gardenSize === size.id
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 hover:border-green-300"
                            }`}
                            onClick={() => setGardenSize(size.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div
                                  className={`w-4 h-4 rounded-full border-2 mr-3 ${
                                    gardenSize === size.id
                                      ? "border-green-600"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {gardenSize === size.id && (
                                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                                  )}
                                </div>
                                <div>
                                  <span className="font-medium text-gray-900">
                                    {size.name}
                                  </span>
                                  <p className="text-xs text-gray-700">
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
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 hover:border-green-300"
                            }`}
                            onClick={() => setFrequency(freq.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div
                                  className={`w-4 h-4 rounded-full border-2 mr-3 ${
                                    frequency === freq.id
                                      ? "border-green-600"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {frequency === freq.id && (
                                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                                  )}
                                </div>
                                <div>
                                  <span className="font-medium text-gray-900">
                                    {freq.name}
                                  </span>
                                  <p className="text-xs text-gray-700">
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
                        Preferred service time
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setPreferredTime(time)}
                            className={`p-3 text-sm rounded-lg border-2 transition-all duration-200 ${
                              preferredTime === time
                                ? "border-green-500 bg-green-50 text-green-700"
                                : "border-gray-200 hover:border-green-300"
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        rows={3}
                        placeholder="Any special requests or areas that need extra attention..."
                      />
                    </div>
                  </div>

                  {/* Service guarantee */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Our Gardening Promise
                    </h3>
                    <div className="space-y-2">
                      {[
                        "Trained and experienced gardening professionals",
                        "Professional equipment and eco-friendly practices",
                        "Comprehensive insurance coverage",
                        "Quality assurance inspection after every service",
                        "100% satisfaction guarantee or we'll return for free",
                      ].map((promise, index) => (
                        <div key={index} className="flex items-start">
                          <svg
                            className="h-5 w-5 text-green-500 mr-2 mt-0.5"
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
                        <p className="text-sm text-gray-700">
                          {selectedCategory} • {selectedPackage?.title} •{" "}
                          {totalServices} services
                        </p>
                        <p className="text-xs text-gray-700">
                          Estimated duration: {getEstimatedTime()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-700">Estimated Price</p>
                        <p className="text-xl font-bold text-green-600">
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

                    {isDesktop && (
                      <div className="mt-6">
                        <button
                          onClick={handleContinue}
                          disabled={!isReadyToContinue}
                          className={`w-full py-4 rounded-xl text-lg font-medium shadow-lg transition-all duration-300 ${
                            isReadyToContinue
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-gray-300 text-gray-700 cursor-not-allowed"
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
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-300 text-gray-700 cursor-not-allowed"
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
