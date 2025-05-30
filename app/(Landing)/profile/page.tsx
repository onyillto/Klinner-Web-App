"use client";
import React, { useState, useEffect } from "react";
import BottomNavigation from "../../components/BottomNavigation";
import { useAuth } from "../../../context/AuthContext";
import { httpClient } from "../../../utils/httpClient";
import toast, { Toaster } from "react-hot-toast";

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

  // Fetch user info from the API
  const fetchUserInfo = async () => {
    try {
      setIsLoading(true);

      // Add cache busting and no-cache headers
      const timestamp = Date.now();
      const response = await httpClient.get(
        `/api/v1/user/user-info?_t=${timestamp}`,
        {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );

      console.log("=== API RESPONSE ===");
      console.log("Full response:", response.data);

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

  // Update profile data from user info
  const updateProfileDataFromUserInfo = (userData) => {
    console.log("=== UPDATING PROFILE DATA ===");
    console.log("Raw userData:", userData);

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

      console.log("Setting profileData to:", newProfileData);
      setProfileData(newProfileData);
    }
  };

  // Load user info on component mount
  useEffect(() => {
    fetchUserInfo();
  }, []);

  // Debug effect to track data changes
  useEffect(() => {
    console.log("=== CURRENT PROFILE DATA ===");
    console.log("profileData:", profileData);
    console.log("userInfo:", userInfo);

    if (userInfo) {
      console.log("=== IMAGE DEBUG ===");
      console.log("profileImage object:", userInfo.profileImage);
      console.log("Image URL:", userInfo.profileImage?.url);
      console.log("Image URL type:", typeof userInfo.profileImage?.url);
      console.log("Image URL length:", userInfo.profileImage?.url?.length);
    }
  }, [profileData, userInfo]);

  // Update profile data when auth user data is available (fallback)
  useEffect(() => {
    if (user && !userInfo) {
      updateProfileDataFromUserInfo(user);
    }
  }, [user, userInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
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

      // Prepare the update data for filldata endpoint
      const updateData = {
        firstName: profileData.name.split(" ")[0] || "",
        lastName: profileData.name.split(" ").slice(1).join(" ") || "",
        username: userInfo?.username || "",
        mobile: profileData.phone,
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
      };

      console.log("Sending update data:", updateData);

      // Call your filldata API endpoint
      const response = await httpClient.post(
        "/api/v1/user/fill-data",
        updateData
      );

      if (response.data.success) {
        toast.success(
          `${
            section.charAt(0).toUpperCase() + section.slice(1)
          } updated successfully!`
        );

        // Turn off edit mode for this section
        setEditingSections({
          ...editingSections,
          [section]: false,
        });

        // Refresh user data in context
        await refreshUserData();

        // Refetch user info to get latest data
        await fetchUserInfo();
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = (section) => {
    // Revert to original data
    updateProfileDataFromUserInfo(userInfo);
    setEditingSections({
      ...editingSections,
      [section]: false,
    });
  };

  const handleImageUpload = async (file) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("image", file);
      formData.append("user_id", userInfo?.user_id);

      // Call your image upload API endpoint here
      // const response = await httpClient.post("/api/v1/user/upload-profile-image", formData);

      toast.success("Profile image updated successfully!");

      // Refetch user info to get updated image
      await fetchUserInfo();
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

      // Call your delete image API endpoint here
      // const response = await httpClient.delete("/api/v1/user/delete-profile-image");

      toast.success("Profile image deleted successfully!");

      // Refetch user info to get updated data
      await fetchUserInfo();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading && !userInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const renderEditableField = (section, value, placeholder, type = "text") => {
    const isEditing = editingSections[section];

    return (
      <div className="border-b pb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div className="mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500"
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
              <h4 className="font-semibold text-gray-800 capitalize">
                {section === "name" ? "Account Information" : section}
              </h4>
              <p className="text-sm text-gray-500">Change your {section}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => saveSection(section)}
                  disabled={isLoading}
                  className="text-green-600 hover:text-green-700 disabled:opacity-50"
                >
                  <svg
                    className="h-5 w-5"
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
                  className="text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  <svg
                    className="h-5 w-5"
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
                className="text-gray-500 hover:text-indigo-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
        <div className="bg-gray-50 p-4 rounded-md">
          {isEditing ? (
            <input
              type={type}
              name={section}
              value={value}
              onChange={handleInputChange}
              className="w-full bg-white border border-gray-300 text-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={placeholder}
              disabled={isLoading}
            />
          ) : (
            <p className="text-gray-700">{value || placeholder}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toaster />

      {/* Import BottomNavigation component which includes the sidebar */}
      <BottomNavigation />

      {/* Main content */}
      <div className="flex-1 p-8 bg-white rounded-lg shadow-sm mx-4 my-4 lg:ml-56">
        <div className="max-w-4xl mx-auto">
          {/* Profile completion section */}
          {/* <div className="bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-3">
              <div className="relative h-12 w-12 rounded-full bg-white flex items-center justify-center mr-4">
                <div className="absolute h-full w-full rounded-full border-4 border-indigo-500">
                  <div
                    className="absolute top-0 left-0 h-full w-full rounded-full border-4 border-indigo-500"
                    style={{
                      clipPath: `polygon(0 0, ${
                        userInfo?.profileCompletionStatus || 0
                      }% 0, ${
                        userInfo?.profileCompletionStatus || 0
                      }% 100%, 0 100%)`,
                      borderColor: "white",
                    }}
                  ></div>
                </div>
                <span className="text-indigo-500 font-bold text-sm">
                  {userInfo?.profileCompletionStatus || 0}%
                </span>
              </div>
              <div>
                <h3 className="text-indigo-800 font-semibold">
                  Complete profile
                </h3>
                <p className="text-indigo-600 text-sm">
                  Complete your profile to unlock all features
                </p>
              </div>
            </div>
            <button className="w-full py-2 bg-white text-gray-800 rounded-md font-medium">
              Verify identity
            </button>
          </div> */}

          {/* Personal information section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Personal Information
            </h2>

            {/* Debug Panel - Remove this after debugging */}
            {/* {userInfo?.profileImage?.url && (
              <div className="bg-yellow-100 border border-yellow-400 p-4 rounded mb-6">
                <h4 className="font-semibold text-yellow-800">Debug Info:</h4>
                <p className="text-sm text-yellow-700">
                  Image URL: {userInfo.profileImage.url}
                </p>
                <a
                  href={userInfo.profileImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  Test URL in new tab
                </a>
              </div>
            )} */}

            <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
              <div className="w-24 h-24 relative">
                <img
                  src={
                    userInfo?.profileImage?.url ||
                    "https://randomuser.me/api/portraits/men/72.jpg"
                  }
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).onerror = null;
                    (e.target as HTMLImageElement).src =
                      "https://randomuser.me/api/portraits/men/72.jpg";
                  }}
                />
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {profileData.name}
                </h3>
                <div className="mt-4 space-x-2">
                  <label className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer">
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
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    onClick={handleImageDelete}
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* Information fields */}
            <div className="space-y-6">
              {/* Account Information */}
              {renderEditableField(
                "name",
                profileData.name,
                "Enter your full name"
              )}

              {/* Password */}
              <div className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Password</h4>
                      <p className="text-sm text-gray-500">
                        Change your Password
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-500 hover:text-indigo-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
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
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-700">••••••••</p>
                </div>
              </div>

              {/* Email */}
              {renderEditableField(
                "email",
                profileData.email,
                "Enter your email",
                "email"
              )}

              {/* Phone */}
              {renderEditableField(
                "phone",
                profileData.phone,
                "Enter your phone number"
              )}

              {/* Address */}
              {renderEditableField(
                "address",
                profileData.address,
                "Enter your address"
              )}

              {/* City and State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-800">City</h4>
                    <div className="flex space-x-2">
                      {editingSections.city ? (
                        <>
                          <button
                            onClick={() => saveSection("city")}
                            disabled={isLoading}
                            className="text-green-600 hover:text-green-700 disabled:opacity-50"
                          >
                            <svg
                              className="h-5 w-5"
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
                            onClick={() => cancelEdit("city")}
                            disabled={isLoading}
                            className="text-red-600 hover:text-red-700 disabled:opacity-50"
                          >
                            <svg
                              className="h-5 w-5"
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
                          onClick={() => toggleEdit("city")}
                          className="text-gray-500 hover:text-indigo-600"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
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
                  <div className="bg-gray-50 p-4 rounded-md">
                    {editingSections.city ? (
                      <input
                        type="text"
                        name="city"
                        value={profileData.city}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-300 text-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter your city"
                        disabled={isLoading}
                      />
                    ) : (
                      <p className="text-gray-700">
                        {profileData.city || "Enter your city"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-800">State</h4>
                    <div className="flex space-x-2">
                      {editingSections.state ? (
                        <>
                          <button
                            onClick={() => saveSection("state")}
                            disabled={isLoading}
                            className="text-green-600 hover:text-green-700 disabled:opacity-50"
                          >
                            <svg
                              className="h-5 w-5"
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
                            onClick={() => cancelEdit("state")}
                            disabled={isLoading}
                            className="text-red-600 hover:text-red-700 disabled:opacity-50"
                          >
                            <svg
                              className="h-5 w-5"
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
                          onClick={() => toggleEdit("state")}
                          className="text-gray-500 hover:text-indigo-600"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
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
                  <div className="bg-gray-50 p-4 rounded-md">
                    {editingSections.state ? (
                      <input
                        type="text"
                        name="state"
                        value={profileData.state}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-300 text-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter your state"
                        disabled={isLoading}
                      />
                    ) : (
                      <p className="text-gray-700">
                        {profileData.state || "Enter your state"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
