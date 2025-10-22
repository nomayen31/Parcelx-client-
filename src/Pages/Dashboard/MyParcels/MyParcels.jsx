import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MdDeleteSweep } from "react-icons/md";
import { TbCreditCardPay } from "react-icons/tb";
import { GrView } from "react-icons/gr";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import UseAuth from "../../../Hooks/UseAuth";
import { useNavigate } from "react-router-dom";

const MyParcels = () => {
  const axiosSecure = UseAxiosSecure();
  const { user } = UseAuth();
  const navigate = useNavigate();

  // 🔵 Modal state
  const [selectedParcel, setSelectedParcel] = useState(null);

  // 🟢 Fetch parcels using TanStack Query
  const {
    data: parcels = { data: [] },
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["parcels", user?.email],
    queryFn: async () => {
      if (!user?.email) return { data: [] };
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res?.data || { data: [] };
    },
    enabled: !!user?.email,
  });

  const handlePay = (id) => navigate(`/dashboard/payment/${id}`);

  // 🗑️ Delete function
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This parcel will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/parcels/${id}`);
          if (res.data?.deletedCount > 0 || res.data?.success) {
            Swal.fire("Deleted!", "Parcel has been deleted.", "success");
            refetch();
          } else {
            Swal.fire("Not found!", "Parcel not found.", "info");
          }
        } catch (error) {
          console.error("Error deleting parcel:", error);
          Swal.fire("Error!", "Failed to delete parcel.", "error");
        }
      }
    });
  };

  // 🕒 Loading / Error states
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading your parcels...</p>
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Failed to load parcels.</p>
      </div>
    );

  return (
    <section className="container px-4 mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          <h2 className="text-xl font-semibold text-gray-800">📦 My Parcels</h2>
          <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full">
            {parcels.data.length} Parcels
          </span>
        </div>

        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-sm font-medium bg-lime-400 text-gray-900 rounded-md hover:bg-lime-500 transition"
        >
          Refresh
        </button>
      </div>

      {/* Table Section */}
      <div className="flex flex-col mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600">Title</th>
                    <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600">Tracking ID</th>
                    <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600">Type</th>
                    <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600">Weight (kg)</th>
                    <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600">Delivery Cost (৳)</th>
                    <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600">Payment</th>
                    <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600">Created</th>
                    <th className="px-4 py-3.5 text-sm font-semibold text-gray-600 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(parcels.data) && parcels.data.length > 0 ? (
                    parcels.data.map((parcel) => {
                      const isPaid = parcel.paymentStatus === "Paid";
                      return (
                        <tr key={parcel._id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm text-gray-700 font-medium">
                            {parcel.title || "Untitled"}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">{parcel.trackingId}</td>
                          <td className="px-4 py-4 text-sm text-gray-600 capitalize">{parcel.type}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{parcel.weight}</td>
                          <td className="px-4 py-4 text-sm text-gray-800 font-semibold">{parcel.deliveryCost}</td>
                          <td className="px-4 py-4 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}
                            >
                              {parcel.paymentStatus || "Unpaid"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                parcel.status === "Delivered"
                                  ? "bg-green-100 text-green-700"
                                  : parcel.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {parcel.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">{parcel.createdAtReadable}</td>

                          {/* ✅ Action Buttons */}
                          <td className="px-4 py-4 text-sm text-gray-500">
                            <div className="flex items-center justify-center gap-x-4">
                              {/* 👁️ View */}
                              <button
                                onClick={() => setSelectedParcel(parcel)}
                                title="View"
                                className="text-blue-500 hover:text-blue-600 hover:bg-gray-100 rounded-full p-2 transition flex items-center justify-center"
                              >
                                <GrView className="w-5 h-5" />
                              </button>

                              {/* 💳 Pay (disabled when Paid) */}
                              <button
                                onClick={() => !isPaid && handlePay(parcel._id)}
                                title={isPaid ? "Already paid" : "Pay"}
                                disabled={isPaid}
                                aria-disabled={isPaid}
                                className={`rounded-full p-2 transition flex items-center justify-center ${
                                  isPaid
                                    ? "opacity-40 cursor-not-allowed text-gray-400"
                                    : "text-green-500 hover:text-green-600 hover:bg-gray-100"
                                }`}
                              >
                                <TbCreditCardPay className="w-5 h-5" />
                              </button>

                              {/* 🗑️ Delete */}
                              <button
                                onClick={() => handleDelete(parcel._id)}
                                title="Delete"
                                className="text-red-500 hover:text-red-600 hover:bg-gray-100 rounded-full p-2 transition flex items-center justify-center"
                              >
                                <MdDeleteSweep className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="9" className="px-4 py-4 text-sm text-gray-500 text-center">
                        No parcels found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 🔵 Parcel Details Modal */}
      {selectedParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-96 rounded-xl shadow-xl p-6 relative">
            <button
              onClick={() => setSelectedParcel(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-lg font-bold"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-indigo-700 mb-4">Parcel Details</h3>

            <div className="space-y-2 text-gray-700 text-sm">
              <p>
                <strong>Tracking ID:</strong> {selectedParcel.trackingId}
              </p>
              <p>
                <strong>Title:</strong> {selectedParcel.title || "N/A"}
              </p>
              <p>
                <strong>Type:</strong> {selectedParcel.type}
              </p>
              <p>
                <strong>Weight:</strong> {selectedParcel.weight} kg
              </p>
              <p>
                <strong>Delivery Cost:</strong> ৳{selectedParcel.deliveryCost}
              </p>
              <p>
                <strong>Status:</strong> {selectedParcel.status || "Pending"}
              </p>
              <p>
                <strong>Payment:</strong> {selectedParcel.paymentStatus || "Unpaid"}
              </p>
            </div>

            <div className="mt-6 flex justify-center space-x-4">
              {(() => {
                const selectedIsPaid = selectedParcel?.paymentStatus === "Paid";
                return (
                  <button
                    onClick={() => !selectedIsPaid && handlePay(selectedParcel._id)}
                    disabled={selectedIsPaid}
                    aria-disabled={selectedIsPaid}
                    className={`text-white px-4 py-2 rounded-lg flex items-center gap-2 ${
                      selectedIsPaid ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    <TbCreditCardPay /> {selectedIsPaid ? "Paid" : "Pay Now"}
                  </button>
                );
              })()}

              <button
                onClick={() => setSelectedParcel(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyParcels;
