import React from 'react';
import image from '../../public/assets/authImage.png';
import logo from '../../public/assets/logo.png';
import { Link, Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="flex ">
      {/* Left Side - Auth Section */}
      <div className="flex flex-col items-center justify-center p-8 w-full md:w-1/2">
        {/* Navbar */}
        <Link to='/' className="flex items-center w-full mb-6 gap-3">
          <img src={logo} alt="Logo" className="w-8 h-8" />
          <span className="text-xl font-extrabold text-gray-800">Parcelx</span>
        </Link>

        {/* Outlet for Dynamic Content */}
        <div className="w-[400px] flex flex-col items-start justify-center">
          <Outlet />
        </div>
      </div>

      {/* Right Side - Image Section */}
      <div className="hidden md:flex w-1/2 justify-center items-center">
        <img src={image} alt="Delivery Illustration" className="max-w-full h-auto" />
      </div>
    </div>
  );
};

export default AuthLayout;
