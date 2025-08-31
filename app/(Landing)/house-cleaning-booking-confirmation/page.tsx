"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

export default function PaymentVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("verifying"); // verifying, success, failed, error
  const [message, setMessage] = useState("Verifying your payment...");
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get reference from URL
        const reference = searchParams.get("reference");

        if (!reference) {
          setStatus("error");
          setMessage("No payment reference found");
          return;
        }

        // Get auth token
        const authToken = Cookies.get("auth_token");
        if (!authToken) {
          setStatus("error");
          setMessage("Authentication required. Please log in again.");
          return;
        }

        console.log("Verifying payment:", reference);

        // Make API call
        const response = await fetch(
          "https://klinner.onrender.com/api/v1/house-cleaning/verify-payment",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ reference }),
          }
        );

        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("HTTP Error:", response.status, errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (data.success) {
          // Payment verified successfully
          setStatus("success");
          setMessage("Payment verified successfully!");

          // Update localStorage with payment info
          const existingBooking = JSON.parse(
            localStorage.getItem("bookingData") || "{}"
          );
          const updatedBooking = {
            ...existingBooking,
            paymentStatus: "paid",
            paymentReference: reference,
            verifiedAt: new Date().toISOString(),
            // Add any data from API response
            ...data.data,
          };

          localStorage.setItem("bookingData", JSON.stringify(updatedBooking));
          setBookingData(updatedBooking);

          // Redirect to success page after 2 seconds
          setTimeout(() => {
            router.push("/booking-success");
          }, 2000);
        } else {
          // Payment verification failed
          setStatus("failed");
          setMessage(data.message || "Payment verification failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");

        // Show specific error messages
        if (error.message.includes("CORS")) {
          setMessage("CORS error - backend configuration issue");
        } else if (error.message.includes("fetch")) {
          setMessage("Network error - check your connection");
        } else if (error.message.includes("HTTP 401")) {
          setMessage("Authentication failed - please log in again");
        } else if (error.message.includes("HTTP 404")) {
          setMessage("API endpoint not found");
        } else {
          setMessage(`Error: ${error.message}`);
        }
      }
    };

    verifyPayment();
  }, [searchParams, router]);

<<<<<<< HEAD
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
=======
  const handleRetry = () => {
    router.push("/house-cleaning-booking-summary");
>>>>>>> main
  };

  const handleHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        {/* Status Icon */}
        {status === "verifying" && (
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        )}

        {status === "success" && (
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8"
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
        )}

        {(status === "failed" || status === "error") && (
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8"
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
        )}

        {/* Status Message */}
        <h2 className="text-xl font-bold mb-2">
          {status === "verifying" && "Verifying Payment"}
          {status === "success" && "Payment Successful!"}
          {status === "failed" && "Payment Failed"}
          {status === "error" && "Verification Error"}
        </h2>

        <p className="text-gray-600 mb-6">{message}</p>

        {/* Action Buttons */}
        <div className="space-y-3">
          {status === "success" && (
            <button
              onClick={() => router.push("/my-bookings")}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
            >
              View My Bookings
            </button>
          )}

          {(status === "failed" || status === "error") && (
            <button
              onClick={handleRetry}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
            >
              Try Again
            </button>
          )}

          <button
            onClick={handleHome}
            className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50"
          >
            Return to Home
          </button>
        </div>

        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-left">
            <strong>Debug Info:</strong>
            <br />
            Status: {status}
            <br />
            Reference: {searchParams.get("reference")}
            <br />
            Token exists: {!!Cookies.get("auth_token")}
          </div>
        )}
      </div>
    </div>
  );
}
