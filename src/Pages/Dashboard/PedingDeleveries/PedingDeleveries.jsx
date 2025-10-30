import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import UseAuth from "../../../Hooks/UseAuth";
import Swal from "sweetalert2";
import { FaBoxOpen, FaRedoAlt, FaCheckCircle } from "react-icons/fa";

const PendingDeliveries = () => {
  const axiosSecure = UseAxiosSecure();
  const { user } = UseAuth();
  const queryClient = useQueryClient();

  // ✅ Fetch Pending + In-Transit tasks
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

  // ✅ Mutation: Mark as Delivered
  const markDelivered = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/parcels/${id}/status`, {
        status: "Delivered",
      });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Delivered!",
        text: "Parcel marked as delivered successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
      // ✅ Refresh both lists
      queryClient.invalidateQueries(["riderTasks"]);
      queryClient.invalidateQueries(["completedDeliveries"]);
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: err?.response?.data?.message || err.message,
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px] bg-white rounded-xl shadow-lg">
        <span className="loading loading-spinner loading-lg text-lime-500"></span>
        <p className="ml-3 text-gray-600">Loading your pending deliveries...</p>
      </div>
    );
  }

  if (isError) {
    const errorMessage = error?.response?.data?.message || error?.message || "An unknown error occurred.";
    return (
      <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-center shadow-lg">
        <p className="text-red-600 font-medium mb-2">Failed to load deliveries 😞</p>
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

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
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

      {parcels.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-lg">
          <FaBoxOpen className="mx-auto text-6xl text-lime-400 mb-4" />
          <p className="text-lg font-medium">No pending or in-transit deliveries assigned to you.</p>
          <p className="text-sm">Time to relax or check for new assignments! 🛋️</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Tracking ID</th>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Receiver</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-right">Cost (৳)</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {parcels.map((parcel, index) => (
                <tr key={parcel._id} className="hover:bg-lime-50 transition duration-150">
                  <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
                  <td className="py-3 px-4 text-sm font-mono text-gray-800">{parcel.trackingId}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{parcel.title}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{parcel.receiverName}</td>
                  <td className="py-3 px-4 text-sm text-blue-600 capitalize">{parcel.status}</td>
                  <td className="py-3 px-4 text-sm text-right font-bold text-lime-600">
                    ৳{parseFloat(parcel.deliveryCost).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => markDelivered.mutate(parcel._id)}
                      disabled={markDelivered.isPending}
                      className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaCheckCircle /> Deliver
                    </button>
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
