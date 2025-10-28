import React from "react";
import { Link } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";

const Forbidden = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-6">
      <FiAlertTriangle className="text-red-500 text-6xl mb-4" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">403 Forbidden</h1>
      <p className="text-gray-600 mb-6">
        You don’t have permission to access this page.  
        Please contact an administrator if you believe this is a mistake.
      </p>
      <Link
        to="/"
        className="px-5 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default Forbidden;
