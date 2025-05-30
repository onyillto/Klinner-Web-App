// File: components/SpecialOffers.js
"use client"
import { useState, useEffect } from "react";

export default function SpecialOffers() {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      discount: "30%",
      title: "Today's Special!",
      description: "Get discount for every\norder",
      image: "/hero-img.svg",
      bgColor: "bg-indigo-500",
    },
    {
      discount: "25%",
      title: "Weekend Deal",
      description: "Book any premium service\nfor the weekend",
      image: "/supermarket-sale-svgrepo-com.svg",
      bgColor: "bg-blue-900",
    },
    {
      discount: "20%",
      title: "First-Time Users",
      description: "Special discount for\nnew customers",
      image: "/tools-and-utensils-cleaning.svg",
      bgColor: "bg-purple-600",
    },
  ];

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Manual slide navigation
  const goToSlide = (index) => {
    setActiveSlide(index);
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-black font-bold lg:text-2xl">Special Offers</h2>
        <a
          href="#"
          className="text-indigo-600 text-sm lg:text-base hover:underline"
        >
          See All
        </a>
      </div>

      <div className="relative">
        {/* Slides Container */}
        <div
          className={`${slides[activeSlide].bgColor} rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow`}
        >
          <div className="relative flex items-center p-6 lg:p-8">
            <div className="text-white">
              <div className="text-5xl font-bold mb-1 lg:text-6xl">
                {slides[activeSlide].discount}
              </div>
              <h3 className="text-lg font-bold mb-1 lg:text-2xl">
                {slides[activeSlide].title}
              </h3>
              <p className="text-sm opacity-90 lg:text-base whitespace-pre-line">
                {slides[activeSlide].description}
              </p>
            </div>
            <div className="ml-auto">
              <img
                src={slides[activeSlide].image}
                alt="Promotional image"
                className="h-24 object-contain lg:h-32"
              />
            </div>
          </div>

          {/* Slider indicators */}
          <div className="flex justify-center space-x-2 pb-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === activeSlide
                    ? "w-6 bg-white"
                    : "w-1 bg-white opacity-50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        

        
      </div>
    </div>
  );
}
