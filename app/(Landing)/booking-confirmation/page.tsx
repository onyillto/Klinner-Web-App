// pages/booking-confirmation.js
"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Head from "next/head";
import Cookies from "js-cookie";

// Create a separate component that uses searchParams
function BookingVerification({
  bookingData,
  setBookingData,
  setPaymentStatus,
  setLoading,
}) {
  const searchParams = useSearchParams();
  const hasVerified = useRef(false); // Prevent multiple verification attempts
  const isVerifying = useRef(false); // Prevent concurrent verifications

  useEffect(() => {
    const verifyPayment = async () => {
      // Prevent multiple simultaneous verifications
      if (hasVerified.current || isVerifying.current || !bookingData) {
        return;
      }

      try {
        isVerifying.current = true;

        // Check if we have a reference from Paystack redirect
        const reference = searchParams.get("reference");
        const trxref = searchParams.get("trxref");

        console.log("Payment verification started:", { reference, trxref });

        // If no reference in URL, check existing booking status
        if (!reference && !trxref) {
          console.log("No payment reference found, checking existing status");
          setPaymentStatus(
            bookingData.paymentStatus === "paid" ? "success" : "pending"
          );
          setLoading(false);
          hasVerified.current = true;
          return;
        }

        // Use reference or trxref for verification
        const paymentRef = reference || trxref;

        if (paymentRef) {
          await verifyPaymentWithBackend(paymentRef, bookingData);
          hasVerified.current = true;
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setPaymentStatus("error");
        setLoading(false);
        hasVerified.current = true;
      } finally {
        isVerifying.current = false;
      }
    };

    // Small delay to ensure state is properly set
    const timeoutId = setTimeout(verifyPayment, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [bookingData]); // Remove searchParams dependency to prevent infinite loops

  const verifyPaymentWithBackend = async (reference, parsedBooking) => {
    try {
      const authToken = Cookies.get("auth_token");

      console.log("Verifying payment with backend:", reference);

      const response = await fetch(
        `https://klinner.onrender.com/api/v1/payments/verify`,
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

      const data = await response.json();
      console.log("Backend verification response:", data);

      if (response.ok && data.success) {
        // Update payment status
        const updatedBooking = {
          ...parsedBooking,
          paymentStatus: "paid",
          paymentReference: reference,
        };

        localStorage.setItem("bookingData", JSON.stringify(updatedBooking));
        setBookingData(updatedBooking);
        setPaymentStatus("success");

        // Clear URL parameters after successful verification
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
        <p className="text-sm text-gray-500 mt-2">
          Please do not refresh this page
        </p>
      </div>
    </div>
  );
}

// Component for error state
function ErrorScreen({ error, router }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
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
          Payment Verification Error
        </h2>
        <p className="text-gray-600 mb-4">
          {error || "Something went wrong while verifying your payment."}
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/house-cleaning")}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Start New Booking
          </button>
        </div>
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
function StatusIcon({ status }) {
  if (status === "success") {
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

  if (status === "failed" || status === "error") {
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
function BookingDetails({
  bookingData,
  paymentStatus,
  formatDate,
  formatTime,
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 text-left mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Booking Details
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Service:</span>
          <span className="font-medium text-gray-900">
            {bookingData.serviceCategory}
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
          <span className="text-gray-600">Payment Status:</span>
          <span
            className={`font-medium ${
              paymentStatus === "success"
                ? "text-green-600"
                : paymentStatus === "failed" || paymentStatus === "error"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {paymentStatus === "success"
              ? "Paid"
              : paymentStatus === "failed"
              ? "Failed"
              : paymentStatus === "error"
              ? "Error"
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
            <span className="font-medium text-gray-900 text-sm">
              {bookingData.paymentReference}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Component for action buttons
function ActionButtons({ paymentStatus, router }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {(paymentStatus === "failed" || paymentStatus === "error") && (
        <button
          onClick={() => router.push("/booking-summary")}
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
function getStatusTitle(status) {
  switch (status) {
    case "success":
      return "Booking Confirmed!";
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
      return "Your cleaning service has been successfully booked and paid for";
    case "failed":
      return "We couldn't complete your payment. Please try again.";
    case "error":
      return "There was an error verifying your payment. Please contact support.";
    default:
      return "Your booking has been received but payment status is pending.";
  }
}

export default function BookingConfirmation() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("checking");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasLoaded = useRef(false);

  useEffect(() => {
    // Prevent multiple loads
    if (hasLoaded.current) return;

    // Load booking data from localStorage
    const loadBookingData = () => {
      try {
        const confirmedBooking = localStorage.getItem("bookingData");
        if (!confirmedBooking) {
          setLoading(false);
          hasLoaded.current = true;
          return;
        }

        const parsedBooking = JSON.parse(confirmedBooking);
        console.log("Loaded booking data:", parsedBooking);
        setBookingData(parsedBooking);
        hasLoaded.current = true;
      } catch (error) {
        console.error("Error loading booking data:", error);
        setError("Failed to load booking data");
        setLoading(false);
        hasLoaded.current = true;
      }
    };

    loadBookingData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";

    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours, 10);

      if (hour === 0) return "12:00 AM";
      if (hour < 12) return `${hour}:${minutes} AM`;
      if (hour === 12) return `12:${minutes} PM`;
      return `${hour - 12}:${minutes} PM`;
    } catch (error) {
      console.error("Error formatting time:", error);
      return timeString;
    }
  };

  // Error boundary
  if (error) {
    return <ErrorScreen error={error} router={router} />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (!bookingData) {
    return <NoBookingFound router={router} />;
  }

  return (
    <>
      <Head>
        <title>Booking Confirmation | Home Services</title>
        <meta name="description" content="Your booking status" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Top service info banner */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white p-3 text-center">
          <p className="text-sm">Professional Cleaning Services</p>
        </div>

        <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center mt-12">
            <StatusIcon status={paymentStatus} />

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {getStatusTitle(paymentStatus)}
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              {getStatusMessage(paymentStatus)}
            </p>

            <BookingDetails
              bookingData={bookingData}
              paymentStatus={paymentStatus}
              formatDate={formatDate}
              formatTime={formatTime}
            />

            <ActionButtons paymentStatus={paymentStatus} router={router} />
          </div>
        </div>

        {/* Wrap the component that uses searchParams in Suspense */}
        <Suspense fallback={null}>
          <BookingVerification
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
