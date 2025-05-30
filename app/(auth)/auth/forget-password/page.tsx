"use client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthService from "../../../../services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState("");
  const router = useRouter();

  const images = ["/hero-slid.png", "/hero-slide.png", "/hero-slidee.png"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError("");

    try {
      const response = await AuthService.forgotPassword(email);

      if (response.success) {
        // If successful, open the success modal
        setIsModalOpen(true);

        // Store email in localStorage for OTP verification page
        if (typeof window !== "undefined") {
          localStorage.setItem("verification_email", email);
        }
      } else {
        setError(
          response.error ||
            response.message ||
            "Failed to send reset link. Please try again."
        );
      }
    } catch (error) {
      console.error("Error sending reset link:", error);
      setError(
        error.message || "An error occurred while sending the reset link."
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push("/auth/verify-pin");
  };

  return (
    <div className="flex h-screen w-screen">
      <div
        className="hidden lg:flex w-1/2 h-screen bg-cover bg-center items-end justify-center relative transition-all duration-1000"
        style={{ backgroundImage: `url('${images[currentSlide]}')` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-6">
          <div className="flex justify-center mb-6">
            <img src="/klin-logo.png" alt="Logo" className="w-20 h-20" />
          </div>

          <h1 className="text-2xl font-bold mb-4 text-center text-[#1E1E1E]">
            Forgot Password
          </h1>
          <p className="text-base text-center mb-4 text-[#373737B2]">
            Enter your email address to receive a password reset code
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSendResetLink}>
            <div className="mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSending}
                className="w-full px-4 py-2 border-2 text-black rounded-lg focus:border-blue-500 focus:ring-blue-500 outline-none"
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#3310C2] border border-[#3310C2] text-lg text-[#ffff] py-2 rounded-lg mx-auto block mb-4 flex items-center justify-center"
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Code"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link
              href="/auth/sigin"
              className="text-[#00438F] text-sm hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <div className="mb-4 text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-green-500"
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
            <h2 className="text-xl font-bold text-[#1E1E1E]">
              Password Reset Code Sent!
            </h2>
            <p className="text-[#373737B2] mt-2">
              We've sent a verification code to <strong>{email}</strong>. Please
              check your email.
            </p>
            <button
              onClick={handleCloseModal}
              className="mt-4 px-4 py-2 bg-[#3310C2] text-white rounded-lg hover:bg-[#3310C2]/90 transition"
            >
              Verify Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
