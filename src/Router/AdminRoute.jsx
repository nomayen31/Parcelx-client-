import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useUserRole from "../Hooks/UseUserRole";
import UseAuth from "../Hooks/UseAuth";

const AdminRoute = ({ children }) => {
  const { user, loading: authLoading } = UseAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  // 🌀 Show loading spinner while verifying auth or role
  if (authLoading || roleLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
        <p className="text-lg text-gray-600 font-semibold">
          Checking admin access...
        </p>
      </div>
    );
  }

  // ❌ Not logged in → redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ❌ Not admin → redirect to unauthorized page
  if (role !== "admin") {
    return <Navigate to="/forbidden" replace />;
  }

  // ✅ Access granted → render the child component
  return children;
};

export default AdminRoute;
