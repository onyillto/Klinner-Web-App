"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

// Component for loading screen
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-700">Loading your booking details...</p>
      </div>
    </div>
  );
}

// Component for no booking found
function NoBookingFound({ router }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-6 bg-white rounded-lg shadow-md">
        <svg
          className="w-16 h-16 text-red-500 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          No Booking Data Found
        </h2>
        <p className="text-gray-600 mb-4">
          We couldn't find your booking information. Let's start over.
        </p>
        <button
          onClick={() => router.push("/house-cleaning")}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Start New Booking
        </button>
      </div>
    </div>
  );
}

// Component for status icon
function StatusIcon({ confirmed, paymentStatus }) {
  if (confirmed === true) {
    return (
      <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
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

  if (paymentStatus === "failed") {
    return (
      <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
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

  // Default for pending or other statuses
  return (
    <div className="w-20 h-20 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mx-auto mb-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
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

// Component for booking details
function BookingDetails({ bookingData, formatDate, formatTime }) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 text-left mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Booking Details
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Service:</span>
          <span className="font-medium text-gray-900">
            {bookingData.serviceCategory || bookingData.serviceName}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Date & Time:</span>
          <span className="font-medium text-gray-900">
            {formatDate(bookingData.bookingDate)} at{" "}
            {formatTime(bookingData.bookingTime)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Areas:</span>
          <span className="font-medium text-gray-900">
            {bookingData.areas?.length || 0} areas
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Location:</span>
          <span className="font-medium text-gray-900">
            {bookingData.location}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Booking Status:</span>
          <span
            className={`font-medium ${
              bookingData.confirmed === true
                ? "text-green-600"
                : "text-yellow-600"
            }`}
          >
            {bookingData.confirmed === true
              ? "Confirmed ✓"
              : "Pending Confirmation"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Payment Status:</span>
          <span
            className={`font-medium ${
              bookingData.paymentStatus === "paid"
                ? "text-green-600"
                : bookingData.paymentStatus === "failed"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {bookingData.paymentStatus === "paid"
              ? "Paid ✓"
              : bookingData.paymentStatus === "failed"
              ? "Failed"
              : "Pending"}
          </span>
        </div>
        <div className="flex justify-between pt-2 border-t">
          <span className="text-gray-800 font-semibold">Booking ID:</span>
          <span className="font-medium text-purple-600">
            {bookingData.id ||
              `#BK${Math.floor(Math.random() * 900000) + 100000}`}
          </span>
        </div>
        {bookingData.paymentReference && (
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Reference:</span>
            <span className="font-medium text-gray-900">
              {bookingData.paymentReference}
            </span>
          </div>
        )}
        {bookingData.totalAmount && (
          <div className="flex justify-between pt-2 border-t">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-medium text-gray-900">
              ₦{bookingData.totalAmount?.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Component for action buttons
function ActionButtons({ confirmed, paymentStatus, router }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {paymentStatus === "failed" && (
        <button
          onClick={() => router.push("/booking-summary")}
          className="py-3 px-6 border border-purple-600 text-purple-600 rounded-xl text-lg font-medium hover:bg-purple-50 transition-colors"
        >
          Try Again
        </button>
      )}
      <button
        onClick={() => router.push("/")}
        className="py-3 px-6 bg-purple-600 text-white rounded-xl text-lg font-medium shadow-lg hover:bg-purple-700 transition-colors"
      >
        Return to Home
      </button>
      {confirmed === true && (
        <button
          onClick={() => router.push("/bookings")}
          className="py-3 px-6 border border-purple-600 text-purple-600 rounded-xl text-lg font-medium hover:bg-purple-50 transition-colors"
        >
          View My Bookings
        </button>
      )}
    </div>
  );
}

// Helper functions
function getStatusTitle(confirmed, paymentStatus) {
  if (confirmed === true) {
    return "Booking Confirmed!";
  }
  if (paymentStatus === "failed") {
    return "Payment Failed";
  }
  return "Booking Pending Confirmation";
}

function getStatusMessage(confirmed, paymentStatus) {
  if (confirmed === true) {
    return "Your cleaning service has been successfully booked and confirmed";
  }
  if (paymentStatus === "failed") {
    return "We couldn't complete your payment. Please try again.";
  }
  return "Your booking has been received and is pending confirmation.";
}

export default function BookingConfirmation() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load booking data from localStorage
    const loadBookingData = () => {
      try {
        console.log("🔍 Loading booking data from localStorage...");

        const confirmedBooking = localStorage.getItem("bookingData");
        if (!confirmedBooking) {
          console.log("❌ No booking data found in localStorage");
          setLoading(false);
          return;
        }

        const parsedBooking = JSON.parse(confirmedBooking);
        console.log("✅ Booking data loaded:", parsedBooking);

        setBookingData(parsedBooking);
        setLoading(false);
      } catch (error) {
        console.error("💥 Error loading booking data:", error);
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

    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);

    if (hour === 0) return "12:00 AM";
    if (hour < 12) return `${hour}:${minutes} AM`;
    if (hour === 12) return `12:${minutes} PM`;
    return `${hour - 12}:${minutes} PM`;
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!bookingData) {
    return <NoBookingFound router={router} />;
  }

  const paymentStatus = bookingData.paymentStatus;
  const confirmed = bookingData.confirmed;

  return (
    <>
      <Head>
        <title>Booking Confirmation | Klinner</title>
        <meta name="description" content="Your booking confirmation details" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Top service info banner */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white p-3 text-center">
          <p className="text-sm">Professional Cleaning Services</p>
        </div>

        <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center mt-12">
            <StatusIcon confirmed={confirmed} paymentStatus={paymentStatus} />

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {getStatusTitle(confirmed, paymentStatus)}
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              {getStatusMessage(confirmed, paymentStatus)}
            </p>

            <BookingDetails
              bookingData={bookingData}
              formatDate={formatDate}
              formatTime={formatTime}
            />

            <ActionButtons
              confirmed={confirmed}
              paymentStatus={paymentStatus}
              router={router}
            />

            {/* Additional info for confirmed bookings */}
            {confirmed === true && (
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-sm">
                  📧 Check your email for booking confirmation and cleaner
                  details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
