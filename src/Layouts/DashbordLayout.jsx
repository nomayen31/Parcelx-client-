import React, { useState } from "react";
import { NavLink, Link, Outlet } from "react-router-dom";
import { FiMenu, FiX, FiPackage, FiSend } from "react-icons/fi";

const DashbordLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* 🧭 Sidebar (visible on large screens) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-gray-900 text-white px-6 py-8 overflow-y-auto fixed inset-y-0 left-0">
        <h2 className="text-2xl font-bold mb-10">ParcelX Dashboard</h2>

        <nav className="flex flex-col gap-5">
          <NavLink
            to="/dashboard/myParcels"
            className={({ isActive }) =>
              `flex items-center gap-2 transition ${
                isActive
                  ? "text-lime-300 font-semibold"
                  : "hover:text-lime-300 text-gray-300"
              }`
            }
          >
            <FiPackage /> My Parcels
          </NavLink>

          <NavLink
            to="/sendParcel"
            className={({ isActive }) =>
              `flex items-center gap-2 transition ${
                isActive
                  ? "text-lime-300 font-semibold"
                  : "hover:text-lime-300 text-gray-300"
              }`
            }
          >
            <FiSend /> Send Parcel
          </NavLink>
        </nav>
      </aside>

      {/* 📱 Navbar (visible on small screens) */}
      <div className="lg:hidden bg-gray-900 text-white flex items-center justify-between p-4 shadow-md">
        <h2 className="text-xl font-semibold">ParcelX</h2>
        <button onClick={toggleMenu} aria-label="Toggle dashboard menu">
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* 📋 Mobile dropdown menu */}
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
            to="/sendParcel"
            onClick={() => setIsOpen(false)}
            className="hover:text-lime-300"
          >
            Send Parcel
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
