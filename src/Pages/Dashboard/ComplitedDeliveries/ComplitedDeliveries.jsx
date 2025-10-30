import React from "react";
import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import UseAuth from "../../../Hooks/UseAuth";
import { FaBoxOpen, FaMoneyBillWave, FaRedoAlt } from "react-icons/fa";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const CompletedDeliveries = () => {
  const axiosSecure = UseAxiosSecure();
  const { user } = UseAuth();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["completedDeliveries", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/riders/completed?email=${user.email}`);
      return res.data;
    },
  });

  const parcels = data?.data || [];

  // Count status types
  const totalDelivered = parcels.filter((p) => p.status === "delivered").length;
  const totalInTransit = parcels.filter((p) => p.status === "in-transit").length;
  const totalPending = parcels.filter((p) => p.status === "pending").length;
  const totalAssigned = parcels.filter((p) => p.status === "assigned").length;

  const totalEarnings = parcels.reduce(
    (sum, p) => sum + parseFloat(p.deliveryCost || 0),
    0
  );

  // 🥧 Parcel Status Pie Chart
  const chartData = {
    labels: ["Delivered", "In Transit", "Pending", "Assigned to Rider"],
    datasets: [
      {
        label: "Parcel Distribution",
        data: [totalDelivered, totalInTransit, totalPending, totalAssigned],
        backgroundColor: ["#84cc16", "#60a5fa", "#facc15", "#f87171"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#374151", font: { size: 13 } },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  // 📈 Earnings Line Chart (Date vs Earnings)
  const sortedParcels = [...parcels]
    .filter((p) => p.status === "delivered")
    .sort(
      (a, b) =>
        new Date(a.updatedAt || a.createdAt) -
        new Date(b.updatedAt || b.createdAt)
    );

  const lineLabels = sortedParcels.map((p) =>
    new Date(p.updatedAt || p.createdAt).toLocaleDateString("en-BD", {
      day: "2-digit",
      month: "short",
    })
  );

  const lineData = sortedParcels.map((p) =>
    parseFloat(p.deliveryCost || 0)
  );

  const lineChartData = {
    labels: lineLabels,
    datasets: [
      {
        label: "Earnings (৳)",
        data: lineData,
        borderColor: "#84cc16",
        backgroundColor: "rgba(132, 204, 22, 0.2)",
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: "#65a30d",
      },
    ],
  };

  const lineChartOptions = {
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Earnings Trend (৳)",
        font: { size: 16 },
        color: "#111827",
      },
    },
    responsive: true,
    scales: {
      x: {
        ticks: { color: "#6b7280", font: { size: 12 } },
        grid: { color: "#f3f4f6" },
      },
      y: {
        ticks: { color: "#6b7280", font: { size: 12 } },
        grid: { color: "#f3f4f6" },
      },
    },
  };

  // 🌀 Loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px] bg-white rounded-xl shadow">
        <span className="loading loading-spinner loading-lg text-lime-500"></span>
        <p className="ml-3 text-gray-600">Loading completed deliveries...</p>
      </div>
    );
  }

  // ❌ Error
  if (isError) {
    const errorMessage =
      error?.response?.data?.message || error?.message || "An error occurred.";
    return (
      <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-center shadow-lg">
        <p className="text-red-600 font-medium mb-2">Failed to load data 😞</p>
        <p className="text-gray-500 text-sm italic">Error: {errorMessage}</p>
        <button
          onClick={refetch}
          className="mt-4 px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          <FaRedoAlt className="inline mr-2" /> Retry
        </button>
      </div>
    );
  }

  // ✅ Main Content
  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
          Completed Deliveries ({parcels.length})
        </h2>
      </div>

      {/* Earnings Summary */}
      <div className="flex items-center gap-3 mb-10 bg-lime-50 border border-lime-200 p-4 rounded-lg">
        <FaMoneyBillWave className="text-lime-600 text-2xl" />
        <div>
          <p className="text-gray-700 font-semibold text-lg">Total Rider Earnings</p>
          <p className="text-2xl font-extrabold text-lime-700">
            ৳{totalEarnings.toFixed(2)}
          </p>
        </div>
      </div>

      {/* 🥧 Parcel Status Pie Chart */}
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl mb-10">
        <h3 className="text-lg font-semibold text-gray-800 text-center mb-6">
          Parcel Status Overview
        </h3>
        <div className="w-full max-w-sm mx-auto h-80">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* 📈 Earnings Line Chart */}
      {lineData.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl mb-10">
          <h3 className="text-lg font-semibold text-gray-800 text-center mb-6">
            Earnings Overview
          </h3>
          <div className="w-full h-80">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
      )}

      {/* Empty State */}
      {parcels.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-lg">
          <FaBoxOpen className="mx-auto text-6xl text-lime-400 mb-4" />
          <p className="text-lg font-medium">No completed deliveries yet.</p>
          <p className="text-sm">Deliver some parcels to see them here!</p>
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
                <th className="py-3 px-4 text-left">Delivered At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {parcels.map((p, index) => (
                <tr
                  key={p._id}
                  className="hover:bg-lime-50 transition duration-150"
                >
                  <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
                  <td className="py-3 px-4 font-mono text-sm text-gray-800">
                    {p.trackingId}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 truncate max-w-[150px]">
                    {p.title}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {p.receiverName}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-green-600 capitalize">
                    {p.status}
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-bold text-lime-600">
                    ৳{parseFloat(p.deliveryCost).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-500">
                    {new Date(p.updatedAt || p.createdAt).toLocaleDateString(
                      "en-BD",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}
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

export default CompletedDeliveries;
