// pages/house-cleaning.js
"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import DateTimeSelector from "../../../components/DateTimeSelector";

export default function HouseCleaningPage() {
  const router = useRouter();
  const [items, setItems] = useState({
    "Living Room": 0,
    Terrace: 0,
    Bedroom: 0,
    Bathroom: 0,
    Kitchen: 0,
    Dining : 0,
    Garage: 0,
  });
  const [totalItems, setTotalItems] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isDateSelectorOpen, setIsDateSelectorOpen] = useState(false);

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

    handleResize(); // Check on initial load
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  const handleContinue = () => {
    // Save the selected items data to localStorage
    localStorage.setItem("cleaningItems", JSON.stringify(items));

    // Open the date selector modal instead of navigating
    setIsDateSelectorOpen(true);
  };

  // Get room icon based on room name
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
      case "Terrace":
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
      case "Dining Room":
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
              d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        );
      case "Garage":
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

  // Calculate estimated time based on total items
  const getEstimatedTime = () => {
    const baseTime = 60; // 60 minutes base time
    const timePerItem = 30; // 30 minutes per item
    const totalMinutes = baseTime + totalItems * timePerItem;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`;
  };

  return (
    <>
      <Head>
        <title>House Cleaning | Home Services</title>
        <meta name="description" content="Book our house cleaning service" />
      </Head>

      {/* Date selector modal */}
      <DateTimeSelector
        isOpen={isDateSelectorOpen}
        onClose={() => setIsDateSelectorOpen(false)}
        selectedItems={items}
      />

      <div className="min-h-screen bg-gray-50">
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
            <h1 className="text-2xl font-bold text-gray-900">House Cleaning</h1>
            <p className="text-sm text-gray-500 hidden md:block">
              Customize your cleaning service
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
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Customize Your Cleaning
                </h2>
                <p className="text-sm text-gray-500">
                  Select the areas you want cleaned
                </p>
              </div>
            </div>

            {/* Progress and time estimate */}
            <div className="flex justify-between items-center mb-6">
              <div className="w-2/3">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Cleaning Scope
                </p>
                <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 transition-all duration-300"
                    style={{ width: `${Math.min(totalItems * 10, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">Estimated time</p>
                <p className="text-lg font-semibold text-purple-600">
                  {getEstimatedTime()}
                </p>
              </div>
            </div>

            {/* Room selectors */}
            <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
              {Object.keys(items).map((item) => (
                <div
                  key={item}
                  className={`bg-white border-2 p-4 rounded-xl flex items-center justify-between transition-all duration-200 ${
                    items[item] > 0
                      ? "border-purple-400 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        items[item] > 0
                          ? "bg-purple-200 text-purple-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {getRoomIcon(item)}
                    </div>
                    <span className="text-base font-medium text-gray-900">
                      {item}
                    </span>
                  </div>
                  <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
                    <button
                      onClick={() => handleDecrement(item)}
                      className={`w-9 h-9 flex items-center justify-center rounded-l-lg ${
                        items[item] > 0
                          ? "text-purple-600 hover:bg-gray-100"
                          : "text-gray-300"
                      }`}
                      disabled={items[item] === 0}
                      aria-label={`Decrease ${item}`}
                    >
                      <span className="text-xl">−</span>
                    </button>
                    <span className="w-9 text-center font-semibold text-gray-900">
                      {items[item]}
                    </span>
                    <button
                      onClick={() => handleIncrement(item)}
                      className="w-9 h-9 flex items-center justify-center rounded-r-lg text-purple-600 hover:bg-gray-100"
                      aria-label={`Increase ${item}`}
                    >
                      <span className="text-xl">+</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Service features */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">
                Included in every cleaning:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Professional equipment & supplies",
                  "Trained and vetted cleaners",
                  "Thorough dusting & wiping",
                  "Floor cleaning & mopping",
                  "Bathroom cleaning & sanitizing",
                  "Kitchen cleaning & countertop cleaning",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
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
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6 mt-6 mb-6 sm:mt-4 sm:mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-medium text-gray-900">
                  Cleaning Summary
                </h3>
                <p className="text-sm text-gray-500">
                  {totalItems} {totalItems === 1 ? "area" : "areas"} selected
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Estimated time</p>
                <p className="text-lg font-semibold text-purple-600">
                  {getEstimatedTime()}
                </p>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-300"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
