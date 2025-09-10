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
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If authentication check completed and user is not authenticated
    if (!loading && !isAuthenticated()) {
      // Redirect to login page
      router.push("/auth/signin");
    }
  }, [loading, isAuthenticated, router]);

  // Show loading state while authentication is being checked or user info is not available
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9c1323] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Only render the page content if authenticated and user data is available
  return (
    <div className="bg-gray-50 min-h-screen relative">
      <main className="mx-auto bg-white min-h-screen shadow-lg pb-16 lg:pl-56">
        <div className="max-w-md mx-auto lg:max-w-none lg:mx-0 lg:px-8">
          {/* User Header with dynamic user name */}
          <UserHeader name={user.firstName || user.name || "Guest"} />

          <div className="lg:grid lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-9">
              {/* Desktop Progress Bar - Only visible on lg+ screens */}
              {/* <div className="px-4 my-4 hidden lg:block">
                <ProgressBar />
              </div> */}

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
                  price="N15,000/hr"
                  rating={4.5}
                  reviewCount={20}
                  imageUrl="/standard.svg"
                />

                <div className="lg:block">
                  <ServiceItem
                    title="Deep Cleaning"
                    price="N30,000/hr"
                    rating={4.7}
                    reviewCount={15}
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
