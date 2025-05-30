// File: app/components/UserHeader.tsx
"use client";
import { useState, useEffect } from "react";
import NotificationDropdown from "./Notification_Dropdown";
import { useAuth } from "../../context/AuthContext"; // Import your auth context

interface UserHeaderProps {
  name: string;
}

export default function UserHeader({ name }: UserHeaderProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("/avartar.png"); // Default image
  const { user } = useAuth(); // Get user from auth context

  useEffect(() => {
    // Update profile image if user data is available
    if (user && user.profileImage && user.profileImage.url) {
      setProfileImage(user.profileImage.url);
    }
  }, [user]);

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <header className="relative flex justify-between items-center p-4 lg:p-6">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 overflow-hidden lg:w-12 lg:h-12">
          <img
            src={profileImage}
            alt="User avatar"
            className="w-full h-full object-cover"
            onError={() => setProfileImage("/avartar.png")} // Fallback if image fails to load
          />
        </div>
        <div>
          <p className="text-gray-600 text-sm lg:text-base">Good Morning 👋</p>
          <h2 className="font-bold text-black text-xl lg:text-2xl">{name}</h2>
        </div>
      </div>
      <div className="flex items-center relative">
        {" "}
        {/* Add relative here */}
        <button
          className="p-2 hover:bg-gray-400 text-black rounded-full transition-colors lg:mr-2"
          onClick={toggleNotification}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>
        {/* Notification dropdown*/}
        <NotificationDropdown isNotificationOpen={isNotificationOpen} />
        <button className="hidden lg:block p-2 hover:bg-gray-400 text-black rounded-full transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
      </div>
    </header>
  );
}
