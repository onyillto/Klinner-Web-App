// pages/repairs.js
"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";

export default function RepairsPage() {
  const router = useRouter();
  const [repairType, setRepairType] = useState(null);
  const [urgency, setUrgency] = useState(null);
  const [description, setDescription] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);

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

  const repairTypes = [
    {
      id: "plumbing",
      title: "Plumbing",
      description: "Leaks, blockages, toilet or sink issues",
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
            d="M12 8v13m0-13V6a2 2 0 112-2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
          />
        </svg>
      ),
    },
    {
      id: "electrical",
      title: "Electrical",
      description: "Power outages, light fixtures, outlet problems",
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
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      id: "appliance",
      title: "Appliance Repair",
      description: "Refrigerator, washing machine, oven issues",
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
            d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
          />
        </svg>
      ),
    },
    {
      id: "carpentry",
      title: "Carpentry",
      description: "Furniture assembly, door/window repairs, cabinetry",
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
            d="M10 9V6a3 3 0 013-3h.5a2 2 0 012 2v5M11 11V9a2 2 0 114 0v6M14 9V6a3 3 0 00-3-3h-.5a2 2 0 00-2 2v3M15.5 14.5L17 13M9 12L7.5 13.5m8-9l1.5-1.5M10 5.5L8.5 4"
          />
        </svg>
      ),
    },
    {
      id: "painting",
      title: "Painting",
      description: "Interior/exterior painting, touch-ups, wallpaper",
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
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      ),
    },
    {
      id: "general",
      title: "General Handyman",
      description: "TV mounting, small fixes, installations",
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
            d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
          />
        </svg>
      ),
    },
  ];

  const urgencyLevels = [
    {
      id: "standard",
      title: "Standard",
      description: "Within 2-3 days",
      price: "Standard Rate",
    },
    {
      id: "priority",
      title: "Priority",
      description: "Within 24 hours",
      price: "+₦2,000",
    },
    {
      id: "emergency",
      title: "Emergency",
      description: "Within 3-6 hours",
      price: "+₦5,000",
    },
  ];

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files as File[]);
    if (files.length > 0) {
      // In a real app, you would upload these to a server
      // For now, we'll just create local URLs
      const newPhotos = files.map((file) => ({
        id: Math.random().toString(36).substring(2, 11),
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file),
      }));

      setUploadedPhotos((prev) => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (photoId) => {
    setUploadedPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
  };

  const handleContinue = () => {
    if (repairType && urgency) {
      // Save the selected options to localStorage
      localStorage.setItem(
        "repairRequest",
        JSON.stringify({
          repairType,
          urgency,
          description,
          photosCount: uploadedPhotos.length,
        })
      );

      // Navigate to the next step
      router.push("/booking-summary");
    }
  };

  const isReadyToContinue = repairType && urgency;

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <>
      <Head>
        <title>Repair Services | Home Services</title>
        <meta
          name="description"
          content="Book our professional repair services"
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Top service info banner */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-3 text-center">
          <p className="text-sm">Professional Repair Services</p>
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
              Repair Services
            </h1>
            <p className="text-sm text-gray-500 hidden md:block">
              Request a repair specialist
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
          {/* Repair type selection */}
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Select Repair Type
                </h2>
                <p className="text-sm text-gray-500">
                  Choose the type of repair service you need
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {repairTypes.map((type) => (
                <div
                  key={type.id}
                  className={`p-4 rounded-xl flex items-start border-2 transition-all duration-200 cursor-pointer ${
                    repairType === type.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => setRepairType(type.id)}
                >
                  <div className="mr-4 mt-1">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        repairType === type.id
                          ? "border-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      {repairType === type.id && (
                        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <div
                        className={`w-8 h-8 rounded-full ${
                          repairType === type.id
                            ? "bg-blue-200 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        } flex items-center justify-center mr-2`}
                      >
                        {type.icon}
                      </div>
                      <span className="text-lg font-medium text-gray-900">
                        {type.title}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 ml-10">
                      {type.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Urgency selection */}
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  How Urgent Is Your Request?
                </h2>
                <p className="text-sm text-gray-500">
                  Select the required response time
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {urgencyLevels.map((level) => (
                <div
                  key={level.id}
                  className={`p-4 rounded-xl flex items-center justify-between border-2 transition-all duration-200 cursor-pointer ${
                    urgency === level.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => setUrgency(level.id)}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                        urgency === level.id
                          ? "border-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      {urgency === level.id && (
                        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                      )}
                    </div>
                    <div>
                      <span className="text-base font-medium text-gray-900">
                        {level.title}
                      </span>
                      <p className="text-sm text-gray-600">
                        {level.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-base font-medium text-blue-600">
                    {level.price}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description and photos */}
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Describe Your Issue
                </h2>
                <p className="text-sm text-gray-500">
                  Provide details to help our technicians prepare
                </p>
              </div>
            </div>

            {/* Description textarea */}
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Problem Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                placeholder="Please describe what needs to be repaired..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            {/* Photo upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Photos (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-all">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  id="photo-upload"
                  onChange={handlePhotoUpload}
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="mt-1 text-sm text-gray-600">
                    {uploadedPhotos.length > 0
                      ? "Click to add more photos"
                      : "Click to upload photos"}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </label>
              </div>

              {/* Photo preview */}
              {uploadedPhotos.length > 0 && (
                <div className="mt-4 space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">
                    Uploaded Photos
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {uploadedPhotos.map((photo) => (
                      <div key={photo.id} className="relative group">
                        <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={photo.url}
                            alt="Repair issue"
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <button
                          onClick={() => removePhoto(photo.id)}
                          className="absolute top-2 right-2 bg-gray-800 bg-opacity-75 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {photo.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatFileSize(photo.size)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Service guarantee */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-l-4 border-blue-500">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Our Repair Guarantee
            </h3>
            <div className="space-y-2">
              <div className="flex items-start">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <p className="text-sm text-gray-700">
                  All repair work comes with a 90-day warranty
                </p>
              </div>
              <div className="flex items-start">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <p className="text-sm text-gray-700">
                  Vetted, licensed, and experienced professionals
                </p>
              </div>
              <div className="flex items-start">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <p className="text-sm text-gray-700">
                  Fixed price quotes before work begins
                </p>
              </div>
              <div className="flex items-start">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <p className="text-sm text-gray-700">
                  100% satisfaction guarantee
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
              className={`w-full py-4 bg-blue-600 text-white rounded-xl text-lg font-medium shadow-lg hover:bg-blue-700 transition-all duration-300 ${
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
