// pages/gardening.js
"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";

export default function GardeningPage() {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState([]);
  const [gardenSize, setGardenSize] = useState(null);
  const [frequency, setFrequency] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect if viewing on desktop
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize(); // Check on initial load
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const gardenServices = [
    {
      id: "lawn-mowing",
      title: "Lawn Mowing",
      description:
        "Regular cutting of grass to maintain a healthy and neat appearance",
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
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
          />
        </svg>
      ),
    },
    {
      id: "hedge-trimming",
      title: "Hedge Trimming",
      description:
        "Precise cutting of hedges and bushes to maintain shape and promote healthy growth",
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
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      ),
    },
    {
      id: "weeding",
      title: "Weeding",
      description:
        "Removal of unwanted plants from garden beds, lawns, and paved areas",
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
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      id: "planting",
      title: "Planting",
      description:
        "Adding new plants, flowers, or trees to enhance your garden's beauty",
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
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "pruning",
      title: "Pruning",
      description:
        "Selective removal of branches to improve plant health and appearance",
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
            d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"
          />
        </svg>
      ),
    },
    {
      id: "leaf-removal",
      title: "Leaf Removal",
      description: "Clearing fallen leaves to maintain a tidy garden and lawn",
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  const gardenSizes = [
    {
      id: "small",
      title: "Small",
      description: "Up to 100 sq meters",
      price: "₦5,000",
    },
    {
      id: "medium",
      title: "Medium",
      description: "100-250 sq meters",
      price: "₦8,500",
    },
    {
      id: "large",
      title: "Large",
      description: "250-500 sq meters",
      price: "₦12,000",
    },
    {
      id: "xlarge",
      title: "X-Large",
      description: "500+ sq meters",
      price: "₦18,000",
    },
  ];

  const serviceFrequencies = [
    {
      id: "one-time",
      title: "One-time Service",
      description: "Single visit",
      price: "+₦0",
    },
    {
      id: "biweekly",
      title: "Bi-weekly",
      description: "Every two weeks",
      price: "-₦500 per visit",
    },
    {
      id: "weekly",
      title: "Weekly",
      description: "Every week",
      price: "-₦1,000 per visit",
    },
    {
      id: "monthly",
      title: "Monthly",
      description: "Once a month",
      price: "-₦250 per visit",
    },
  ];

  const toggleService = (serviceId) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleContinue = () => {
    // Make sure at least one service, garden size and frequency are selected
    if (selectedServices.length > 0 && gardenSize && frequency) {
      // Save the selected options to localStorage
      localStorage.setItem(
        "gardeningServices",
        JSON.stringify({
          services: selectedServices,
          gardenSize: gardenSize,
          frequency: frequency,
        })
      );

      // Navigate to the next step
      router.push("/booking-summary");
    }
  };

  const isReadyToContinue =
    selectedServices.length > 0 && gardenSize && frequency;

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
              Gardening Services
            </h1>
            <p className="text-sm text-gray-500 hidden md:block">
              Customize your gardening service
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
          {/* Garden services selection */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
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
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Garden Services
                </h2>
                <p className="text-sm text-gray-500">
                  Select the services you need (multiple selection allowed)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gardenServices.map((service) => (
                <div
                  key={service.id}
                  className={`p-4 rounded-xl flex items-start border-2 transition-all duration-200 cursor-pointer ${
                    selectedServices.includes(service.id)
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                  onClick={() => toggleService(service.id)}
                >
                  <div className="mr-4 mt-1">
                    <div
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                        selectedServices.includes(service.id)
                          ? "border-green-600 bg-green-600"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedServices.includes(service.id) && (
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
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <div
                        className={`w-8 h-8 rounded-full ${
                          selectedServices.includes(service.id)
                            ? "bg-green-200 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        } flex items-center justify-center mr-2`}
                      >
                        {service.icon}
                      </div>
                      <span className="text-lg font-medium text-gray-900">
                        {service.title}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 ml-10">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Garden size selection */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
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
                  Garden Size
                </h2>
                <p className="text-sm text-gray-500">
                  Select the size of your garden
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {gardenSizes.map((size) => (
                <div
                  key={size.id}
                  className={`p-4 rounded-xl flex items-center justify-between border-2 transition-all duration-200 cursor-pointer ${
                    gardenSize === size.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                  onClick={() => setGardenSize(size.id)}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                        gardenSize === size.id
                          ? "border-green-600"
                          : "border-gray-300"
                      }`}
                    >
                      {gardenSize === size.id && (
                        <div className="w-3 h-3 rounded-full bg-green-600"></div>
                      )}
                    </div>
                    <div>
                      <span className="text-base font-medium text-gray-900">
                        {size.title}
                      </span>
                      <p className="text-sm text-gray-600">
                        {size.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-green-600">
                    {size.price}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service frequency */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
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
                  Service Frequency
                </h2>
                <p className="text-sm text-gray-500">
                  How often would you like the service?
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {serviceFrequencies.map((freq) => (
                <div
                  key={freq.id}
                  className={`p-4 rounded-xl flex items-center justify-between border-2 transition-all duration-200 cursor-pointer ${
                    frequency === freq.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                  onClick={() => setFrequency(freq.id)}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                        frequency === freq.id
                          ? "border-green-600"
                          : "border-gray-300"
                      }`}
                    >
                      {frequency === freq.id && (
                        <div className="w-3 h-3 rounded-full bg-green-600"></div>
                      )}
                    </div>
                    <div>
                      <span className="text-base font-medium text-gray-900">
                        {freq.title}
                      </span>
                      <p className="text-sm text-gray-600">
                        {freq.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    {freq.price}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service guarantee */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-l-4 border-green-500">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Our Gardening Guarantee
            </h3>
            <div className="space-y-2">
              <div className="flex items-start">
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
                <p className="text-sm text-gray-700">
                  Experienced and certified gardeners
                </p>
              </div>
              <div className="flex items-start">
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
                <p className="text-sm text-gray-700">
                  Professional equipment for all garden types
                </p>
              </div>
              <div className="flex items-start">
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
                <p className="text-sm text-gray-700">
                  Eco-friendly practices and waste removal
                </p>
              </div>
              <div className="flex items-start">
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
                <p className="text-sm text-gray-700">
                  Satisfaction guarantee or we'll fix it for free
                </p>
              </div>
            </div>
          </div>

          {/* Continue button */}
          <div
            className={
              isDesktop
                ? "mt-6"
                : "fixed bottom-0 left-0 right-0 p-4 bg-white border-t"
            }
          >
            <button
              onClick={handleContinue}
              className={`w-full py-4 bg-green-600 text-white rounded-xl text-lg font-medium shadow-lg hover:bg-green-700 transition-all duration-300 ${
                !isReadyToContinue ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!isReadyToContinue}
            >
              Continue to Booking
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
