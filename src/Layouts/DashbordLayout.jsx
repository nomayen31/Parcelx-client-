import React, { useState } from "react";
import { NavLink, Link, Outlet } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiPackage,
  FiSend,
  FiCreditCard,
  FiUser,
  FiMapPin,
  FiUsers, // Active Riders
  FiClock, // Pending Riders
  FiShield, // Admin Manager
} from "react-icons/fi";
import { FaMotorcycle } from "react-icons/fa6";
import useUserRole from "../Hooks/UseUserRole";

const DashboardLayout = () => {
  const { role, roleLoading } = useUserRole();
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-2 px-2 py-1.5 rounded-md transition ${
      isActive
        ? "text-lime-300 font-semibold bg-gray-800"
        : "hover:text-lime-300 text-gray-300 hover:bg-gray-800"
    }`;

  // 🌀 Loading Spinner (while role is being determined)
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

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* 🧭 Sidebar (Desktop) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-gray-900 text-white px-6 py-8 overflow-y-auto fixed inset-y-0 left-0">
        <h2 className="text-2xl font-bold mb-10">ParcelX Dashboard</h2>

        <nav className="flex flex-col gap-4">
          {/* 🧱 Common Links (Visible to All Roles) */}
          <NavLink to="/dashboard/myParcels" className={navItemClass}>
            <FiPackage /> My Parcels
          </NavLink>

          <NavLink to="/dashboard/paymenthistory" className={navItemClass}>
            <FiCreditCard /> Payment History
          </NavLink>

          <NavLink to="/dashboard/track" className={navItemClass}>
            <FiMapPin /> Track A Package
          </NavLink>

          <NavLink to="/dashboard/profile" className={navItemClass}>
            <FiUser /> Profile
          </NavLink>

          <NavLink to="/sendParcel" className={navItemClass}>
            <FiSend /> Send Parcel
          </NavLink>

          {/* 🛡️ ADMIN LINKS */}
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

          {/* 🏍️ RIDER LINKS */}
          {role === "rider" && (
            <>
              <NavLink to="/dashboard/rider-tasks" className={navItemClass}>
                <FiUsers /> Rider Tasks
              </NavLink>
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

      {/* 📱 Mobile Navbar */}
      <div className="lg:hidden bg-gray-900 text-white flex items-center justify-between p-4 shadow-md">
        <h2 className="text-xl font-semibold">ParcelX</h2>
        <button onClick={toggleMenu} aria-label="Toggle dashboard menu">
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* 📱 Mobile Dropdown Menu */}
      {isOpen && (
        <div className="lg:hidden bg-gray-800 text-white flex flex-col items-start p-4 space-y-3">
          {/* Common Links */}
          <Link to="/dashboard/myParcels" onClick={() => setIsOpen(false)}>
            My Parcels
          </Link>
          <Link to="/dashboard/paymenthistory" onClick={() => setIsOpen(false)}>
            Payment History
          </Link>
          <Link to="/dashboard/track" onClick={() => setIsOpen(false)}>
            Track A Package
          </Link>
          <Link to="/dashboard/profile" onClick={() => setIsOpen(false)}>
            Profile
          </Link>
          <Link to="/sendParcel" onClick={() => setIsOpen(false)}>
            Send Parcel
          </Link>

          {/* ✅ Admin-only (Mobile) */}
          {role === "admin" && (
            <>
              <Link
                to="/dashboard/activeRiders"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2"
              >
                <FiUsers /> Active Riders
              </Link>
              <Link
                to="/dashboard/assign-rider"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2"
              >
                <FaMotorcycle /> Assign Rider
              </Link>
              <Link
                to="/dashboard/pendingRiders"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2"
              >
                <FiClock /> Pending Riders
              </Link>
              <Link
                to="/dashboard/admin-manager"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2"
              >
                <FiShield /> Admin Manager
              </Link>
            </>
          )}

          {/* ✅ Rider-only (Mobile) */}
          {role === "rider" && (
            <>
              <Link
                to="/dashboard/rider-tasks"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2"
              >
                <FiUsers /> Rider Tasks
              </Link>
              <Link
                to="/dashboard/pendingDeliveries"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2"
              >
                <FiClock /> Pending Deliveries
              </Link>
              <NavLink
                to="/dashboard/complited-deliveries"
                className={navItemClass}
              >
                <FiPackage /> Completed Deliveries
              </NavLink>
            </>
          )}
        </div>
      )}

      {/* 🧱 Main Content */}
      <main className="flex-1 lg:ml-64 p-6 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
