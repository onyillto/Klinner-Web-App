"use client";
import { useRouter } from "next/navigation";

export default function ServiceCategories() {
  const router = useRouter();

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
    },
  ];

  const handleCategoryClick = (category) => {
    localStorage.setItem("selectedService", JSON.stringify(category));
    router.push(`/booking?service=${category.name.toLowerCase()}`);
  };

  // Rest of your component remains the same
  return (
    <div className="lg:bg-white lg:rounded-lg lg:p-6 lg:shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-indigo-600 lg:text-2xl">
        Services
      </h2>

      {/* Mobile view as scrollable row showing 3 at once */}
      <div className="lg:hidden overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex w-full" style={{ minWidth: "min-content" }}>
          {categories.map((category) => (
            <div
              key={category.name}
              className="flex flex-col text-black items-center  transition-opacity cursor-pointer mr-6 w-20"
              onClick={() => handleCategoryClick(category)}
            >
              <div
                className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center text-2xl mb-2`}
              >
                <span>{category.icon}</span>
              </div>
              <span className="text-sm text-center whitespace-nowrap text-black">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop view as a grid */}
      <div className="hidden lg:grid lg:grid-cols-5 lg:gap-6">
        {categories.map((category) => (
          <div
            key={category.name}
            className="flex flex-col text-black sm:text-black items-center  transition-opacity cursor-pointer"
            onClick={() => handleCategoryClick(category)}
          >
            <div
              className={`w-20 h-20 ${category.color} rounded-full flex items-center justify-center text-3xl mb-2`}
            >
              <span>{category.icon}</span>
            </div>
            <span className="text-base text-black">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
