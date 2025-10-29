import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useUserRole from "../Hooks/UseUserRole";
import UseAuth from "../Hooks/UseAuth";

const RiderRoute = ({ children }) => {
  const { user, loading: authLoading } = UseAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  // 🌀 Show loader while auth or role is loading
  if (authLoading || roleLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
        <p className="text-lg text-gray-600 font-semibold">
          Checking rider access...
        </p>
      </div>
    );
  }

  // 🚫 If not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🚫 If logged in but not a rider → redirect to forbidden page
  if (role !== "rider") {
    return <Navigate to="/forbidden" replace />;
  }

  // ✅ Authorized rider → render child component
  return children;
};

export default RiderRoute;
