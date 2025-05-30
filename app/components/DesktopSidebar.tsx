// File: components/DesktopSidebar.js
"use client"
import { useState } from "react";

export default function DesktopSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Desktop version - visible only on large screens */}
      <div className="hidden lg:block col-span-3 bg-white rounded-lg shadow-sm p-6 h-fit">
        <div className="mb-6">
          <h3 className="font-bold text-indigo-600 text-lg mb-4">
            My Schedule
          </h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-indigo-50 rounded-lg">
              <div className="w-2 h-10 bg-indigo-600 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-indigo-600">Standard Cleaning</p>
                <p className="text-sm text-gray-500">Today, 2:00 PM</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-10 bg-gray-400 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-indigo-600">Laundry Service</p>
                <p className="text-sm text-gray-500">Tomorrow, 10:00 AM</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg text-indigo-600 mb-4">Promotions</h3>
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-lg">
            <p className="font-bold mb-1">Weekend Special</p>
            <p className="text-sm mb-3">
              Book any service on weekend and get 15% discount
            </p>
            <button className="bg-white text-indigo-600 text-sm py-1 px-4 rounded-full font-medium">
              Claim Now
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown version - visible only on small/medium screens */}
      <div className="lg:hidden px-4 mb-6">
        <button
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
        >
          <span className="font-bold text-indigo-600">
            My Schedule & Promotions
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-indigo-600 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        {/* Dropdown content */}
        <div
          className={`mt-2 bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {isOpen && (
            <div className="p-4">
              <div className="mb-6">
                <h3 className="font-bold text-indigo-600 text-lg mb-4">
                  My Schedule
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-indigo-50 rounded-lg">
                    <div className="w-2 h-10 bg-indigo-600 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium text-indigo-600">
                        Standard Cleaning
                      </p>
                      <p className="text-sm text-gray-500">Today, 2:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-10 bg-gray-400 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium text-indigo-600">
                        Laundry Service
                      </p>
                      <p className="text-sm text-gray-500">
                        Tomorrow, 10:00 AM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg text-indigo-600 mb-4">
                  Promotions
                </h3>
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-lg">
                  <p className="font-bold mb-1">Weekend Special</p>
                  <p className="text-sm mb-3">
                    Book any service on weekend and get 15% discount
                  </p>
                  <button className="bg-white text-indigo-600 text-sm py-1 px-4 rounded-full font-medium">
                    Claim Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
