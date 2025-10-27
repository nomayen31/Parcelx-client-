import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import Swal from "sweetalert2";

const PendingRiders = () => {
  const axiosSecure = UseAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);

  // Fetch function inside component so it can access axiosSecure
  const fetchPendingRiders = async () => {
    const { data } = await axiosSecure.get("/riders/pending");
    return data;
  };

  // React Query hook
  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["pendingRiders"],
    queryFn: fetchPendingRiders,
  });

  // Handle approve or reject
  const handleApproveReject = (id, action) => {
    const status = action === "approve" ? "Approved" : "Rejected";

    Swal.fire({
      title: `${status === "Approved" ? "Approve" : "Reject"} Rider`,
      text: `Are you sure you want to ${status.toLowerCase()} this rider?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: status,
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/riders/${id}`, { status });
          Swal.fire("Success!", `Rider ${status}`, "success");
          refetch(); // 🔄 refresh table after update
        } catch (error) {
          console.error("Error updating rider:", error);
          Swal.fire("Error", "Failed to update rider status.", "error");
        }
      }
    });
  };

  // Modal functions
  const openModal = (rider) => setSelectedRider(rider);
  const closeModal = () => setSelectedRider(null);

  if (isLoading) return <div className="p-6 text-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  if (isError) return <div className="p-6 text-center text-error font-semibold">Error fetching pending riders.</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">🛵 Pending Riders</h2>

      <div className="overflow-x-auto shadow-lg rounded-xl">
        {/* DaisyUI Table styling */}
        <table className="table table-zebra w-full">
          {/* Head */}
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
            {data.length > 0 ? (
              data.map((rider) => (
                <tr key={rider._id} className="hover">
                  <td>{rider.name}</td>
                  <td>{rider.email}</td>
                  <td>{rider.region}</td>
                  <td>{rider.district}</td>
                  <td><span className="badge badge-warning font-semibold">{rider.status}</span></td>
                  <td>
                    {/* DaisyUI Button styling */}
                    <button
                      onClick={() => openModal(rider)}
                      className="btn btn-sm btn-info text-white mr-2"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleApproveReject(rider._id, "approve")}
                      className="btn btn-sm btn-success text-white mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproveReject(rider._id, "reject")}
                      className="btn btn-sm btn-error text-white"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center text-gray-500 py-6 font-medium"
                >
                  No pending riders found. 🎉
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* DaisyUI Modal for rider details */}
      <input type="checkbox" id="rider_details_modal" className="modal-toggle" checked={!!selectedRider} readOnly/>
      {selectedRider && (
        <div className="modal" role="dialog" onClick={closeModal}>
          <div className="modal-box p-8" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-4 text-primary">Rider Details</h3>
            
            <div className="space-y-3 text-base">
              <p><strong>Name:</strong> <span className="font-medium">{selectedRider.name}</span></p>
              <p><strong>Email:</strong> <span className="font-medium">{selectedRider.email}</span></p>
              <p><strong>Region:</strong> <span className="font-medium badge badge-outline badge-primary">{selectedRider.region}</span></p>
              <p><strong>District:</strong> <span className="font-medium badge badge-outline badge-secondary">{selectedRider.district}</span></p>
              <p><strong>NID:</strong> <span className="font-medium">{selectedRider.nid}</span></p>
              <p><strong>Warehouse:</strong> <span className="font-medium">{selectedRider.warehouse}</span></p>
              <p><strong>Status:</strong> <span className="font-medium badge badge-warning">{selectedRider.status}</span></p>
              <p>
                <strong>Created At:</strong>{" "}
                <span className="font-medium">{new Date(selectedRider.create_at).toLocaleString()}</span>
              </p>
            </div>

            <div className="modal-action mt-6">
              <button
                onClick={closeModal}
                className="btn btn-neutral"
              >
                Close
              </button>
              <button
                onClick={() => {handleApproveReject(selectedRider._id, "approve"); closeModal();}}
                className="btn btn-success text-white"
              >
                Approve
              </button>
              <button
                onClick={() => {handleApproveReject(selectedRider._id, "reject"); closeModal();}}
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