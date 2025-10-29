import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import Swal from "sweetalert2";

const AssignRider = () => {
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedParcel, setSelectedParcel] = useState(null);
  const [riders, setRiders] = useState([]);
  const [loadingRiders, setLoadingRiders] = useState(false);

  // ✅ Fetch all pending or unpaid parcels
  const { data: parcels = [], isLoading, isError } = useQuery({
    queryKey: ["pendingUnpaidParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels", {
        params: { status: "Pending", paymentStatus: "Unpaid" },
      });
      return res.data.data;
    },
  });

  // ✅ Load riders automatically when modal opens
  useEffect(() => {
    const fetchRiders = async () => {
      if (!selectedParcel) return;
      setLoadingRiders(true);
      try {
        // Pick correct district
        const district =
          selectedParcel?.receiverDistrict ||
          selectedParcel?.senderDistrict ||
          selectedParcel?.serviceCenterDistrict;

        if (!district) {
          Swal.fire("Error", "No valid district found in parcel data", "error");
          setLoadingRiders(false);
          return;
        }

        console.log("📦 Fetching riders for district:", district);

        const res = await axiosSecure.get("/riders/by-district", {
          params: { district },
        });

        setRiders(res.data.data || []);
      } catch (err) {
        console.error("Failed to load riders:", err);
        Swal.fire("Error", "Failed to load riders for this district", "error");
      } finally {
        setLoadingRiders(false);
      }
    };
    fetchRiders();
  }, [selectedParcel, axiosSecure]);

  // ✅ Assign selected rider to parcel (In-Transit + Delivery status)
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

          Swal.fire(
            "Assigned!",
            `${rider.name} has been assigned. Parcel is now In-Transit.`,
            "success"
          );

          setSelectedParcel(null);
          queryClient.invalidateQueries(["pendingUnpaidParcels"]);
        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Failed to assign rider", "error");
        }
      }
    });
  };

  // 🚨 Loading & Error states
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

      <div className="overflow-x-auto bg-white shadow-xl rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider rounded-tl-xl">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Tracking ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Sender
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Receiver
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Origin / Destination
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Cost
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider rounded-tr-xl">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {parcels.length > 0 ? (
              parcels.map((parcel, index) => (
                <tr key={parcel._id} className="hover:bg-indigo-50 transition">
                  <td className="px-6 py-4 text-sm font-medium">{index + 1}</td>
                  <td className="px-6 py-4 text-sm font-bold text-indigo-700">
                    {parcel.trackingId}
                  </td>
                  <td className="px-6 py-4 text-sm">{parcel.senderName}</td>
                  <td className="px-6 py-4 text-sm">{parcel.receiverName}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span className="font-semibold">From:</span>{" "}
                    {parcel.senderDistrict}
                    <br />
                    <span className="font-semibold">To:</span>{" "}
                    {parcel.receiverDistrict}
                  </td>
                  <td className="px-6 py-4 text-sm font-extrabold text-green-600">
                    {parcel.deliveryCost}৳
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium">
                    <button
                      onClick={() => setSelectedParcel(parcel)}
                      className="px-4 py-2 bg-indigo-500 text-white rounded-md shadow hover:bg-indigo-600 transition"
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="px-6 py-8 text-center text-lg text-gray-500 bg-gray-50"
                >
                  🎉 No pending unpaid parcels currently available for assignment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Modal */}
      {selectedParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
              Assign Rider |{" "}
              <span className="text-indigo-600">
                {selectedParcel.trackingId}
              </span>
            </h3>

            <p className="mb-4 text-gray-600">
              Riders in:{" "}
              <strong className="text-indigo-700">
                {selectedParcel.receiverDistrict ||
                  selectedParcel.senderDistrict ||
                  "Unknown"}
              </strong>
            </p>

            {loadingRiders ? (
              <div className="flex justify-center py-6">
                <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></span>
                <p className="ml-3 text-gray-500">Loading riders...</p>
              </div>
            ) : riders.length > 0 ? (
              <ul className="space-y-3 max-h-80 overflow-y-auto">
                {riders.map((rider) => (
                  <li
                    key={rider._id}
                    className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border hover:shadow-md"
                  >
                    <div>
                      <p className="font-semibold text-lg text-gray-900">
                        {rider.name}
                      </p>
                      <p className="text-sm text-indigo-600">{rider.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        District: {rider.district}
                      </p>
                    </div>
                    <button
                      onClick={() => assignRiderToParcel(rider)}
                      className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md"
                    >
                      Assign
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 font-medium">
                  ⚠️ No active riders found in this district.
                </p>
              </div>
            )}

            <div className="mt-6 text-right border-t pt-4">
              <button
                onClick={() => setSelectedParcel(null)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
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
