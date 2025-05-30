"use client";

import { useState, useEffect, useRef, Ref } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import AuthService from "../../../../services/authService";

export default function VerifyPinPage() {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [email, setEmail] = useState("");
  const [timer, setTimer] = useState(300);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const images = ["/hero-slid.png", "/hero-slide.png", "/hero-slidee.png"];

  useEffect(() => {
    const storedEmail = localStorage.getItem("verification_email");
    if (storedEmail) setEmail(storedEmail);

    const imageInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 3000);

    const timerInterval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    if (inputRefs.current[0]) inputRefs.current[0].focus();

    return () => {
      clearInterval(imageInterval);
      clearInterval(timerInterval);
    };
  }, []);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
        router.push("/auth/change-password");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast, router]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handlePinChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      if (value && index < 3 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setPin(digits);
      if (inputRefs.current[3]) inputRefs.current[3].focus();
    }
  };

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email not found. Please go back and request a new PIN.");
      return;
    }

    const pinValue = pin.join("");
    if (pinValue.length !== 4) {
      setError("Please enter a valid 4-digit PIN.");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const response = await AuthService.verifyPasswordPin(email, pinValue);
      if (response.success) {
        setShowToast(true);
      } else {
        setError(
          response.error || response.message || "Invalid PIN. Please try again."
        );
      }
    } catch (err: any) {
      console.error("PIN verification error:", err);
      setError(err.message || "An error occurred during verification.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendPin = async () => {
    if (!email) {
      setError("Email not found. Please go back and request a new PIN.");
      return;
    }

    setIsResending(true);
    setError("");

    try {
      const response = await AuthService.forgotPassword(email);
      if (response.success) {
        setTimer(300);
        setPin(["", "", "", ""]);
        if (inputRefs.current[0]) inputRefs.current[0].focus();
      } else {
        setError(response.error || response.message || "Failed to resend PIN.");
      }
    } catch (err: any) {
      console.error("Error resending PIN:", err);
      setError(err.message || "An error occurred while resending the PIN.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Left - Image Slider */}
      <div
        className="hidden lg:flex w-1/2 h-screen bg-cover bg-center items-end justify-center relative"
        style={{ backgroundImage: `url('${images[currentSlide]}')` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-center text-white pb-10 px-6 w-full">
          <h2 className="text-xl lg:text-2xl font-bold mb-3">
            Impeccable Service
          </h2>
          <p className="text-sm lg:text-base opacity-80 mb-4">
            Klinners.co helps you tidy up your environment impeccably
          </p>
          <div className="flex justify-center space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full ${
                  index === currentSlide ? "bg-white" : "bg-[#787878]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right - PIN Form */}
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-6">
          <div className="flex justify-center mb-6">
            <img src="/klin-logo.png" alt="Logo" className="w-20 h-20" />
          </div>

          <h1 className="text-2xl font-bold mb-4 text-center text-[#1E1E1E]">
            Verify PIN
          </h1>

          {email && (
            <p className="text-base text-center mb-2 text-[#373737]">
              Enter the 4-digit PIN sent to{" "}
              <span className="font-medium">{email}</span>
            </p>
          )}

          <p className="text-sm text-center mb-6 text-[#373737B2]">
            PIN expires in{" "}
            <span className="font-medium text-[#3310C2]">
              {formatTime(timer)}
            </span>
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleVerifyPin} onPaste={handlePaste}>
            <div className="flex justify-center space-x-3 mb-6">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isVerifying || isResending}
                  className="w-14 h-14 text-center text-xl font-bold border-2 rounded-lg focus:border-[#3310C2] focus:ring-[#3310C2] outline-none text-black disabled:bg-gray-100"
                  required
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-[#3310C2] text-white py-3 rounded-lg mb-4 flex items-center justify-center disabled:bg-[#3310C2]/50"
              disabled={isVerifying || isResending}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify PIN"
              )}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={handleResendPin}
              disabled={timer > 0 || isVerifying || isResending}
              className={`text-sm font-medium ${
                timer > 0 || isVerifying || isResending
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#3310C2]"
              }`}
            >
              Resend PIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
