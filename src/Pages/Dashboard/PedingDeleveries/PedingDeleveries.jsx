import React from "react";

const PendingDeliveries = () => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        🚚 Pending Deliveries
      </h2>
      <p className="text-gray-600">
        Here you’ll see all parcels assigned to you that are either{" "}
        <strong>In-Progress</strong> or <strong>Pending Delivery</strong>.
      </p>
    </div>
  );
};

export default PendingDeliveries;
