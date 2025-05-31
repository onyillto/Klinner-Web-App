// pages/booking-confirmation.js
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Head from "next/head";
import Cookies from "js-cookie";

// Create a separate component that uses searchParams
// Replace your entire BookingVerification component with this enhanced version:

function BookingVerification({
  bookingData,
  setBookingData,
  setPaymentStatus,
  setLoading,
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log("🚀 BookingVerification useEffect triggered");
    console.log("📦 bookingData exists:", !!bookingData);
    console.log("🔍 searchParams:", Object.fromEntries(searchParams.entries()));
    
    const verifyPayment = async () => {
      try {
        console.log("🔍 Starting payment verification...");
        
        // Check if we have a reference from Paystack redirect
        const reference = searchParams.get("reference");
        const trxref = searchParams.get("trxref");
        
        console.log("📄 URL parameters:", { reference, trxref });

        // If no reference in URL but booking shows paid, assume it's already verified
        if (!reference && !trxref) {
          console.log("❌ No payment reference found in URL");
          setPaymentStatus(
            bookingData?.paymentStatus === "paid" ? "success" : "pending"
          );
          setLoading(false);
          return;
        }

        const paymentRef = reference || trxref;
        console.log("✅ Using payment reference:", paymentRef);

        // Verify payment status with backend
        await verifyPaymentWithBackend(paymentRef, bookingData);
      } catch (error) {
        console.error("💥 Error verifying payment:", error);
        setPaymentStatus("error");
        setLoading(false);
      }
    };

    if (bookingData) {
      console.log("✅ bookingData available, starting verification");
      verifyPayment();
    } else {
      console.log("⏳ Waiting for bookingData...");
    }
  }, [searchParams, bookingData, setPaymentStatus, setLoading]);

  const verifyPaymentWithBackend = async (reference, parsedBooking) => {
    try {
      const authToken = Cookies.get("auth_token");

      console.log("🔍 DEBUGGING PAYMENT VERIFICATION");
      console.log("📞 Calling backend with reference:", reference);
      console.log("🔑 Auth token exists:", !!authToken);
      console.log("🔑 Auth token preview:", authToken?.substring(0, 20) + "...");
      console.log("📦 Booking data:", parsedBooking);

      const requestUrl = `https://klinner.onrender.com/api/v1/service/verify-payment`;
      const requestBody = { reference };
      
      console.log("🌐 Request URL:", requestUrl);
      console.log("📤 Request body:", requestBody);

      const response = await fetch(requestUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      console.log("🌐 Response received!");
      console.log("📊 Response status:", response.status);
      console.log("✅ Response ok:", response.ok);
      console.log("🔗 Response URL:", response.url);

      let data;
      try {
        data = await response.json();
        console.log("📄 Response data:", data);
      } catch (parseError) {
        console.error("❌ Failed to parse JSON response:", parseError);
        const textResponse = await response.text();
        console.log("📄 Raw response text:", textResponse);
        throw new Error("Invalid JSON response from server");
      }

      if (response.ok && data.success) {
        console.log("✅ Payment verification successful!");
        
        // Update payment status
        const updatedBooking = {
          ...parsedBooking,
          paymentStatus: "paid",
          paymentReference: reference,
          verifiedAt: new Date().toISOString(),
        };

        console.log("💾 Updating localStorage with:", updatedBooking);
        localStorage.setItem("bookingData", JSON.stringify(updatedBooking));
        setBookingData(updatedBooking);
        setPaymentStatus("success");

        // Clear URL parameters
        if (typeof window !== "undefined") {
          console.log("🧹 Clearing URL parameters");
          window.history.replaceState({}, "", window.location.pathname);
        }
      } else {
        console.error("❌ Payment verification failed:");
        console.error("Response status:", response.status);
        console.error("Response data:", data);
        setPaymentStatus("failed");
      }
    } catch (error) {
      console.error("💥 Backend verification failed:");
      console.error("Error type:", error.constructor.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      setPaymentStatus("error");
      throw error;
    } finally {
      console.log("🏁 Setting loading to false");
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

  if (status === "failed") {
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
    default:
      return "Your booking has been received but payment status is pending.";
  }
}

export default function BookingConfirmation() {
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
          setLoading(false);
          return;
        }

        const parsedBooking = JSON.parse(confirmedBooking);
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