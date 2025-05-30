export default function ServiceItem({
  title,
  price,
  rating,
  reviewCount,
  imageUrl,
}) {
  return (
    <div className="mb-4 lg:mb-0">
      <h2 className="text-xl font-bold mb-4 lg:text-2xl text-purple-900">{title}</h2>

      <div className="flex  bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
        <div className="w-1/3 lg:w-2/5">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-2/3 lg:w-3/5 p-4">
          <h3 className="font-bold text-black text-lg lg:text-xl">{title}</h3>
          <p className="text-indigo-600 font-bold lg:text-lg lg:mt-1">
            {price}
          </p>

          <div className="flex items-center mt-2">
            <div className="flex text-yellow-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <span className="ml-1 text-sm lg:text-base">{rating}</span>
            <span className="ml-1 text-sm text-gray-500 lg:text-base">
              | {reviewCount.toLocaleString()} Reviews
            </span>
          </div>

          <button className="hidden lg:block mt-3 text-sm bg-indigo-600 text-white py-1 px-4 rounded-full hover:bg-indigo-700 transition-colors">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
