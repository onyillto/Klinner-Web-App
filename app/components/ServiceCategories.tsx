"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ServiceCategories() {
  const router = useRouter();
  const [showComingSoon, setShowComingSoon] = useState(null);

  const categories = [
    {
      name: "Cleaning",
      icon: "🧹",
      color: "bg-indigo-100",
      price: "$7/hr",
      rating: 4.7,
      reviews: 12500,
      description:
        "Professional home cleaning services for any size of residence.",
      mainImage: "/images/cleaning-service.jpg",
      images: ["/public/room1.svg", "/public/room1.svg", "/public/room1.svg"],
      active: true,
    },
    {
      name: "Laundry",
      icon: "🧺",
      color: "bg-yellow-100",
      price: "$5/hr",
      rating: 4.5,
      reviews: 8000,
      description:
        "Wash, dry, and fold laundry services with eco-friendly options available.",
      mainImage: "/images/laundry-service.jpg",
      images: ["/public/room1.svg", "/public/room1.svg", "/public/room1.svg"],
      active: false,
    },
    {
      name: "Moving",
      icon: "🚚",
      color: "bg-cyan-100",
      price: "$15/hr",
      rating: 4.6,
      reviews: 5400,
      description:
        "Professional moving services for homes and businesses of all sizes.",
      mainImage: "/images/moving-service.jpg",
      images: [
        "/images/moving-1.jpg",
        "/images/moving-2.jpg",
        "/images/moving-3.jpg",
        "/images/moving-4.jpg",
      ],
      active: false,
    },
    {
      name: "Gardening",
      icon: "🌱",
      color: "bg-green-100",
      price: "$8/hr",
      rating: 4.4,
      reviews: 3200,
      description: "Garden maintenance, lawn care, and plant care services.",
      mainImage: "/images/gardening-service.jpg",
      images: [
        "/images/moving-1.jpg",
        "/images/moving-2.jpg",
        "/images/moving-3.jpg",
        "/images/moving-4.jpg",
      ],
      active: false,
    },
    {
      name: "Repairs",
      icon: "🔧",
      color: "bg-red-100",
      price: "$12/hr",
      rating: 4.8,
      reviews: 7800,
      description:
        "Household repairs and maintenance for appliances, furniture, and more.",
      mainImage: "/images/repairs-service.jpg",
      images: [
        "/images/repairs-1.jpg",
        "/images/repairs-2.jpg",
        "/images/repairs-3.jpg",
        "/images/repairs-4.jpg",
      ],
      active: false,
    },
  ];

  const handleCategoryClick = (category) => {
    if (category.active) {
      localStorage.setItem("selectedService", JSON.stringify(category));
      router.push(`/booking?service=${category.name.toLowerCase()}`);
    } else {
      setShowComingSoon(category.name);
      // Hide the message after 3 seconds
      setTimeout(() => setShowComingSoon(null), 3000);
    }
  };

  return (
    <div className="lg:bg-white lg:rounded-lg lg:p-6 lg:shadow-sm relative">
      <h2 className="text-xl font-bold mb-4 text-indigo-600 lg:text-2xl">
        Services
      </h2>

      {/* Coming Soon Modal/Toast */}
      {showComingSoon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {showComingSoon} Service
              </h3>
              <p className="text-gray-600 mb-4">
                Coming Soon! We're working hard to bring you this service.
              </p>
              <button
                onClick={() => setShowComingSoon(null)}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile view as scrollable row showing 3 at once */}
      <div className="lg:hidden overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex w-full" style={{ minWidth: "min-content" }}>
          {categories.map((category) => (
            <div
              key={category.name}
              className={`flex flex-col text-black items-center transition-all cursor-pointer mr-6 w-20 relative ${
                category.active
                  ? "opacity-100 hover:scale-105"
                  : "opacity-70 hover:opacity-90"
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              <div
                className={`w-16 h-16 ${
                  category.color
                } rounded-full flex items-center justify-center text-2xl mb-2 relative ${
                  !category.active ? "filter grayscale" : ""
                }`}
              >
                <span>{category.icon}</span>
                {!category.active && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                )}
              </div>
              <span
                className={`text-sm text-center whitespace-nowrap ${
                  category.active ? "text-black" : "text-gray-500"
                }`}
              >
                {category.name}
              </span>
              {!category.active && (
                <span className="text-xs text-orange-600 font-medium mt-1">
                  Soon
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop view as a grid */}
      <div className="hidden lg:grid lg:grid-cols-5 lg:gap-6">
        {categories.map((category) => (
          <div
            key={category.name}
            className={`flex flex-col items-center transition-all cursor-pointer relative ${
              category.active
                ? "opacity-100 hover:scale-105"
                : "opacity-70 hover:opacity-90"
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            <div
              className={`w-20 h-20 ${
                category.color
              } rounded-full flex items-center justify-center text-3xl mb-2 relative ${
                !category.active ? "filter grayscale" : ""
              }`}
            >
              <span>{category.icon}</span>
              {!category.active && (
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
              )}
            </div>
            <span
              className={`text-base ${
                category.active ? "text-black" : "text-gray-500"
              }`}
            >
              {category.name}
            </span>
            {!category.active && (
              <span className="text-sm text-orange-600 font-medium mt-1">
                Coming Soon
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Alternative: Simple badge overlay for coming soon */}
      <style jsx>{`
        .grayscale {
          filter: grayscale(100%);
        }
      `}</style>
    </div>
  );
}
