import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import Swal from "sweetalert2";

const PendingRiders = () => {
  const axiosSecure = UseAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);
  const queryClient = useQueryClient();

  // ✅ Fetch pending riders safely (handle 404 gracefully)
  const fetchPendingRiders = async () => {
    try {
      const { data } = await axiosSecure.get("/riders/pending");
      return data;
    } catch (error) {
      if (error.response && error.response.status === 404) return [];
      throw error;
    }
  };

  // ✅ React Query hook
  const { data: riders = [], isLoading, isError } = useQuery({
    queryKey: ["pendingRiders"],
    queryFn: fetchPendingRiders,
    refetchOnWindowFocus: false,
  });

  // ✅ Approve / Reject handler
  const handleApproveReject = async (id, action, email) => {
    const status = action === "approve" ? "active" : "rejected";

    const result = await Swal.fire({
      title: `${action === "approve" ? "Activate" : "Reject"} Rider`,
      text: `Are you sure you want to ${action === "approve" ? "activate" : "reject"} this rider?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: action === "approve" ? "Activate" : "Reject",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    // ✅ Optimistic UI update (removes instantly from table)
    queryClient.setQueryData(["pendingRiders"], (oldData = []) =>
      oldData.filter((r) => r._id !== id)
    );

    try {
      const { data: response } = await axiosSecure.patch(`/riders/${id}`, {
        status,
        email,
      });

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.message || "Rider updated successfully.",
          timer: 1500,
          showConfirmButton: false,
        });

        await queryClient.invalidateQueries(["pendingRiders"]);
      } else {
        Swal.fire("Error", response.message || "Failed to update rider.", "error");
      }
    } catch (error) {
      console.error("❌ Error updating rider:", error);
      Swal.fire("Error", "Server error while updating rider status.", "error");

      // rollback optimistic update
      queryClient.invalidateQueries(["pendingRiders"]);
    }
  };

  // Modal open/close
  const openModal = (rider) => setSelectedRider(rider);
  const closeModal = () => setSelectedRider(null);

  // ✅ Loading state
  if (isLoading)
    return (
      <div className="p-6 text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  // ✅ Error state
  if (isError)
    return (
      <div className="p-6 text-center text-error font-semibold">
        Error fetching pending riders.
      </div>
    );

  // ✅ Main Table UI
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">🛵 Pending Riders</h2>

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
                    <span className="badge badge-warning font-semibold capitalize">
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
                      onClick={() =>
                        handleApproveReject(rider._id, "approve", rider.email)
                      }
                      className="btn btn-sm btn-success text-white mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        handleApproveReject(rider._id, "reject", rider.email)
                      }
                      className="btn btn-sm btn-error text-white"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-6 font-medium">
                  No pending riders found. 🎉
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Modal for rider details */}
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
              <p><strong>Status:</strong> {selectedRider.status}</p>
            </div>

            <div className="modal-action mt-6">
              <button onClick={closeModal} className="btn btn-neutral">
                Close
              </button>
              <button
                onClick={() => {
                  handleApproveReject(selectedRider._id, "approve", selectedRider.email);
                  closeModal();
                }}
                className="btn btn-success text-white"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  handleApproveReject(selectedRider._id, "reject", selectedRider.email);
                  closeModal();
                }}
                className="btn btn-error text-white"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRiders;
