"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LaundryPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [itemCount, setItemCount] = useState(5);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);

  // Laundry categories with descriptions and pricing
  const categories = {
    "Express Service": {
      description: "Quick turnaround for urgent laundry needs",
      turnaround: "Same day (4-6 hours)",
      basePrice: 2500,
      pricePerKg: 400,
      icon: "⚡",
    },
    "Standard Service": {
      description: "Regular laundry service with quality care",
      turnaround: "24-48 hours",
      basePrice: 1500,
      pricePerKg: 250,
      icon: "👕",
    },
    "Premium Care": {
      description: "Delicate handling for special garments",
      turnaround: "2-3 days",
      basePrice: 3500,
      pricePerKg: 500,
      icon: "✨",
    },
    "Bulk Service": {
      description: "Best value for large loads and families",
      turnaround: "2-4 days",
      basePrice: 2000,
      pricePerKg: 180,
      icon: "📦",
    },
  };

  const laundryOptions = [
    {
      id: "washed-folded",
      title: "Washed and Folded",
      description:
        "Your clothes will be professionally washed and neatly folded.",
      icon: (
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
            d="M9 3h6m-6 0a3 3 0 00-3 3v12a3 3 0 003 3h6a3 3 0 003-3V6a3 3 0 00-3-3m-6 0H6a3 3 0 00-3 3v12a3 3 0 003 3h3M6 16h12M9 12h6"
          />
        </svg>
      ),
      multiplier: 1,
    },
    {
      id: "washed-ironed",
      title: "Washed and Ironed",
      description:
        "Your clothes will be professionally washed and carefully ironed.",
      icon: (
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
      multiplier: 1.3,
    },
    {
      id: "washed-ironed-folded",
      title: "Washed, Ironed, and Folded",
      description:
        "Complete service - your clothes will be washed, ironed, and perfectly folded.",
      icon: (
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
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      ),
      multiplier: 1.6,
    },
    {
      id: "dry-cleaning",
      title: "Dry Cleaning",
      description:
        "Professional dry cleaning for delicate fabrics and formal wear.",
      icon: (
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
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
      ),
      multiplier: 2.5,
    },
  ];

  const pickupTimes = [
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

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setTimeout(() => {
      setCurrentStep(2);
    }, 300);
  };

  const handleBackToCategories = () => {
    setCurrentStep(1);
    setSelectedOption(null);
    setItemCount(5);
    setSpecialInstructions("");
    setPickupTime("");
  };

  const calculatePrice = () => {
    if (!selectedCategory || !selectedOption) return 0;

    const categoryData = categories[selectedCategory];
    const optionMultiplier = selectedOption.multiplier;
    const estimatedWeight = Math.max(1, Math.floor(itemCount / 3)); // Rough estimate: 3 items ≈ 1kg

    const totalPrice =
      categoryData.basePrice +
      categoryData.pricePerKg * estimatedWeight * optionMultiplier;
    return Math.round(totalPrice);
  };

  const handleContinue = () => {
    if (selectedOption && pickupTime) {
      // Create laundry data object that matches what booking summary expects
      // Only include serializable data (no React components or functions)
      const laundryData = {
        // Core service info
        category: selectedCategory,
        service: selectedOption.id, // Use ID instead of title for consistency
        serviceTitle: selectedOption.title, // Keep title for display
        itemCount: itemCount,

        // Pricing - CRITICAL: This must be present for booking summary
        estimatedPrice: calculatePrice(),

        // Timing
        pickupTime: pickupTime,
        preferredTime: pickupTime, // Also set this for compatibility
        turnaround: categories[selectedCategory].turnaround,

        // Instructions
        specialInstructions: specialInstructions,

        // Additional data for backend (serializable only)
        categoryDetails: {
          description: categories[selectedCategory].description,
          turnaround: categories[selectedCategory].turnaround,
          basePrice: categories[selectedCategory].basePrice,
          pricePerKg: categories[selectedCategory].pricePerKg,
          // Don't include icon (it's an emoji string, so it's fine)
          icon: categories[selectedCategory].icon,
        },
        optionDetails: {
          id: selectedOption.id,
          title: selectedOption.title,
          description: selectedOption.description,
          multiplier: selectedOption.multiplier,
          // Don't include the icon JSX element
        },
        estimatedWeight: Math.max(1, Math.floor(itemCount / 3)),

        // For display purposes
        serviceDisplay: {
          categoryName: selectedCategory,
          serviceName: selectedOption.title,
          itemCount: itemCount,
          estimatedWeight: Math.max(1, Math.floor(itemCount / 3)),
          turnaround: categories[selectedCategory].turnaround,
          price: calculatePrice(),
        },
      };

      console.log("Saving laundry data:", laundryData);

      // Clear any existing service data
      localStorage.removeItem("cleaningItems");
      localStorage.removeItem("moveOutRooms");
      localStorage.removeItem("repairRequest");

      // Save laundry data
      localStorage.setItem("laundryOption", JSON.stringify(laundryData));

      // Navigate to booking summary
      router.push("/booking-summary");
    }
  };

  const isReadyToContinue =
    selectedOption && pickupTime && calculatePrice() > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top service info banner */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white p-3 text-center">
        <p className="text-sm">Professional Laundry Services</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Laundry Service</h1>
          <p className="text-sm text-gray-700 hidden md:block">
            Customize your laundry service
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
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                1
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  currentStep >= 1 ? "text-purple-600" : "text-gray-700"
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
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                2
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  currentStep >= 2 ? "text-purple-600" : "text-gray-700"
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
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      Choose Laundry Service
                    </h2>
                    <p className="text-sm text-gray-700">
                      Select the type of laundry service you need
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
                            <div className="text-xs text-gray-700">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">Turnaround:</span>
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
                        "Professional washing and care",
                        "Quality detergents and fabric softeners",
                        "Pickup and delivery service",
                        "Stain treatment (if possible)",
                        "Quality inspection before return",
                        "100% satisfaction guarantee",
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
                {/* Laundry options */}
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
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">
                        Choose Laundry Option
                      </h2>
                      <p className="text-sm text-gray-700">
                        {selectedCategory} • Select how you want your laundry
                        done
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {laundryOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`p-4 rounded-xl flex items-start border-2 transition-all duration-200 cursor-pointer ${
                          selectedOption?.id === option.id
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                        onClick={() => setSelectedOption(option)}
                      >
                        <div className="mr-4 mt-1">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedOption?.id === option.id
                                ? "border-purple-600"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedOption?.id === option.id && (
                              <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-2">
                                {option.icon}
                              </div>
                              <span className="text-lg font-medium text-gray-900">
                                {option.title}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-purple-600">
                              +{Math.round((option.multiplier - 1) * 100)}%
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 ml-10">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Item count and pickup time */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Service Details
                  </h3>

                  {/* Item count */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated number of items
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setItemCount(Math.max(1, itemCount - 1))}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                      >
                        <span className="text-xl">−</span>
                      </button>
                      <span className="text-xl font-semibold text-gray-900 min-w-[3rem] text-center">
                        {itemCount}
                      </span>
                      <button
                        onClick={() => setItemCount(itemCount + 1)}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                      >
                        <span className="text-xl">+</span>
                      </button>
                    </div>
                    <p className="text-xs text-gray-700 mt-1">
                      Estimated weight: ~
                      {Math.max(1, Math.floor(itemCount / 3))} kg
                    </p>
                  </div>

                  {/* Pickup time */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred pickup time
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {pickupTimes.map((time) => (
                        <button
                          key={time}
                          onClick={() => setPickupTime(time)}
                          className={`p-3 text-sm rounded-lg border-2 transition-all duration-200 ${
                            pickupTime === time
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
                      placeholder="Any special care instructions for your laundry..."
                    />
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
                        {selectedCategory} • {selectedOption?.title} •{" "}
                        {itemCount} items
                      </p>
                      <p className="text-xs text-gray-700">
                        Turnaround: {categories[selectedCategory]?.turnaround}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-700">Estimated Price</p>
                      <p className="text-xl font-bold text-purple-600">
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
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
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
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
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
  );
}
