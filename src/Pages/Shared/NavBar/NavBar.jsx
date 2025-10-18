import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiMenu, FiX } from "react-icons/fi";
import logo from "../../../../public/assets/logo.png";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-sm px-6 lg:px-16 py-4 rounded-2xl">
      <div className="flex justify-between items-center">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-8 h-8" />
          <span className="text-xl font-extrabold text-gray-800">Parcelx</span>
        </div>

        {/* Center: Navigation Links (hidden on mobile) */}
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
        </ul>

        {/* Right: Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/rider"
            className="px-4 py-2 rounded-full bg-lime-200 text-gray-800 font-medium hover:bg-lime-300 transition"
          >
            Be a Rider
          </Link>

          <Link
            to="/signin"
            className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Sign In
          </Link>

          <Link
            to="/signup"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-lime-400 text-gray-900 font-semibold hover:bg-lime-500 transition"
          >
            Sign Up
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-900 text-white">
              <FiArrowUpRight size={14} />
            </div>
          </Link>
        </div>

        {/* Hamburger Icon (mobile) */}
        <div className="lg:hidden flex items-center">
          <button onClick={toggleMenu} className="text-gray-700">
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden mt-4 space-y-4">
          <ul className="flex flex-col gap-4 text-gray-600 font-medium">
            <li>
              <Link to="/services" onClick={toggleMenu} className="hover:text-gray-900">
                Services
              </Link>
            </li>
            <li>
              <Link to="/coverage" onClick={toggleMenu} className="hover:text-gray-900">
                Coverage
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={toggleMenu} className="hover:text-gray-900">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/pricing" onClick={toggleMenu} className="hover:text-gray-900">
                Pricing
              </Link>
            </li>
          </ul>

          <div className="flex flex-col gap-3 mt-4">
            <Link
              to="/rider"
              onClick={toggleMenu}
              className="px-4 py-2 rounded-full bg-lime-200 text-gray-800 font-medium hover:bg-lime-300 transition"
            >
              Be a Rider
            </Link>

            <Link
              to="/signin"
              onClick={toggleMenu}
              className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Sign In
            </Link>

            <Link
              to="/signup"
              onClick={toggleMenu}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-lime-400 text-gray-900 font-semibold hover:bg-lime-500 transition"
            >
              Sign Up
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-900 text-white">
                <FiArrowUpRight size={14} />
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
