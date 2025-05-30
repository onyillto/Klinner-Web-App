"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function BookingPage() {
  const router = useRouter();
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define service-specific images
  const serviceImages = {
    laundry: "/laundry2.jpg",
    cleaning: "/cleaning2.jpg",
    gardening: "/gardening-service.svg",
    repairs: "/repairs-service.svg",
    "move-out": "/move-out-service.svg",
  };

  // Define additional images for the "Photos & Videos" section
  const serviceGalleryImages = {
    laundry: ["/laundry1.jpg", "/laundry3.jpg"],
    cleaning: ["/cleaning3.jpg", "/cleaning2.jpg"],
    gardening: ["/gardening1.svg", "/gardening2.svg"],
    repairs: ["/repairs1.svg", "/repairs2.svg"],
    moving: ["/move-out1.svg", "/move-out2.svg"],
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedService = localStorage.getItem("selectedService");
        if (storedService) {
          const parsedData = JSON.parse(storedService);
          // Add image data to serviceData if not already present
          const serviceName = parsedData.name.toLowerCase();
          setServiceData({
            ...parsedData,
            mainImage: serviceImages[serviceName] || "/room1.svg",
            images: serviceGalleryImages[serviceName] || [
              "/room1.svg",
              "/room2.svg",
            ],
          });
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error loading service data:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [router]);

  const handleBookNow = () => {
    if (!serviceData || !serviceData.name) {
      alert("No service selected. Please choose a service first.");
      return;
    }
    const serviceName = serviceData.name.toLowerCase();
    const serviceRoutes = {
      laundry: "/booking/laundry",
      cleaning: "/booking/house-cleaning",
      gardening: "/booking/gardning",
      repairs: "/booking/repairs",
      moving: "/booking/moving",
    };
    const routePath =
      serviceRoutes[serviceName] || `/${serviceName.replace(/\s+/g, "-")}`;
    router.push(routePath);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!serviceData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
        <p className="mb-4">
          Sorry, we couldn't find the service you're looking for.
        </p>
        <Link href="/">
          <div className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 cursor-pointer">
            Back to Home
          </div>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{serviceData.name} Service | Booking</title>
        <meta
          name="description"
          content={`Book our ${serviceData.name} service today`}
        />
      </Head>

      <div className="min-h-screentext-black bg-gray-50">
        <header className="bg-white shadow-sm p-4">
          <div className="max-w-5xl mx-auto flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-full hover:bg-gray-500 text-black"
              aria-label="Go back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-black">
              {serviceData.name}
            </h1>
          </div>
        </header>

        <main className="max-w-5xl mx-auto p-4 mb-24">
          <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
            {/* Main image container with consistent height */}
            <div className="h-64 sm:h-80 md:h-96 bg-gray-200 relative">
              <img
                src={serviceData.mainImage}
                alt={`${serviceData.name} service`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;

                }}
              />
            </div>

            <div className="p-6">
              <h1 className="text-3xl font-bold text-black">
                {serviceData.name}
              </h1>
              <div className="flex items-center mt-2">
                <span className="text-yellow-500">★</span>
                <span className="ml-1 text-black">{serviceData.rating}</span>
                <span className="ml-1 text-gray-500">|</span>
                <span className="ml-1 text-gray-500">
                  {serviceData.reviews.toLocaleString()} Reviews
                </span>
              </div>
              <div className="mt-2 py-2">
                <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                  {serviceData.name}
                </span>
              </div>
              <div className="mt-2 text-2xl font-semibold text-indigo-600">
                {serviceData.price}
              </div>
              <p className="mt-4 text-gray-600">{serviceData.description}</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center text-black mb-4">
              <h2 className="text-xl font-bold">Photos & Videos</h2>
              <button className="text-indigo-600 font-medium">See All</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {serviceData.images && serviceData.images.length > 0 ? (
                serviceData.images.slice(0, 2).map((image, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 rounded-lg h-40 sm:h-48 md:h-56 overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`${serviceData.name} service ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        
                      }}
                    />
                  </div>
                ))
              ) : (
                <>
                  <div className="bg-gray-200 rounded-lg h-40 sm:h-48 md:h-56"></div>
                  <div className="bg-gray-200 rounded-lg h-40 sm:h-48 md:h-56"></div>
                </>
              )}
            </div>
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex gap-4 shadow-lg">
          <button
            onClick={() => router.push("/booking/user-chat")}
            className="flex-1 border border-indigo-600 text-indigo-600 py-3 rounded-lg font-medium"
          >
            Message
          </button>
          <button
            onClick={handleBookNow}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium"
          >
            Book Now
          </button>
        </div>
      </div>
    </>
  );
}
22423830327