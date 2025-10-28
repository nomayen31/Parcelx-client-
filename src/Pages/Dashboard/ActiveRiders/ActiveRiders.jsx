import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import Swal from "sweetalert2";

const ActiveRiders = () => {
  const axiosSecure = UseAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);
  const queryClient = useQueryClient();

  // ✅ Fetch all active riders
  const fetchActiveRiders = async () => {
    try {
      const { data } = await axiosSecure.get("/riders/active");
      return data;
    } catch (error) {
      console.error("Error fetching active riders:", error);
      throw error;
    }
  };

  const {
    data: riders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["activeRiders"],
    queryFn: fetchActiveRiders,
  });

  // ✅ Deactivate Rider (move to pending)
  const handleDeactivate = async (id, email) => {
    const result = await Swal.fire({
      title: "Deactivate Rider",
      text: "Are you sure you want to deactivate this rider?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Deactivate",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    // ✅ Optimistic update for instant UI
    queryClient.setQueryData(["activeRiders"], (old = []) =>
      old.filter((r) => r._id !== id)
    );

    try {
      const { data: response } = await axiosSecure.patch(`/riders/${id}`, {
        status: "pending",
        email,
      });

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Rider Deactivated",
          text: response.message || "Rider moved to pending list.",
          timer: 1500,
          showConfirmButton: false,
        });

        // ✅ Re-fetch to keep data in sync
        await queryClient.invalidateQueries(["activeRiders"]);
      } else {
        Swal.fire("Error", response.message || "Failed to deactivate rider.", "error");
      }
    } catch (error) {
      console.error("❌ Error deactivating rider:", error);
      Swal.fire("Error", "Server error while deactivating rider.", "error");
      // rollback optimistic update
      await queryClient.invalidateQueries(["activeRiders"]);
    }
  };

  // Modal functions
  const openModal = (rider) => setSelectedRider(rider);
  const closeModal = () => setSelectedRider(null);

  // ✅ Loading & error states
  if (isLoading)
    return (
      <div className="p-6 text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  if (isError)
    return (
      <div className="p-6 text-center text-error font-semibold">
        Error fetching active riders.
      </div>
    );

  // ✅ Main UI
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">✅ Active Riders</h2>

      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200 text-sm font-semibold uppercase text-gray-700">
              <th>Name</th>
              <th>Email</th>
              <th>Region</th>
              <th>District</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {riders.length > 0 ? (
              riders.map((rider) => (
                <tr key={rider._id} className="hover">
                  <td>{rider.name}</td>
                  <td>{rider.email}</td>
                  <td>{rider.region}</td>
                  <td>{rider.district}</td>
                  <td>
                    <span className="badge badge-success font-semibold capitalize">
                      {rider.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => openModal(rider)}
                      className="btn btn-sm btn-info text-white mr-2"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeactivate(rider._id, rider.email)}
                      className="btn btn-sm btn-warning text-white"
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-6 font-medium">
                  No active riders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Rider Details Modal */}
      {selectedRider && (
        <div className="modal" role="dialog" onClick={closeModal}>
          <div
            className="modal-box p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-4 text-primary">
              Rider Details
            </h3>

            <div className="space-y-3 text-base">
              <p><strong>Name:</strong> {selectedRider.name}</p>
              <p><strong>Email:</strong> {selectedRider.email}</p>
              <p><strong>Region:</strong> {selectedRider.region}</p>
              <p><strong>District:</strong> {selectedRider.district}</p>
              <p><strong>NID:</strong> {selectedRider.nid}</p>
              <p><strong>Warehouse:</strong> {selectedRider.warehouse}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="badge badge-success">{selectedRider.status}</span>
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(selectedRider.create_at).toLocaleString()}
              </p>
            </div>

            <div className="modal-action mt-6">
              <button onClick={closeModal} className="btn btn-neutral">
                Close
              </button>
              <button
                onClick={() => {
                  handleDeactivate(selectedRider._id, selectedRider.email);
                  closeModal();
                }}
                className="btn btn-warning text-white"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveRiders;
