import React, { useState } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const TrackParcel = () => {
  const axiosSecure = UseAxiosSecure();
  const [trackingId, setTrackingId] = useState("");
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError("");
    setTrackingData(null);

    try {
      // NOTE: Original logic retained
      const res = await axiosSecure.get(`/tracking/${trackingId}`);
      setTrackingData(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch tracking info");
    } finally {
      setLoading(false);
    }
  };

  // Helper function for status color
  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-500 text-white";
      case "shipped":
        return "bg-indigo-500 text-white";
      case "processing":
        return "bg-yellow-500 text-gray-800";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-10 text-center text-gray-900 tracking-tight">
          🚀 **Track Your Shipment**
        </h2>

        {/* --- Tracking Form --- */}
        <form
          onSubmit={handleTrack}
          className="bg-white shadow-xl rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter Your Tracking ID (e.g., PX12345)"
              className="border-2 border-indigo-300 rounded-xl px-5 py-3 flex-1 text-lg focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition duration-300"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:shadow-none transition duration-300 transform hover:scale-[1.02]"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Tracking...
                </>
              ) : (
                "Search Parcel"
              )}
            </button>
          </div>
        </form>

        {/* --- Status & Messages --- */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-center mb-6 font-medium">
            🚨 {error}
          </div>
        )}

        {!trackingData && !error && (
          <div className="text-gray-500 text-center py-10 border-2 border-dashed border-gray-300 rounded-xl bg-white">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-2 text-lg">Enter a tracking ID to view your shipment progress.</p>
          </div>
        )}

        {/* --- Tracking Results Display --- */}
        {trackingData && trackingData.success && (
          <div className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
            {/* Parcel Header & Status */}
            <div className="flex justify-between items-start mb-6 border-b pb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                  Parcel ID:{" "}
                  <span className="font-mono text-indigo-600 ml-2">
                    {trackingData.parcel.trackingId}
                  </span>
                </h3>
                <p className="text-gray-500 mt-1 text-lg">
                  {trackingData.parcel.title}
                </p>
              </div>
              <span
                className={`px-4 py-1.5 rounded-full text-base font-bold uppercase shadow-md ${getStatusColor(
                  trackingData.parcel.status
                )}`}
              >
                {trackingData.parcel.status}
              </span>
            </div>

            {/* Receiver & Cost Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-indigo-50 p-4 rounded-xl shadow-inner text-center">
                <p className="text-indigo-600 text-sm font-semibold uppercase tracking-wider">
                  Receiver
                </p>
                <p className="font-extrabold text-xl text-gray-900 mt-1">
                  {trackingData.parcel.receiverName}
                </p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-xl shadow-inner text-center">
                <p className="text-indigo-600 text-sm font-semibold uppercase tracking-wider">
                  Destination District
                </p>
                <p className="font-extrabold text-xl text-gray-900 mt-1">
                  {trackingData.parcel.receiverDistrict}
                </p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-xl shadow-inner text-center">
                <p className="text-indigo-600 text-sm font-semibold uppercase tracking-wider">
                  Delivery Cost
                </p>
                <p className="font-extrabold text-xl text-gray-900 mt-1">
                  ৳{parseFloat(trackingData.parcel.deliveryCost || 0).toFixed(2)}
                </p>
              </div>
            </div>

            {/* --- Tracking History Timeline --- */}
            <h4 className="font-bold text-2xl text-gray-800 mb-4 border-b pb-2">
              🧭 Tracking History
            </h4>
            <div className="relative pl-6 border-l-4 border-indigo-200">
              {trackingData.history.map((log, index) => (
                <div key={index} className="mb-8 ml-6 relative">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-9 top-0 h-4 w-4 rounded-full ${
                      index === 0
                        ? "bg-indigo-600 border-4 border-indigo-200 shadow-md"
                        : "bg-indigo-400"
                    }`}
                  ></div>

                  <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl">
                    <p className="text-lg font-semibold text-gray-900">
                      {log.message}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(log.time).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Not Found Message */}
        {trackingData && !trackingData.success && (
          <div className="text-center text-gray-600 mt-10 bg-white p-6 rounded-xl shadow-lg">
            <p className="text-xl">
              ❌ No parcel found with ID:{" "}
              <span className="font-mono font-bold text-red-500">
                {trackingId}
              </span>
            </p>
            <p className="mt-2 text-gray-500">
              Please double-check the ID and try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackParcel;