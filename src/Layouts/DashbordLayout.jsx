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
  FiUsers, // Icon for Active Riders
  FiClock, // Icon for Pending Riders
} from "react-icons/fi";

const DashbordLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-2 px-2 py-1.5 rounded-md transition ${
      isActive
        ? "text-lime-300 font-semibold bg-gray-800"
        : "hover:text-lime-300 text-gray-300 hover:bg-gray-800"
    }`;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* 🧭 Sidebar (desktop) */}
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

          <NavLink to="/dashboard/profile" className={navItemClass}>
            <FiUser /> Profile
          </NavLink>

          <NavLink to="/sendParcel" className={navItemClass}>
            <FiSend /> Send Parcel
          </NavLink>

          {/* New Links */}
          <NavLink to="/dashboard/activeRiders" className={navItemClass}>
            <FiUsers /> Active Riders
          </NavLink>

          <NavLink to="/dashboard/pendingRiders" className={navItemClass}>
            <FiClock /> Pending Riders
          </NavLink>
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
          <Link
            to="/dashboard/myParcels"
            onClick={() => setIsOpen(false)}
            className="hover:text-lime-300"
          >
            My Parcels
          </Link>
          <Link
            to="/dashboard/paymenthistory"
            onClick={() => setIsOpen(false)}
            className="hover:text-lime-300"
          >
            Payment History
          </Link>
          <Link
            to="/dashboard/track"
            onClick={() => setIsOpen(false)}
            className="hover:text-lime-300"
          >
            Track A Package
          </Link>
          <Link
            to="/dashboard/profile"
            onClick={() => setIsOpen(false)}
            className="hover:text-lime-300"
          >
            Profile
          </Link>
          <Link
            to="/sendParcel"
            onClick={() => setIsOpen(false)}
            className="hover:text-lime-300"
          >
            Send Parcel
          </Link>

          {/* New Links in Mobile Menu */}
          <Link
            to="/dashboard/activeRiders"
            onClick={() => setIsOpen(false)}
            className="hover:text-lime-300"
          >
            <FiUsers /> Active Riders
          </Link>

          <Link
            to="/dashboard/pendingRiders"
            onClick={() => setIsOpen(false)}
            className="hover:text-lime-300"
          >
            <FiClock /> Pending Riders
          </Link>
        </div>
      )}

      {/* 🧱 Main Content */}
      <main className="flex-1 lg:ml-64 p-6 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default DashbordLayout;
