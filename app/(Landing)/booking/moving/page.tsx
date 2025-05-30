// pages/move-out.js
"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MoveOutPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState({
    "Living Room": 0,
    Terrace: 0,
    Bedroom: 0,
    Bathroom: 0,
    Kitchen: 0,
    "Dining Room": 0,
    Garage: 0,
  });
  const [totalRooms, setTotalRooms] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

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

    handleResize(); // Check on initial load
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  const handleContinue = () => {
    // Save the selected rooms data to localStorage
    localStorage.setItem("moveOutRooms", JSON.stringify(rooms));

    // Navigate to the next step
    router.push("/booking-summary");
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

  return (
    <>
      <Head>
        <title>Move-out/in Package | Home Services</title>
        <meta
          name="description"
          content="Book our move-out/in cleaning service"
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
          <h1 className="text-2xl font-bold text-gray-900">
            Move-out/in Package
          </h1>
        </div>

        <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <p className="text-lg font-medium mb-2 text-gray-900">
              Enter the number of rooms to be cleared
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Select the quantity for each room type in your home.
            </p>

            {/* Progress indicator */}
            <div className="mb-6 bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 transition-all duration-300"
                style={{ width: `${Math.min(totalRooms * 10, 100)}%` }}
              ></div>
            </div>

            {/* Room selectors */}
            <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
              {Object.keys(rooms).map((room) => (
                <div
                  key={room}
                  className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between hover:border-purple-300 transition-all duration-200"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3 text-purple-600">
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
                          ? "text-purple-600 hover:bg-gray-100"
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
                      className="w-10 h-10 flex items-center justify-center rounded-r-lg text-purple-600 hover:bg-gray-100"
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
                <span className="font-semibold text-purple-600 text-xl">
                  {totalRooms}
                </span>
                <span className="ml-1 text-gray-700">rooms selected</span>
              </p>
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
                totalRooms === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={totalRooms === 0}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
