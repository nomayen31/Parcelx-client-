import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure"; // Axios secure hook for authorized requests
import Swal from "sweetalert2";

// Fetching function to get the pending riders
const fetchPendingRiders = async () => {
  const axiosSecure = UseAxiosSecure();
  try {
    const { data } = await axiosSecure.get("/riders/pending");
    return data;
  } catch (error) {
    console.error("Error fetching riders:", error);
    throw error; // Re-throw the error for query to handle
  }
};

const PendingRiders = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["pendingRiders"], // Query key should be an array
    queryFn: fetchPendingRiders, // The function to fetch data
  });

  const [selectedRider, setSelectedRider] = useState(null);

  const handleApproveReject = (id, action) => {
    const status = action === "approve" ? "Approved" : "Rejected";
    // Call mutation to approve/reject rider

    Swal.fire({
      title: `${status === "Approved" ? "Approve" : "Reject"} Rider`,
      text: `Are you sure you want to ${status.toLowerCase()} this rider?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `${status}`,
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the API to update the rider's status
        fetch(`/riders/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then(() => {
          Swal.fire("Success!", `Rider ${status}`, "success");
        });
      }
    });
  };

  // Handle opening modal with rider details
  const openModal = (rider) => {
    setSelectedRider(rider);
  };

  // Handle closing modal
  const closeModal = () => {
    setSelectedRider(null);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching pending riders</div>;

  return (
    <div>
      <h2>Pending Riders</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Region</th>
            <th className="border border-gray-300 px-4 py-2">District</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((rider) => (
            <tr key={rider._id}>
              <td className="border border-gray-300 px-4 py-2">{rider.name}</td>
              <td className="border border-gray-300 px-4 py-2">{rider.email}</td>
              <td className="border border-gray-300 px-4 py-2">{rider.region}</td>
              <td className="border border-gray-300 px-4 py-2">{rider.district}</td>
              <td className="border border-gray-300 px-4 py-2">{rider.status}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => openModal(rider)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleApproveReject(rider._id, "approve")}
                  className="text-green-500 hover:text-green-700 ml-2"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleApproveReject(rider._id, "reject")}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal to View Rider Details */}
      {selectedRider && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Rider Details</h3>
            <p><strong>Name:</strong> {selectedRider.name}</p>
            <p><strong>Email:</strong> {selectedRider.email}</p>
            <p><strong>Region:</strong> {selectedRider.region}</p>
            <p><strong>District:</strong> {selectedRider.district}</p>
            <p><strong>NID:</strong> {selectedRider.nid}</p>
            <p><strong>Warehouse:</strong> {selectedRider.warehouse}</p>
            <p><strong>Status:</strong> {selectedRider.status}</p>
            <p><strong>Created At:</strong> {new Date(selectedRider.create_at).toLocaleString()}</p>

            <div className="mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg mr-2"
              >
                Close
              </button>
              <button
                onClick={() => handleApproveReject(selectedRider._id, "approve")}
                className="bg-green-500 text-white py-2 px-4 rounded-lg"
              >
                Approve
              </button>
              <button
                onClick={() => handleApproveReject(selectedRider._id, "reject")}
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
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
