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
  FiUsers,
  FiClock,
  FiShield,
} from "react-icons/fi";
import { FaMotorcycle } from "react-icons/fa6";
import aboutImg from "../../public/assets/delivery-van.png"; 
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
      {/* 🧭 Sidebar */}
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
        </div>
      )}

      {/* 🧱 Main Content Area */}
      <main className="flex-1 lg:ml-64 p-8 min-h-screen bg-gray-50">
        <Outlet />

        {/* 🌟 About Section (Right Side Content Like AboutUs) */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-10 mt-8">
          

          {/* Mission, Vision, Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 text-center">
            <div className="p-6 border rounded-2xl shadow-sm hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-lime-600 mb-3">
                Our Mission
              </h3>
              <p className="text-gray-600">
                To deliver every parcel with care and accuracy, empowering
                businesses and individuals through efficient logistics.
              </p>
            </div>

            <div className="p-6 border rounded-2xl shadow-sm hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-lime-600 mb-3">
                Our Vision
              </h3>
              <p className="text-gray-600">
                To be Bangladesh’s most customer-focused, sustainable, and
                innovative logistics network.
              </p>
            </div>

            <div className="p-6 border rounded-2xl shadow-sm hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-lime-600 mb-3">
                Our Values
              </h3>
              <p className="text-gray-600">
                Reliability, speed, transparency, and sustainability guide every
                delivery we make.
              </p>
            </div>
          </div>

          {/* Why Choose ParcelX */}
          <div className="bg-gray-50 p-10 mt-14 rounded-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Why Choose <span className="text-lime-600">ParcelX?</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="p-6 bg-white border rounded-2xl shadow hover:shadow-lg transition">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  🚚 Real-Time Tracking
                </h4>
                <p className="text-gray-600">
                  Stay updated every moment — know exactly where your parcel is
                  and when it will arrive.
                </p>
              </div>

              <div className="p-6 bg-white border rounded-2xl shadow hover:shadow-lg transition">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  ⚡ Fast & Reliable
                </h4>
                <p className="text-gray-600">
                  Smart dispatching and optimized routes ensure on-time delivery
                  for every order.
                </p>
              </div>

              <div className="p-6 bg-white border rounded-2xl shadow hover:shadow-lg transition">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  💚 Eco-Friendly Delivery
                </h4>
                <p className="text-gray-600">
                  We minimize carbon footprint using sustainable logistics
                  solutions.
                </p>
              </div>
            </div>
          </div>

          {/* Call To Action */}
          <div className="text-center py-14 mt-12 bg-lime-100 rounded-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to simplify your deliveries?
            </h2>
            <p className="text-gray-700 mb-6">
              Join thousands of customers who trust ParcelX every day.
            </p>
            <Link
              to="/register"
              className="px-8 py-3 bg-lime-500 text-gray-900 font-semibold rounded-full hover:bg-lime-600 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
