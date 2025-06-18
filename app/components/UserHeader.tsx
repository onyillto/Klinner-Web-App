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
  const [greeting, setGreeting] = useState("Good Morning 👋");
  const [currentTime, setCurrentTime] = useState<string>("");
  const { user } = useAuth(); // Get user from auth context

  // Function to get African time-based greeting
  const getAfricanTimeGreeting = () => {
    // Get current time in different African time zones
    const now = new Date();

    // Major African time zones
    const timeZones = {
      // West Africa Time (WAT) - UTC+1
      lagos: new Date(
        now.toLocaleString("en-US", { timeZone: "Africa/Lagos" })
      ),
      // Central Africa Time (CAT) - UTC+2
      johannesburg: new Date(
        now.toLocaleString("en-US", { timeZone: "Africa/Johannesburg" })
      ),
      // East Africa Time (EAT) - UTC+3
      nairobi: new Date(
        now.toLocaleString("en-US", { timeZone: "Africa/Nairobi" })
      ),
    };

    // Use Lagos time as primary (you can change this based on your location)
    const africanTime = timeZones.lagos;
    const hour = africanTime.getHours();

    // Format time for display
    const timeString = africanTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    // Determine greeting based on hour
    let greetingText = "";
    let emoji = "";

    if (hour >= 5 && hour < 12) {
      greetingText = "Good Morning";
      emoji = "🌅";
    } else if (hour >= 12 && hour < 17) {
      greetingText = "Good Afternoon";
      emoji = "☀️";
    } else if (hour >= 17 && hour < 21) {
      greetingText = "Good Evening";
      emoji = "🌆";
    } else {
      greetingText = "Good Night";
      emoji = "🌙";
    }

    return {
      greeting: `${greetingText} ${emoji}`,
      time: timeString,
      timezone: "WAT", // West Africa Time
    };
  };

  useEffect(() => {
    // Update greeting immediately
    const updateGreeting = () => {
      const timeInfo = getAfricanTimeGreeting();
      setGreeting(timeInfo.greeting);
      setCurrentTime(`${timeInfo.time} ${timeInfo.timezone}`);
    };

    updateGreeting();

    // Update every minute
    const interval = setInterval(updateGreeting, 60000);

    return () => clearInterval(interval);
  }, []);

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
            onError={() => setProfileImage("/avarter.png")} // Fallback if image fails to load
          />
        </div>
        <div>
          {/* Mobile: Stack vertically, Large screens: Inline */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-2">
            <p className="text-gray-600 text-sm lg:text-base">{greeting}</p>
            {currentTime && (
              <p className="text-gray-500 text-xs lg:text-sm">
                <span className="hidden lg:inline">• </span>
                {currentTime}
              </p>
            )}
          </div>
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
