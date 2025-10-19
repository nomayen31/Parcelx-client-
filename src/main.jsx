import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router/Router";
import "./index.css";
import AuthProvider from "./Contexts/AuthContext/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="font-urbanist max-w-[1850px] mx-auto">
      <AuthProvider>
        <Suspense fallback={<div className="p-6">Loading…</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
    </div>
  </React.StrictMode>
);
