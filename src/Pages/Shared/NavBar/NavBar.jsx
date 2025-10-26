import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiMenu, FiX } from "react-icons/fi";
import logo from "../../../../public/assets/logo.png";
import UseAuth from "../../../Hooks/UseAuth";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = UseAuth();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="bg-white shadow-sm px-6 lg:px-16 py-4 rounded-2xl">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to='/' className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-8 h-8" />
          <span className="text-xl font-extrabold text-gray-800">Parcelx</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-600">
          <li>
            <Link to="/services" className="hover:text-gray-900">
              Services
            </Link>
          </li>
          <li>
            <Link to="/coverage" className="hover:text-gray-900">
              Coverage
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-gray-900">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/pricing" className="hover:text-gray-900">
              Pricing
            </Link>
          </li>
          <li>
            <Link to="/sendParcel" className="hover:text-gray-900">
              Send Parcel
            </Link>
          </li>

          {/* ✅ Show Dashboard only when user is logged in */}
          {user && (
            <li>
              <Link to="/dashboard" className="hover:text-gray-900">
                Dashboard
              </Link>
            </li>
          )}
        </ul>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <div className="relative">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  referrerPolicy="no-referrer"
                  alt="User Profile"
                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                  onClick={toggleDropdown}
                />
              )}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white shadow-md rounded-md py-2 z-50">
                  <div className="px-3 py-2 text-sm text-gray-700">
                    {user.displayName}
                  </div>
                  <div className="px-3 py-2 text-xs text-gray-500">
                    {user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/rider"
                className="px-4 py-2 rounded-full bg-lime-200 text-gray-800 font-medium hover:bg-lime-300 transition"
              >
                Be a Rider
              </Link>

              <Link
                to="/login"
                className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-lime-400 text-gray-900 font-semibold hover:bg-lime-500 transition"
              >
                Register
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-900 text-white">
                  <FiArrowUpRight size={14} />
                </div>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center">
          <button onClick={toggleMenu} className="text-gray-700">
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="lg:hidden mt-4 space-y-4">
          <ul className="flex flex-col gap-4 text-gray-600 font-medium">
            <li>
              <Link
                to="/services"
                onClick={toggleMenu}
                className="hover:text-gray-900"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/coverage"
                onClick={toggleMenu}
                className="hover:text-gray-900"
              >
                Coverage
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                onClick={toggleMenu}
                className="hover:text-gray-900"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/pricing"
                onClick={toggleMenu}
                className="hover:text-gray-900"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                to="/sendParcel"
                onClick={toggleMenu}
                className="hover:text-gray-900"
              >
                Send Parcel
              </Link>
            </li>

            {/* ✅ Dashboard visible only if logged in */}
            {user && (
              <li>
                <Link
                  to="/dashboard"
                  onClick={toggleMenu}
                  className="hover:text-gray-900"
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            {user ? (
              <div className="relative">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    referrerPolicy="no-referrer"
                    alt="User Profile"
                    className="w-10 h-10 rounded-full object-cover cursor-pointer"
                    onClick={toggleDropdown}
                  />
                )}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white shadow-md rounded-md py-2 z-50">
                    <div className="px-3 py-2 text-sm text-gray-700">
                      {user.displayName}
                    </div>
                    <div className="px-3 py-2 text-xs text-gray-500">
                      {user.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100 rounded-md"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/rider"
                  onClick={toggleMenu}
                  className="px-4 py-2 rounded-full bg-lime-200 text-gray-800 font-medium hover:bg-lime-300 transition"
                >
                  Be a Rider
                </Link>

                <Link
                  to="/login"
                  onClick={toggleMenu}
                  className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={toggleMenu}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-lime-400 text-gray-900 font-semibold hover:bg-lime-500 transition"
                >
                  Register
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-900 text-white">
                    <FiArrowUpRight size={14} />
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
