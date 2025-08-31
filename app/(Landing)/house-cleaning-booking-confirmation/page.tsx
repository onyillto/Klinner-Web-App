// pages/house-cleaning-booking-confirmation.js
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Head from "next/head";
import Cookies from "js-cookie";

// Create a separate component that uses searchParams
function PaymentVerification({
  bookingData,
  setBookingData,
  setPaymentStatus,
  setLoading,
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Check if we have a reference from Paystack redirect
        const reference = searchParams.get("reference");

        console.log("Payment verification started");
        console.log("Reference from URL:", reference);
        console.log("Current booking data:", bookingData);

        // If no reference in URL but booking shows paid, assume it's already verified
        if (!reference) {
          setPaymentStatus(
            bookingData?.paymentStatus === "paid" ? "success" : "pending"
          );
          setLoading(false);
          return;
        }

        // Verify payment status with backend
        await verifyPaymentWithBackend(reference, bookingData);
      } catch (error) {
        console.error("Error verifying payment:", error);
        setPaymentStatus("error");
        setLoading(false);
      }
    };

    if (bookingData) {
      verifyPayment();
    }
  }, [searchParams, bookingData, setPaymentStatus, setLoading]);

  const verifyPaymentWithBackend = async (reference, parsedBooking) => {
    try {
      const authToken = Cookies.get("auth_token");

      console.log("Verifying payment with backend");
      console.log("Reference:", reference);
      console.log("Auth token exists:", !!authToken);

      if (!authToken) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        "https://klinner.onrender.com/api/v1/house-cleaning/verify-payment",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ reference }),
        }
      );

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Backend response:", data);

      if (response.ok && data.success) {
        console.log("Payment verification successful!");

        // Update booking data with verified payment status
        const updatedBooking = {
          ...parsedBooking,
          paymentStatus: "paid",
          paymentReference: reference,
          verifiedAt: new Date().toISOString(),
          // Update with any additional data from backend
          bookingDate:
            data.data?.booking_details?.date || parsedBooking.bookingDate,
          bookingTime:
            data.data?.booking_details?.time || parsedBooking.bookingTime,
          location:
            data.data?.booking_details?.location || parsedBooking.location,
          serviceCategory:
            data.data?.cleaning_category || parsedBooking.serviceCategory,
          id: data.data?.service_id || parsedBooking.id,
        };

        localStorage.setItem("bookingData", JSON.stringify(updatedBooking));
        setBookingData(updatedBooking);
        setPaymentStatus("success");

        // Clear URL parameters to clean up the URL
        if (typeof window !== "undefined") {
          window.history.replaceState({}, "", window.location.pathname);
        }
      } else {
        console.error("Payment verification failed:", data);
        setPaymentStatus("failed");
      }
    } catch (error) {
      console.error("Backend verification failed:", error);
      setPaymentStatus("error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return null; // This component just handles the effect, no rendering
}

// Component for loading screen
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-700">Verifying your payment...</p>
      </div>
    </div>
  );
}

// Component for no booking found
function NoBookingFound({ router }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
        <svg
          className="w-16 h-16 text-purple-500 mx-auto mb-4"
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
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          No Booking Found
        </h2>
        <p className="text-gray-600 mb-4">
          We couldn't find your house cleaning booking information. Let's start
          over.
        </p>
        <button
          onClick={() => router.push("/house-cleaning")}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          Book House Cleaning
        </button>
      </div>
    </div>
  );
}

// Component for status icon
function StatusIcon({ status }) {
  if (status === "success") {
    return (
      <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6">
        <svg
          className="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-6">
        <svg
          className="h-10 w-10"
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
      </div>
    );
  }

  return (
    <div className="w-20 h-20 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mx-auto mb-6">
      <svg
        className="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01M12 5a7 7 0 110 14 7 7 0 010-14z"
        />
      </svg>
    </div>
  );
}

