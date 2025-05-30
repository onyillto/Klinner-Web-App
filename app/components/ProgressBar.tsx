export default function ProgressBar() {
  return (
    <div className="w-full bg-white p-4 shadow-sm rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg text-black">Cleaning Progress</h3>
        <span className="text-sm text-gray-500">60% completed</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-indigo-600 h-2.5 rounded-full"
          style={{ width: "60%" }}
        ></div>
      </div>
      <div className="flex justify-between text-sm text-gray-500 mt-2">
        <span>Started: 1:30 PM</span>
        <span>Est. completion: 3:30 PM</span>
      </div>
    </div>
  );
}
