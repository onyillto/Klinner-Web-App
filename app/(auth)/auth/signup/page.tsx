"use client";

import { useState, useEffect } from "react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import AuthService from "../../../../services/authService";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const router = useRouter();

  const images = ["/hero-slid.png", "/hero-slide.png", "/hero-slidee.png"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!agreeTerms) {
      toast.error("You must agree to Terms of Service and Privacy Policy");
      return;
    }

    setIsLoading(true);

    try {
      const response = await AuthService.register({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.success) {
        // Store email in localStorage for OTP verification
        if (typeof window !== "undefined") {
          localStorage.setItem("verification_email", formData.email);
        }

        toast.success(
          "Account created successfully! Please verify your email.",
          {
            duration: 4000,
          }
        );

        router.push("/auth/verify-otp");
      } else {
        const errorMessage =
          response.error ||
          response.message ||
          "Registration failed. Please try again.";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error.message ||
        "An error occurred during registration. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex h-[100vh] w-screen">
      {/* Left Side - Image Slider */}
      <div
        className="hidden lg:flex w-1/2 h-screen bg-cover bg-center items-end justify-center relative transition-all duration-1000"
        style={{ backgroundImage: `url('${images[currentSlide]}')` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
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
                className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white" : "bg-[#787878]"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-4 sm:p-6">
          <div className="flex justify-center mb-4 sm:mb-6">
            <img
              src="/klin-logo.png"
              alt="Logo"
              className="w-16 h-16 sm:w-24 sm:h-24"
            />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-[#1E1E1E]">
            Create Your Account
          </h1>
          <p className="text-sm sm:text-base text-center mb-4 text-[#373737B2]">
            Sign up with Facebook or Google to get started
          </p>

          <div className="space-y-2">
            <button
              className="w-[90%] max-w-[440px] sm:w-[80%] md:w-[440px] h-12 sm:h-[52px] bg-white py-1 sm:py-2 rounded flex items-center justify-center mx-auto"
              style={{ border: "1px solid black" }}
              disabled={isLoading}
              onClick={() => toast.error("Social login coming soon!")}
            >
              <FaFacebook className="mr-2" style={{ color: "#1877F2" }} />
              <span className="text-[#1E1E1EB2]">Sign up with Facebook</span>
            </button>

            <button
              className="w-[90%] max-w-[440px] sm:w-[80%] md:w-[440px] h-12 sm:h-[52px] bg-white py-1 sm:py-2 rounded flex items-center justify-center mx-auto"
              style={{ border: "1px solid black" }}
              disabled={isLoading}
              onClick={() => toast.error("Social login coming soon!")}
            >
              <FaGoogle className="mr-2" style={{ color: "#DB4437" }} />
              <span className="text-[#1E1E1EB2]">Sign up with Google</span>
            </button>
          </div>

          <div className="flex items-center justify-center space-x-2 sm:space-x-4 my-4">
            <div className="w-16 sm:w-[108px] border-t border-black"></div>
            <p className="text-sm sm:text-base text-center text-[#373737]">
              Or create account with email
            </p>
            <div className="w-16 sm:w-[108px] border-t border-black"></div>
          </div>

          <form onSubmit={handleSignUp}>
            <div className="space-y-3 sm:space-y-4">
              {/* Email Field */}
              <div className="relative w-[90%] max-w-[440px] sm:w-full mx-auto">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 pr-10 text-sm sm:text-base text-black border border-gray-300 rounded-lg focus:border-blue-500 outline-none placeholder-black"
                  placeholder="Email"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div className="relative w-[90%] max-w-[440px] sm:w-full mx-auto">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-2 pr-10 text-sm sm:text-base text-black border border-gray-300 rounded-lg focus:border-blue-500 outline-none placeholder-black"
                  placeholder="Password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="text-gray-500 w-5 h-5" />
                  ) : (
                    <Eye className="text-gray-500 w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Confirm Password Field */}
              <div className="relative w-[90%] max-w-[440px] sm:w-full mx-auto">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full p-2 pr-10 text-sm sm:text-base text-black border border-gray-300 rounded-lg focus:border-blue-500 outline-none placeholder-black"
                  placeholder="Confirm Password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="text-gray-500 w-5 h-5" />
                  ) : (
                    <Eye className="text-gray-500 w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center mb-3 sm:mb-4 w-[90%] max-w-[440px] sm:w-full mx-auto mt-4">
              <label className="flex items-center text-sm sm:text-base text-[#000000]">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  disabled={isLoading}
                />
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            <button
              type="submit"
              className="w-[90%] max-w-[440px] sm:w-full bg-[#3310C2] border border-[[#3310C2]] text-lg text-[#ffff] text-sm sm:text-[18px] py-2 rounded-lg mx-auto block flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-sm sm:text-base text-center mt-4 sm:mt-6 mb-3 sm:mb-4 font-semibold text-[#1E1E1E]">
            Already have an account?{" "}
            <Link href="/auth/sigin" className="text-blue-500">
              Login here
            </Link>
          </p>

          <div>
            <p className="text-xs sm:text-sm text-[#A9B4CD] w-[90%] max-w-[440px] sm:w-full mx-auto">
              By continuing, you agree to NGservice{" "}
              <span className="text-[#000000] font-medium">Term of Use</span>{" "}
              and confirm that you have read{" "}
              <span className="text-[#000000] font-medium">Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
