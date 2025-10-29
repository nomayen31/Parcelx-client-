import React from "react";
import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import UseAuth from "../../../Hooks/UseAuth";
import { FaBoxOpen, FaMapMarkerAlt, FaClock, FaRedoAlt } from "react-icons/fa";

const PendingDeliveries = () => {
  const axiosSecure = UseAxiosSecure();
  const { user } = UseAuth();

  // 🚚 Fetch all pending / in-transit parcels for this rider
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["riderTasks", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/riders/tasks?email=${user.email}`);
      return res.data;
    },
  });

  const parcels = data?.data || [];

  // Helper function for dynamic status badge styling
  const getStatusBadge = (status) => {
    let colorClass = "bg-gray-200 text-gray-700";
    let icon = <FaClock />;

    if (status.toLowerCase() === "in-transit") {
      colorClass = "bg-yellow-100 text-yellow-700";
    } else if (status.toLowerCase() === "pending") {
      colorClass = "bg-blue-100 text-blue-700";
    }

    return (
      <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full capitalize ${colorClass}`}>
        {icon}
        <span className="ml-1">{status}</span>
      </span>
    );
  };

  // 🌀 Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px] bg-white rounded-xl shadow-lg">
        <span className="loading loading-spinner loading-lg text-lime-500"></span>
        <p className="ml-3 text-gray-600">Loading your pending deliveries...</p>
      </div>
    );
  }

  // ❌ Error State
  if (isError) {
    // Determine the error message to display
    const errorMessage = error?.response?.data?.message || error?.message || "An unknown error occurred.";
    
    return (
      <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-center shadow-lg">
        <p className="text-red-600 font-medium mb-2">
          Failed to load deliveries 😞
        </p>
        <p className="text-gray-500 text-sm italic">Server Message: {errorMessage}</p>
        <button
          onClick={refetch}
          className="mt-4 px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          <FaRedoAlt className="inline mr-2" /> Retry Fetch
        </button>
      </div>
    );
  }

  // ✅ Render Table
  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      {/* Header and Refresh Button */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
          🚚 Your Tasks ({parcels.length})
        </h2>
        <button
          onClick={refetch}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 bg-lime-500 text-white font-semibold rounded-lg hover:bg-lime-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaRedoAlt className={isFetching ? "animate-spin" : ""} /> 
          {isFetching ? "Refreshing..." : "Refresh List"}
        </button>
      </div>

      {/* Empty State */}
      {parcels.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-lg">
          <FaBoxOpen className="mx-auto text-6xl text-lime-400 mb-4" />
          <p className="text-lg font-medium">No pending or in-transit deliveries assigned to you.</p>
          <p className="text-sm">Time to relax or check for new assignments! 🛋️</p>
        </div>
      ) : (
        /* Data Table */
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Tracking ID</th>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Receiver & Address</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-right">Cost (৳)</th>
                <th className="py-3 px-4 text-left">Created At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {parcels.map((parcel, index) => (
                <tr
                  key={parcel._id}
                  className="hover:bg-lime-50 transition duration-150"
                >
                  {/* # */}
                  <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-500">
                    {index + 1}
                  </td>
                  {/* Tracking ID */}
                  <td className="py-4 px-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {parcel.trackingId}
                  </td>
                  {/* Title */}
                  <td className="py-4 px-4 text-sm text-gray-700 max-w-[150px] truncate">
                    {parcel.title}
                  </td>
                  {/* Receiver & Address */}
                  <td className="py-4 px-4 text-sm text-gray-600 max-w-xs">
                    <p className="font-semibold flex items-center gap-1">
                        <FaMapMarkerAlt className="text-lime-500 text-xs" />
                        {parcel.receiverName}
                    </p>
                    <p className="text-xs italic text-gray-500 mt-0.5 truncate">{parcel.receiverAddress}</p>
                  </td>
                  {/* Status */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {getStatusBadge(parcel.status)}
                  </td>
                  {/* Cost */}
                  <td className="py-4 px-4 whitespace-nowrap text-sm font-bold text-right text-lime-600">
                    ৳{parseFloat(parcel.deliveryCost).toFixed(2)}
                  </td>
                  {/* Created At */}
                  <td className="py-4 px-4 whitespace-nowrap text-xs text-gray-500">
                    {new Date(parcel.createdAt).toLocaleDateString("en-BD", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingDeliveries;