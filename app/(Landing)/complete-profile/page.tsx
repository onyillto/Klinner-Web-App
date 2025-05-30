"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";

export default function UserProfileForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    dateOfBirth: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [hasImageChanged, setHasImageChanged] = useState(false);

  // Nigerian states list
  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

  // Major Nigerian cities (you can expand this list)
  const nigerianCities = [
    "Lagos",
    "Abuja",
    "Kano",
    "Ibadan",
    "Port Harcourt",
    "Benin City",
    "Kaduna",
    "Jos",
    "Ilorin",
    "Aba",
    "Onitsha",
    "Warri",
    "Sokoto",
    "Calabar",
    "Uyo",
    "Akure",
    "Enugu",
    "Abeokuta",
    "Maiduguri",
    "Zaria",
    "Owerri",
    "Bauchi",
    "Gombe",
    "Yola",
    "Lokoja",
    "Lafia",
    "Osogbo",
    "Ado-Ekiti",
    "Awka",
    "Abakaliki",
    "Asaba",
    "Jalingo",
    "Gusau",
    "Damaturu",
    "Minna",
    "Birnin Kebbi",
    "Dutse",
    "Makurdi",
    "Yenagoa",
  ];

  // Helper function to get auth token from cookies
  const getAuthToken = () => {
    const token = Cookies.get("auth_token");
    console.log("Token from cookie:", token ? "Token found" : "No token");
    return token;
  };

  // Helper function to check authentication and redirect if needed
  const checkAuthentication = () => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Authentication token not found. Please login again.");
      router.push("/auth/signin");
      return false;
    }
    return true;
  };

  // Load existing user data from localStorage if available
  useEffect(() => {
    const userData = localStorage.getItem("user_data");
    console.log("Raw userData from localStorage:", userData); // Debug log

    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log("Parsed user data:", user); // Debug log

        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          username: user.username || "",
          dateOfBirth: user.dateOfBirth || "",
          email: user.email || "",
          mobile: user.phone || user.mobile || "", // Check both phone and mobile
          address: user.address || "",
          city: user.city || "",
          state: user.state || "",
          image: null,
        });

        console.log("Set form data with email:", user.email); // Debug log

        // Set preview if user has existing profile image
        if (user.profileImage?.url) {
          setPreview(user.profileImage.url);
          console.log("Set preview image:", user.profileImage.url); // Debug log
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    } else {
      console.log("No user data found in localStorage"); // Debug log
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, mobile: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file); // Debug log

    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      console.log("File validation passed, setting form data"); // Debug log
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
      setHasImageChanged(true);
    }
  };

  // Separate function to save image to /update-profile-image endpoint
  const handleImageSave = async () => {
    if (!formData.image) {
      toast.error("Please select an image first");
      return;
    }

    // Check authentication before proceeding
    if (!checkAuthentication()) {
      return;
    }

    setImageLoading(true);

    try {
      const authToken = getAuthToken();
      const imageFormData = new FormData();
      imageFormData.append("image", formData.image);

      // Debug logging
      console.log("Uploading image:", formData.image);
      console.log("FormData entries:", [...imageFormData.entries()]);

      const response = await axios.put(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"
        }/api/v1/user/update-profile-image`,
        imageFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile image uploaded successfully!");
        setHasImageChanged(false);

        // Update user data in localStorage with the new image
        const currentUserData = JSON.parse(
          localStorage.getItem("user_data") || "{}"
        );
        const updatedUserData = {
          ...currentUserData,
          profileImage: response.data.data.profileImage,
        };
        localStorage.setItem("user_data", JSON.stringify(updatedUserData));

        // Update preview with the new URL from server
        if (response.data.data.imageUrl) {
          setPreview(response.data.data.imageUrl);
        }
      } else {
        toast.error(response.data.message || "Failed to upload image");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      console.error("Error response:", err.response?.data);

      if (err.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
        Cookies.remove("auth_token"); // Remove invalid token from cookies
        router.push("/auth/signin");
      } else if (err.response?.status === 500) {
        toast.error("Server error. Please check your backend logs.");
      } else {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to upload image. Please try again.";
        toast.error(errorMessage);
      }
    } finally {
      setImageLoading(false);
    }
  };

  // Handle form submission for fill-data endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check authentication before proceeding
    if (!checkAuthentication()) {
      return;
    }

    setLoading(true);

    try {
      const authToken = getAuthToken();

      // Prepare JSON data for fill-data endpoint (POST /api/v1/user/fill-data)
      const dataToSend = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        mobile: formData.mobile,
        address: formData.address,
        city: formData.city,
        state: formData.state,
      };

      console.log("Sending fill-data:", dataToSend); // Debug log

      // Make the API request to fill-data endpoint using token-based authentication
      const response = await axios.post(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"
        }/api/v1/user/fill-data`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile data updated successfully!");

        // Update user data in localStorage with the new information
        const currentUserData = JSON.parse(
          localStorage.getItem("user_data") || "{}"
        );
        const updatedUserData = { ...currentUserData, ...response.data.data };
        localStorage.setItem("user_data", JSON.stringify(updatedUserData));

        // Redirect to dashboard
        router.push("/");
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      console.error("Error response:", err.response?.data);

      // Handle different error types
      if (err.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
        Cookies.remove("auth_token"); // Remove invalid token from cookies
        router.push("/auth/signin");
      } else {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to update profile. Please try again.";
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center mb-4">
          <label className="relative cursor-pointer">
            {preview ? (
              <Image
                src={preview}
                alt="Profile Preview"
                width={100}
                height={100}
                className="rounded-full object-cover w-24 h-24 border-2 border-gray-300"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400">
                <span className="text-4xl">👤</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={loading || imageLoading}
            />
            <div className="absolute bottom-0 right-0 bg-purple-600 text-white p-1 rounded-full">
              ✎
            </div>
          </label>
          <p className="text-xs text-gray-500 mt-2">Max size: 5MB</p>

          {/* Save Image Button - Always visible when image is selected */}
          {formData.image && (
            <button
              type="button"
              onClick={handleImageSave}
              disabled={imageLoading}
              className={`mt-2 px-4 py-1 text-sm rounded-md transition duration-200 ${
                imageLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {imageLoading ? "Uploading..." : "Save Image"}
            </button>
          )}
        </div>

        {/* Form Fields */}
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Complete Your Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="First Name"
              disabled={loading}
              className="w-full p-2 border text-black rounded-md focus:ring focus:ring-purple-300 disabled:opacity-50"
            />

            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder="Last Name"
              disabled={loading}
              className="w-full p-2 border text-black rounded-md focus:ring focus:ring-purple-300 disabled:opacity-50"
            />
          </div>

          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Username"
            disabled={loading}
            className="w-full p-2 border text-black rounded-md focus:ring focus:ring-purple-300 disabled:opacity-50"
          />

          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            disabled={loading}
            className="w-full p-2 text-black border rounded-md focus:ring focus:ring-purple-300 disabled:opacity-50"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            disabled={true} // Make email field uneditable
            className="w-full text-black p-2 border rounded-md bg-gray-100 cursor-not-allowed"
          />

          <PhoneInput
            country={"ng"}
            value={formData.mobile}
            onChange={handlePhoneChange}
            disabled={loading}
            inputClass="!w-full !p-2 !border !rounded-md focus:ring focus:ring-purple-300 !text-black"
          />

          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="Address"
            disabled={loading}
            className="w-full text-black p-2 border rounded-md focus:ring focus:ring-purple-300 disabled:opacity-50"
          />

          {/* City and State Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter your city"
                disabled={loading}
                list="cities-list"
                className="w-full p-2 text-black border rounded-md focus:ring focus:ring-purple-300 disabled:opacity-50"
              />
              <datalist id="cities-list">
                {nigerianCities.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>

            <div className="relative">
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                disabled={loading}
                className="w-full p-2 text-black border rounded-md focus:ring focus:ring-purple-300 disabled:opacity-50 appearance-none bg-white"
              >
                <option value="">Select State</option>
                {nigerianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Submit Button for Fill Data */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-purple-600 text-white text-lg py-2 rounded-md transition duration-200 ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-purple-700"
            }`}
          >
            {loading ? "Updating Profile..." : "Save Profile Data"}
          </button>
        </form>
      </div>
    </div>
  );
}
