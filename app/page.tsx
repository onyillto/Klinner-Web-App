"use client";
import UserHeader from "./components/UserHeader";
import SearchBar from "./components/SearchBar";
import SpecialOffers from "./components/SpecialOffers";
import ServiceCategories from "./components/ServiceCategories";
import ServiceItem from "./components/ServiceItem";
import BottomNavigation from "./components/BottomNavigation";
import DesktopSidebar from "./components/DesktopSidebar";
import ProgressBar from "./components/ProgressBar";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation"; // Import router

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter(); // Initialize router

  useEffect(() => {
    // If authentication check completed and user is not authenticated
    if (!loading && !isAuthenticated()) {
      // Redirect to login page
      router.push("/auth/signin");
    }
  }, [loading, isAuthenticated, router]);

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // If not authenticated, don't render the page content
  // This prevents flash of content before redirect happens
  if (!isAuthenticated()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Redirecting to login...
      </div>
    );
  }

  // Only render the page content if authenticated
  return (
    <div className="bg-gray-50 min-h-screen relative">
      <main className="mx-auto bg-white min-h-screen shadow-lg pb-16 lg:pl-56">
        <div className="max-w-md mx-auto lg:max-w-none lg:mx-0 lg:px-8">
          {/* User Header with dynamic user name */}
          <UserHeader name={user ? user.firstName || user.name : "Guest"} />

          <div className="lg:grid lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-9">
              {/* Desktop Progress Bar - Only visible on lg+ screens */}
              <div className="px-4 my-4 hidden lg:block">
                <ProgressBar />
              </div>

              {/* Search Bar */}
              <div className="px-4 my-4">
                <SearchBar />
              </div>

              {/* Special Offers Section */}
              <div className="px-4 mb-6">
                <SpecialOffers />
              </div>

              {/* Service Categories - Component handles mobile/desktop display internally */}
              <div className="px-4 mb-6">
                <ServiceCategories />
              </div>

              {/* Service Items */}
              <div className="px-4 mb-6 lg:grid lg:grid-cols-2 lg:gap-6 text-indigo-600">
                <ServiceItem
                  title="Standard Cleaning"
                  price="$5/hr"
                  rating={4.5}
                  reviewCount={8000}
                  imageUrl="/standard.svg"
                />

                <div className="lg:block">
                  <ServiceItem
                    title="Deep Cleaning"
                    price="$8/hr"
                    rating={4.7}
                    reviewCount={5200}
                    imageUrl="/deep.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Desktop Sidebar - Only visible on lg+ screens */}
            <div className="lg:col-span-3">
              <DesktopSidebar />
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </main>
    </div>
  );
}
