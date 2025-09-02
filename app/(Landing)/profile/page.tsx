"use client";
import React, { useState, useEffect } from "react";
import BottomNavigation from "../../components/BottomNavigation";
import { useAuth } from "../../../context/AuthContext";
import { httpClient } from "../../../utils/httpClient";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

const UserProfile = () => {
  const { user, refreshUserData } = useAuth();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [editingSections, setEditingSections] = useState({
    name: false,
    email: false,
    phone: false,
    address: false,
    city: false,
    state: false,
  });

  const fetchUserInfo = async () => {
    try {
      setIsLoading(true);
      const timestamp = Date.now();
      const response = await httpClient.get(
        `/api/v1/user/user-info?_t=${timestamp}`,
        {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Authorization: `Bearer ${Cookies.get("auth_token")}`,
          },
        }
      );
      if (response.data.success) {
        setUserInfo(response.data.data);
        updateProfileDataFromUserInfo(response.data.data);
      } else {
        toast.error("Failed to fetch user information");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      toast.error("Error loading profile information");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfileDataFromUserInfo = (userData) => {
    if (userData) {
      const newProfileData = {
        name:
          userData.firstName && userData.lastName
            ? `${userData.firstName} ${userData.lastName}`
            : userData.username || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        city: userData.city || "",
        state: userData.state || "",
      };
      setProfileData(newProfileData);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    console.log("profileData:", profileData);
    console.log("userInfo:", userInfo);
    if (userInfo) {
      console.log("profileImage object:", userInfo.profileImage);
      console.log("Image URL:", userInfo.profileImage?.url);
    }
  }, [profileData, userInfo]);

  useEffect(() => {
    if (user && !userInfo) {
      updateProfileDataFromUserInfo(user);
    }
  }, [user, userInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const toggleEdit = (section) => {
    setEditingSections({
      ...editingSections,
      [section]: !editingSections[section],
    });
  };

  const saveSection = async (section) => {
    try {
      setIsLoading(true);
      const updateData = {
        firstName: profileData.name.split(" ")[0] || "",
        lastName: profileData.name.split(" ").slice(1).join(" ") || "",
        username: userInfo?.username || "",
        mobile: profileData.phone,
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
      };
      const response = await httpClient.post(
        "/api/v1/user/fill-data",
        updateData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("auth_token")}`,
          },
        }
      );
      if (response.data.success) {
        toast.success(
          `${
            section.charAt(0).toUpperCase() + section.slice(1)
          } updated successfully!`
        );
        setEditingSections({ ...editingSections, [section]: false });
        await refreshUserData();
        await fetchUserInfo();
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = (section) => {
    updateProfileDataFromUserInfo(userInfo);
    setEditingSections({ ...editingSections, [section]: false });
  };

  const handleImageUpload = async (file) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("user_id", userInfo?.user_id);
      const response = await httpClient.put(
        "/api/v1/user/update-profile-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Cookies.get("auth_token")}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Profile image updated successfully!");
        await fetchUserInfo();
      } else {
        toast.error(response.data.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageDelete = async () => {
    try {
      setIsLoading(true);
      const response = await httpClient.delete(
        "/api/v1/user/delete-profile-image",
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("auth_token")}`,
          },
          data: { user_id: userInfo?.user_id },
        }
      );
      if (response.data.success) {
        toast.success("Profile image deleted successfully!");
        await fetchUserInfo();
      } else {
        toast.error(response.data.message || "Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !userInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  const renderEditableField = (section, value, placeholder, type = "text") => {
    const isEditing = editingSections[section];
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-4 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 capitalize">
                {section === "name" ? "Account Information" : section}
              </h4>
              <p className="text-sm text-gray-600">Update your {section}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => saveSection(section)}
                  disabled={isLoading}
                  className="text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => cancelEdit(section)}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </>
            ) : (
              <button
                onClick={() => toggleEdit(section)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-md">
          {isEditing ? (
            <input
              type={type}
              name={section}
              value={value}
              onChange={handleInputChange}
              className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder={placeholder}
              disabled={isLoading}
            />
          ) : (
            <p className="text-gray-800 font-medium">{value || placeholder}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Toaster position="top-right" />
      <BottomNavigation />
      <div className="flex-1 p-6 lg:p-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg mx-4 my-4 lg:ml-64">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-blue-600 pb-2">
              Personal Information
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8 bg-white p-6 rounded-lg shadow-md">
              <div className="w-32 h-32 relative group">
                <img
                  src={userInfo?.profileImage?.url || null}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-blue-100 group-hover:border-blue-300 transition-all duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).onerror = null;
                    (e.target as HTMLImageElement).src = "/avarter.png";
                  }}
                />
                <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    Profile Photo
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {profileData.name || "User"}
                </h3>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                    Upload New Picture
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleImageUpload(e.target.files[0]);
                        }
                      }}
                      disabled={isLoading}
                    />
                  </label>
                  <button
                    onClick={handleImageDelete}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {renderEditableField(
                "name",
                profileData.name,
                "Enter your full name"
              )}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823.922-4a8 8 0 0112.156.657 8.214 8.214 0 01.949 3.707"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        Password
                      </h4>
                      <p className="text-sm text-gray-600">
                        Update your password
                      </p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="text-gray-800 font-medium">••••••••</p>
                </div>
              </div>
              {renderEditableField(
                "email",
                profileData.email,
                "Enter your email",
                "email"
              )}
              {renderEditableField(
                "phone",
                profileData.phone,
                "Enter your phone number"
              )}
              {renderEditableField(
                "address",
                profileData.address,
                "Enter your address"
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderEditableField(
                  "city",
                  profileData.city,
                  "Enter your city"
                )}
                {renderEditableField(
                  "state",
                  profileData.state,
                  "Enter your state"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
