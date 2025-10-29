import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import Swal from "sweetalert2";

const AssignRider = () => {
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedParcel, setSelectedParcel] = useState(null);
  const [riders, setRiders] = useState([]);
  const [loadingRiders, setLoadingRiders] = useState(false);

  // ✅ Fetch Pending + Unpaid parcels
  const { data: parcels = [], isLoading, isError } = useQuery({
    queryKey: ["pendingUnpaidParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels", {
        params: { status: "Pending", paymentStatus: "Unpaid" },
      });
      return res.data.data;
    },
  });

  // ✅ Handle Assign Button Click
  const handleAssign = async (parcel) => {
    setSelectedParcel(parcel);
    setLoadingRiders(true);

    try {
      // NOTE: Parcel is assumed to have a `serviceCenterDistrict` property
      const res = await axiosSecure.get("/riders/by-district", {
        params: { district: parcel.serviceCenterDistrict },
      });
      setRiders(res.data.data || []);
    } catch (err) {
      console.error("Failed to load riders:", err);
      Swal.fire("Error", "Failed to load riders for this district", "error");
    } finally {
      setLoadingRiders(false);
    }
  };

  // ✅ Assign Rider Confirm
  const assignRiderToParcel = async (rider) => {
    Swal.fire({
      title: "Confirm Assignment",
      html: `
        <p>Assign <strong>${rider.name}</strong> to parcel <strong>${selectedParcel.trackingId}</strong>?</p>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Assign",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#4f46e5",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/parcels/${selectedParcel._id}/assign`, {
            riderId: rider._id,
            riderName: rider.name,
            riderEmail: rider.email,
          });

          Swal.fire("Assigned!", `${rider.name} has been assigned.`, "success");
          setSelectedParcel(null);
          // Invalidate the query to refetch the parcel list (the assigned parcel will be gone)
          queryClient.invalidateQueries(["pendingUnpaidParcels"]); 
        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Failed to assign rider", "error");
        }
      }
    });
  };

  // 🚨 Loading & Error States
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></span>
        <p className="ml-4 text-lg font-medium text-indigo-700">
          Loading parcels...
        </p>
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-red-600 p-6 bg-red-50 rounded-lg shadow-md">
          Failed to load parcels 😢. Please try again.
        </p>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        🚚 Parcel Assignment Dashboard
      </h2>
      <p className="text-gray-600 mb-6">
        Review and assign riders to <strong>Pending and Unpaid</strong> parcels.
      </p>

      {/* --- Parcel Table --- */}
      <div className="overflow-x-auto bg-white shadow-xl rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider rounded-tl-xl">#</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Tracking ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Sender</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Receiver</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Origin / Destination</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Cost</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Payment</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider rounded-tr-xl">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {parcels.length > 0 ? (
              parcels.map((parcel, index) => (
                <tr key={parcel._id} className="hover:bg-indigo-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-700">{parcel.trackingId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{parcel.senderName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{parcel.receiverName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <span className="font-semibold">From:</span> {parcel.senderDistrict}
                    <br />
                    <span className="font-semibold">To:</span> {parcel.receiverDistrict}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-green-600">
                    {parcel.deliveryCost}৳
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {parcel.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      {parcel.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      onClick={() => handleAssign(parcel)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                      aria-label={`Assign rider to parcel ${parcel.trackingId}`}
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-8 text-center text-lg text-gray-500 bg-gray-50">
                  🎉 No pending unpaid parcels currently available for assignment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- ✅ Modal Component with New UI --- */}
      {selectedParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100">
            <h3 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
              <span className="text-indigo-600">Assign Rider</span>
              <span className="text-gray-500 text-base ml-2"> | {selectedParcel.trackingId}</span>
            </h3>

            <div className="mb-4 text-sm text-gray-600 bg-indigo-50 p-3 rounded-lg border border-indigo-200">
              <p className="font-semibold">Destination District:</p> 
              <p className="font-bold text-indigo-700">{selectedParcel.serviceCenterDistrict}</p>
            </div>

            {loadingRiders ? (
              <div className="flex justify-center py-8">
                <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></span>
                <p className="ml-4 text-lg text-gray-500">Loading riders...</p>
              </div>
            ) : riders.length > 0 ? (
              <ul className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {riders.map((rider) => (
                  <li
                    key={rider._id}
                    className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition duration-200"
                  >
                    <div>
                      <p className="font-semibold text-lg text-gray-900">{rider.name}</p>
                      <p className="text-sm text-indigo-600">{rider.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        <span className="font-medium">District:</span> {rider.district}
                      </p>
                    </div>
                    <button
                      onClick={() => assignRiderToParcel(rider)}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg shadow-md transition duration-150"
                      aria-label={`Assign ${rider.name}`}
                    >
                      Select & Assign
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-lg font-medium text-yellow-800">
                  ⚠️ No active riders found in this district.
                </p>
                <p className="text-sm text-yellow-700 mt-1">Please check rider availability or district settings.</p>
              </div>
            )}

            {/* Modal Footer/Close Button */}
            <div className="mt-6 pt-4 border-t text-right">
              <button
                onClick={() => setSelectedParcel(null)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg shadow-sm transition duration-150"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRider;