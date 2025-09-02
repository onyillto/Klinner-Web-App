"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";

interface IFormData {
  firstName: string;
  lastName: string;
  username: string;
  dateOfBirth: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  image: File | null;
}

export default function UserProfileForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [formData, setFormData] = useState<IFormData>({
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
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Nigerian states and cities lists
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

  const getAuthToken = () => {
    const token = Cookies.get("auth_token");
    return token;
  };

  const checkAuthentication = () => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Authentication token not found. Please login again.");
      router.push("/auth/signin");
      return false;
    }
    return true;
  };

  useEffect(() => {
    const userData = localStorage.getItem("user_data");

    if (userData) {
      try {
        const user = JSON.parse(userData);

        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          username: user.username || "",
          dateOfBirth: user.dateOfBirth || "",
          email: user.email || "",
          mobile: user.phone || user.mobile || "",
          address: user.address || "",
          city: user.city || "",
          state: user.state || "",
          image: null,
        });

        if (user.profileImage?.url) {
          setPreview(user.profileImage.url);
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, mobile: value });
    if (errors.mobile) {
      setErrors({ ...errors, mobile: "" });
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImageSave = async () => {
    if (!formData.image) {
      toast.error("Please select an image first");
      return;
    }
    if (!checkAuthentication()) return;

    setImageLoading(true);

    try {
      const authToken = getAuthToken();
      const imageFormData = new FormData();
      imageFormData.append("image", formData.image);

      const response = await axios.put(
        `${
          process.env.NEXT_PUBLIC_API_URL || "https://klinner.onrender.com"
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
        const currentUserData = JSON.parse(
          localStorage.getItem("user_data") || "{}"
        );
        const updatedUserData = {
          ...currentUserData,
          profileImage: response.data.data.profileImage,
        };
        localStorage.setItem("user_data", JSON.stringify(updatedUserData));
        const newImageUrl = response.data.data?.profileImage?.url;
        if (newImageUrl) {
          setPreview(newImageUrl);
        }
      } else {
        toast.error(response.data.message || "Failed to upload image");
      }
    } catch (err: any) {
      console.error("Error uploading image:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
        Cookies.remove("auth_token");
        router.push("/auth/signin");
      } else if (err.response?.status === 500) {
        toast.error("Server error. Please check your backend logs.");
      } else {
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Failed to upload image. Please try again."
        );
      }
    } finally {
      setImageLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate required fields
    const newErrors: { [key: string]: string } = {};
    const requiredFields = [
      "firstName",
      "lastName",
      "username",
      "mobile",
      "address",
      "city",
      "state",
    ] as const;
    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill all required fields");
      return;
    }

    if (!checkAuthentication()) return;

    setLoading(true);

    try {
      const authToken = getAuthToken();
      const dataToSend = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        mobile: formData.mobile,
        address: formData.address,
        city: formData.city,
        state: formData.state,
      };

      const response = await axios.post(
        `${
          process.env.NEXT_PUBLIC_API_URL || "https://klinner.onrender.com"
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
        const currentUserData = JSON.parse(
          localStorage.getItem("user_data") || "{}"
        );
        const updatedUserData = { ...currentUserData, ...response.data.data };
        localStorage.setItem("user_data", JSON.stringify(updatedUserData));
        router.push("/");
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (err: any) {
      console.error("Error updating profile:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
        Cookies.remove("auth_token");
        router.push("/auth/signin");
      } else {
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Failed to update profile. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

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
        <div className="flex flex-col items-center mb-6">
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

        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Complete Your Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
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
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
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
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
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
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              disabled={loading}
              className="w-full p-2 text-black border rounded-md focus:ring focus:ring-purple-300 disabled:opacity-50"
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              disabled={true}
              className="w-full text-black p-2 border rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <PhoneInput
              country={"ng"}
              value={formData.mobile}
              onChange={handlePhoneChange}
              disabled={loading}
              inputClass="!w-full !p-2 !border !rounded-md focus:ring focus:ring-purple-300 !text-black"
            />
            {errors.mobile && (
              <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
            )}
          </div>

          <div>
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
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

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
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
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
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
              )}
            </div>
          </div>

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
