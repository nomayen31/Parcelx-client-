import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import Swal from "sweetalert2";

const ActiveRiders = () => {
  const axiosSecure = UseAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all active riders from backend
  const fetchActiveRiders = async () => {
    const { data } = await axiosSecure.get("/riders/active");
    console.log("✅ Active riders fetched:", data); // Debugging log
    return data;
  };

  // React Query setup
  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["activeRiders"],
    queryFn: fetchActiveRiders,
  });

  // Handle deactivation
  const handleDeactivate = (id) => {
    Swal.fire({
      title: "Deactivate Rider",
      text: "Are you sure you want to deactivate this rider?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, deactivate",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/riders/${id}`, { status: "deactivated" });
          Swal.fire("Deactivated!", "The rider has been deactivated.", "success");
          refetch(); // Refresh table
        } catch (error) {
          console.error("❌ Error deactivating rider:", error);
          Swal.fire("Error", "Failed to deactivate rider.", "error");
        }
      }
    });
  };

  // Filter data by search
  const filteredData = data.filter(
    (rider) =>
      rider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (isLoading)
    return (
      <div className="p-6 text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-gray-500 mt-2">Loading active riders...</p>
      </div>
    );

  // Error state
  if (isError)
    return (
      <div className="p-6 text-center text-error font-semibold">
        Error fetching active riders.
      </div>
    );

  // UI rendering
  return (
    <div className="p-6">
      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          ✅ Active Riders
        </h2>

        <input
          type="text"
          placeholder="Search by Name or ID..."
          className="input input-bordered w-full sm:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200 text-sm font-semibold uppercase text-gray-700">
              <th>Rider ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Region</th>
              <th>District</th>
              <th>Warehouse</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((rider) => (
                <tr key={rider._id} className="hover">
                  <td>{rider._id}</td>
                  <td>{rider.name}</td>
                  <td>{rider.email}</td>
                  <td>{rider.region}</td>
                  <td>{rider.district}</td>
                  <td>{rider.warehouse}</td>
                  <td>
                    <span className="badge badge-success font-semibold capitalize">
                      {rider.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeactivate(rider._id)}
                      className="btn btn-sm btn-error text-white"
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center text-gray-500 py-6 font-medium"
                >
                  No active riders found. 🚴‍♂️
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveRiders;
