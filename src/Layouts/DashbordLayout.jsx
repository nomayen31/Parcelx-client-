import React, { useState } from "react";
import { NavLink, Link, Outlet, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiPackage,
  FiSend,
  FiCreditCard,
  FiMapPin,
  FiUsers,
  FiClock,
  FiShield,
  FiTrendingUp,
  FiBarChart2,
  FiCheckCircle,
} from "react-icons/fi";
import { FaMotorcycle } from "react-icons/fa6";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import aboutImg from "../../public/assets/delivery-van.png";
import useUserRole from "../Hooks/UseUserRole";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardLayout = () => {
  const { role, roleLoading } = useUserRole();
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const location = useLocation();

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-2 px-2 py-1.5 rounded-md transition ${
      isActive
        ? "text-lime-300 font-semibold bg-gray-800"
        : "hover:text-lime-300 text-gray-300 hover:bg-gray-800"
    }`;

  if (roleLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
        <p className="text-lg text-gray-600 font-semibold">
          Loading dashboard...
        </p>
      </div>
    );
  }

  // 🧩 ROLE-BASED RIGHT CONTENT
  const renderRightSideContent = () => {
    if (role === "admin") {
      return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 mt-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            👑 Admin Dashboard Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 bg-lime-50 border rounded-2xl shadow-sm hover:shadow-md transition">
              <FiUsers className="text-lime-600 text-3xl mb-3" />
              <h3 className="text-lg font-semibold text-gray-800">
                Active Riders
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">25</p>
            </div>

            <div className="p-6 bg-lime-50 border rounded-2xl shadow-sm hover:shadow-md transition">
              <FiPackage className="text-lime-600 text-3xl mb-3" />
              <h3 className="text-lg font-semibold text-gray-800">
                Total Parcels
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">340</p>
            </div>

            <div className="p-6 bg-lime-50 border rounded-2xl shadow-sm hover:shadow-md transition">
              <FiTrendingUp className="text-lime-600 text-3xl mb-3" />
              <h3 className="text-lg font-semibold text-gray-800">Revenue</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">৳ 85,200</p>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl border text-center">
            <FiBarChart2 className="text-lime-600 text-4xl mx-auto mb-3" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Analytics Overview
            </h3>
            <p className="text-gray-600">
              Monitor parcel trends, rider performance, and customer engagement
              in real-time.
            </p>
          </div>
        </div>
      );
    }

    if (role === "rider") {
      return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 mt-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            🏍️ Welcome Rider
          </h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Manage your assigned deliveries, track status updates, and mark
            parcels as completed. Keep up your delivery performance for faster
            earnings!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-lime-50 border rounded-2xl shadow-sm">
              <FiClock className="text-lime-600 text-2xl mb-3" />
              <h4 className="font-semibold text-gray-800">Pending Deliveries</h4>
              <p className="text-gray-600">Check parcels waiting for dispatch.</p>
            </div>
            <div className="p-6 bg-lime-50 border rounded-2xl shadow-sm">
              <FiCheckCircle className="text-lime-600 text-2xl mb-3" />
              <h4 className="font-semibold text-gray-800">Completed Orders</h4>
              <p className="text-gray-600">View all your completed deliveries.</p>
            </div>
            <div className="p-6 bg-lime-50 border rounded-2xl shadow-sm">
              <FiTrendingUp className="text-lime-600 text-2xl mb-3" />
              <h4 className="font-semibold text-gray-800">Earning Summary</h4>
              <p className="text-gray-600">
                Track your weekly and monthly payouts.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // ✅ User Dashboard: Parcel Statistics + Pie Chart
    const parcelData = {
      delivered: 120,
      inTransit: 45,
      notCollected: 20,
      assignedToRider: 30,
    };

    const pieData = {
      labels: ["Delivered", "In Transit", "Not Collected", "Assigned to Rider"],
      datasets: [
        {
          data: [
            parcelData.delivered,
            parcelData.inTransit,
            parcelData.notCollected,
            parcelData.assignedToRider,
          ],
          backgroundColor: [
            "#84cc16",
            "#facc15",
            "#f87171",
            "#60a5fa",
          ],
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    };

    const pieOptions = {
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#374151", font: { size: 14 } },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };

    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-10 mt-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          📦 Your Parcel Overview
        </h1>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center mb-10">
          <div className="p-4 bg-lime-50 rounded-xl border">
            <h3 className="text-lg font-semibold text-gray-700">Delivered</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {parcelData.delivered}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-xl border">
            <h3 className="text-lg font-semibold text-gray-700">In Transit</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {parcelData.inTransit}
            </p>
          </div>
          <div className="p-4 bg-red-50 rounded-xl border">
            <h3 className="text-lg font-semibold text-gray-700">Not Collected</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {parcelData.notCollected}
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border">
            <h3 className="text-lg font-semibold text-gray-700">
              Assigned to Rider
            </h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {parcelData.assignedToRider}
            </p>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="w-full h-80 max-w-lg mx-auto">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-gray-900 text-white px-6 py-8 overflow-y-auto fixed inset-y-0 left-0">
        <h2 className="text-2xl font-bold mb-10">ParcelX Dashboard</h2>

        <nav className="flex flex-col gap-4">
          <NavLink to="/dashboard/myParcels" className={navItemClass}>
            <FiPackage /> My Parcels
          </NavLink>
          <NavLink to="/dashboard/paymenthistory" className={navItemClass}>
            <FiCreditCard /> Payment History
          </NavLink>
          <NavLink to="/dashboard/track" className={navItemClass}>
            <FiMapPin /> Track A Package
          </NavLink>
          <NavLink to="/sendParcel" className={navItemClass}>
            <FiSend /> Send Parcel
          </NavLink>

          {role === "admin" && (
            <>
              <NavLink to="/dashboard/activeRiders" className={navItemClass}>
                <FiUsers /> Active Riders
              </NavLink>
              <NavLink to="/dashboard/assign-rider" className={navItemClass}>
                <FaMotorcycle /> Assign Rider
              </NavLink>
              <NavLink to="/dashboard/pendingRiders" className={navItemClass}>
                <FiClock /> Pending Riders
              </NavLink>
              <NavLink to="/dashboard/admin-manager" className={navItemClass}>
                <FiShield /> Admin Manager
              </NavLink>
            </>
          )}

          {role === "rider" && (
            <>
              <NavLink
                to="/dashboard/pendingDeliveries"
                className={navItemClass}
              >
                <FiClock /> Pending Deliveries
              </NavLink>
              <NavLink
                to="/dashboard/complited-deliveries"
                className={navItemClass}
              >
                <FiPackage /> Completed Deliveries
              </NavLink>
            </>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-8 min-h-screen bg-gray-50">
        <Outlet />
        {/* Only show this content on /dashboard */}
        {location.pathname === "/dashboard" && renderRightSideContent()}
      </main>
    </div>
  );
};

export default DashboardLayout;
