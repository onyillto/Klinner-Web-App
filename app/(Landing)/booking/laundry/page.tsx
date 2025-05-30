// pages/laundry.js
"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";

export default function LaundryPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(null);
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

  const laundryOptions = [
    {
      id: "washed-folded",
      title: "Washed and Folded",
      description:
        "Your clothes will be professionally washed and neatly folded.",
    },
    {
      id: "washed-ironed",
      title: "Washed and Ironed",
      description:
        "Your clothes will be professionally washed and carefully ironed.",
    },
    {
      id: "washed-ironed-folded",
      title: "Washed, Ironed, and Folded",
      description:
        "Complete service - your clothes will be washed, ironed, and perfectly folded.",
    },
  ];

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    if (selectedOption) {
      // Save the selected option to localStorage
      localStorage.setItem("laundryOption", selectedOption.title);

      // Navigate to the next step
      router.push("/booking-summary");
    }
  };

  // Get appropriate icon for laundry option
  const getLaundryIcon = (optionId) => {
    switch (optionId) {
      case "washed-folded":
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
              d="M9 3h6m-6 0a3 3 0 00-3 3v12a3 3 0 003 3h6a3 3 0 003-3V6a3 3 0 00-3-3m-6 0H6a3 3 0 00-3 3v12a3 3 0 003 3h3M6 16h12M9 12h6"
            />
          </svg>
        );
      case "washed-ironed":
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        );
      case "washed-ironed-folded":
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
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>Laundry Service | Home Services</title>
        <meta name="description" content="Book our laundry service" />
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
              Laundry Service
            </h1>
            <p className="text-sm text-gray-500 hidden md:block">
              Select how you want your laundry done
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
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
                  Choose Your Laundry Service
                </h2>
                <p className="text-sm text-gray-500">
                  Select the option that best suits your needs
                </p>
              </div>
            </div>

            {/* Laundry options */}
            <div className="space-y-3">
              {laundryOptions.map((option) => (
                <div
                  key={option.id}
                  className={`p-4 rounded-xl flex items-start border-2 transition-all duration-200 cursor-pointer ${
                    selectedOption?.id === option.id
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                  onClick={() => handleOptionSelect(option)}
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
                    <div className="flex items-center mb-1">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-2">
                        {getLaundryIcon(option.id)}
                      </div>
                      <span className="text-lg font-medium text-gray-900">
                        {option.title}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 ml-10">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add tip */}
            <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-start">
                <div className="mr-3 mt-1 text-blue-500">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-blue-800 font-medium">
                    Special care instructions?
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    You'll be able to add special instructions for your laundry
                    after selecting your service.
                  </p>
                </div>
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
              className={`w-full py-4 bg-purple-600 text-white rounded-xl text-lg font-medium shadow-lg hover:bg-purple-700 transition-all duration-300 ${
                !selectedOption ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!selectedOption}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