// Component for cleaning service details
function CleaningServiceDetails({
  bookingData,
  paymentStatus,
  formatDate,
  formatTime,
}) {
  const getRoomCount = () => {
    if (!bookingData.cleaningData?.items) return 0;
    return Object.values(bookingData.cleaningData.items).reduce<number>(
      (sum, count) => sum + (typeof count === "number" ? count : 0),
      0
    );
  };

  const getSelectedRooms = () => {
    if (!bookingData.cleaningData?.items) return [];
    return Object.entries(bookingData.cleaningData.items)
      .filter(([_, count]) => typeof count === 'number' && count > 0)
      .map(([room, count]) => `${room} (${count})`)
      .join(", ");
  };

  return (
    <div className="bg-purple-50 rounded-lg p-6 text-left mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <svg
          className="h-6 w-6 text-purple-600 mr-2"
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
        House Cleaning Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Service Type:</span>
            <span className="font-medium text-gray-900">
              {bookingData.cleaningData?.category ||
                bookingData.serviceCategory ||
                "House Cleaning"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Package:</span>
            <span className="font-medium text-gray-900">
              {bookingData.cleaningData?.package || "Standard Package"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Home Size:</span>
            <span className="font-medium text-gray-900 capitalize">
              {bookingData.cleaningData?.homeSize || "Medium"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Frequency:</span>
            <span className="font-medium text-gray-900 capitalize">
              {bookingData.cleaningData?.frequency?.replace("-", " ") ||
                "One-time"}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Date & Time:</span>
            <span className="font-medium text-gray-900">
              {formatDate(bookingData.bookingDate)} at{" "}
              {formatTime(bookingData.bookingTime)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium text-gray-900">
              {bookingData.cleaningData?.estimatedTime ||
                bookingData.estimatedDuration ||
                "3-4 hours"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Rooms:</span>
            <span className="font-medium text-gray-900">
              {getRoomCount()} areas selected
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Status:</span>
            <span
              className={`font-medium ${
                paymentStatus === "success"
                  ? "text-green-600"
                  : paymentStatus === "failed"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {paymentStatus === "success"
                ? "Paid"
                : paymentStatus === "failed"
                ? "Failed"
                : "Pending"}
            </span>
          </div>
        </div>
      </div>

      {getSelectedRooms() && (
        <div className="mt-4 pt-4 border-t border-purple-200">
          <span className="text-gray-600 text-sm">Selected Areas:</span>
          <p className="font-medium text-gray-900 mt-1">{getSelectedRooms()}</p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-purple-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Service Address:</span>
          <span className="font-medium text-gray-900 text-right max-w-xs">
            {bookingData.location}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-purple-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-800 font-semibold">Booking ID:</span>
          <span className="font-medium text-purple-600">
            {bookingData.id ||
              `#CL${Math.floor(Math.random() * 900000) + 100000}`}
          </span>
        </div>
        {bookingData.paymentReference && (
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">Payment Reference:</span>
            <span className="font-medium text-gray-900">
              {bookingData.paymentReference}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center mt-2">
          <span className="text-lg font-semibold text-gray-900">
            Total Paid:
          </span>
          <span className="text-xl font-bold text-purple-600">
            ₦
            {(
              bookingData.totalPrice ||
              bookingData.serviceRate ||
              0
            ).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

// Component for action buttons
function ActionButtons({ paymentStatus, router }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {paymentStatus === "failed" && (
        <button
          onClick={() => router.push("/house-cleaning-booking-summary")}
          className="py-3 px-6 border border-purple-600 text-purple-600 rounded-xl text-lg font-medium hover:bg-purple-50 transition-colors"
        >
          Try Payment Again
        </button>
      )}
      <button
        onClick={() => router.push("/")}
        className="py-3 px-6 bg-purple-600 text-white rounded-xl text-lg font-medium shadow-lg hover:bg-purple-700 transition-colors"
      >
        Return to Home
      </button>
      {paymentStatus === "success" && (
        <button
          onClick={() => router.push("/my-bookings")}
          className="py-3 px-6 border border-purple-600 text-purple-600 rounded-xl text-lg font-medium hover:bg-purple-50 transition-colors"
        >
          View My Bookings
        </button>
      )}
    </div>
  );
}

// Helper functions
function getStatusTitle(status) {
  switch (status) {
    case "success":
      return "House Cleaning Booked!";
    case "failed":
      return "Payment Failed";
    case "error":
      return "Verification Error";
    default:
      return "Booking Status Pending";
  }
}

function getStatusMessage(status) {
  switch (status) {
    case "success":
      return "Your house cleaning service has been successfully booked and paid for. Our team will contact you before the scheduled date.";
    case "failed":
      return "We couldn't complete your payment. Please try again or contact support if the issue persists.";
    case "error":
      return "There was an error verifying your payment. Please contact support for assistance.";
    default:
      return "Your house cleaning booking has been received but payment status is still being verified.";
  }
}

export default function HouseCleaningBookingConfirmation() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("checking");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load booking data from localStorage
    const loadBookingData = () => {
      try {
        const confirmedBooking = localStorage.getItem("bookingData");
        if (!confirmedBooking) {
          console.log("No booking data found in localStorage");
          setLoading(false);
          return;
        }

        const parsedBooking = JSON.parse(confirmedBooking);
        console.log("Loaded booking data:", parsedBooking);
        setBookingData(parsedBooking);
      } catch (error) {
        console.error("Error loading booking data:", error);
        setLoading(false);
      }
    };

    loadBookingData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";

    // Handle different time formats
    if (timeString.includes(":")) {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours, 10);
      const mins = minutes || "00";

      if (hour === 0) return `12:${mins} AM`;
      if (hour < 12) return `${hour}:${mins} AM`;
      if (hour === 12) return `12:${mins} PM`;
      return `${hour - 12}:${mins} PM`;
    }

    return timeString; // Return as-is if not in expected format
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!bookingData) {
    return <NoBookingFound router={router} />;
  }

  return (
    <>
      <Head>
        <title>House Cleaning Booking Confirmation | Home Services</title>
        <meta
          name="description"
          content="Your house cleaning booking confirmation"
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Top service info banner */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white p-3 text-center">
          <p className="text-sm">Professional House Cleaning Services</p>
        </div>

        <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center mt-8">
            <StatusIcon status={paymentStatus} />

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {getStatusTitle(paymentStatus)}
            </h1>
            <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
              {getStatusMessage(paymentStatus)}
            </p>

            <CleaningServiceDetails
              bookingData={bookingData}
              paymentStatus={paymentStatus}
              formatDate={formatDate}
              formatTime={formatTime}
            />

            {paymentStatus === "success" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 font-medium">What happens next?</p>
                <p className="text-green-700 text-sm mt-1">
                  Our cleaning team will contact you 1-2 hours before your
                  scheduled appointment to confirm arrival time and any specific
                  requirements.
                </p>
              </div>
            )}

            <ActionButtons paymentStatus={paymentStatus} router={router} />
          </div>
        </div>

        {/* Wrap the component that uses searchParams in Suspense */}
        <Suspense fallback={null}>
          <PaymentVerification
            bookingData={bookingData}
            setBookingData={setBookingData}
            setPaymentStatus={setPaymentStatus}
            setLoading={setLoading}
          />
        </Suspense>
      </div>
    </>
  );
}
