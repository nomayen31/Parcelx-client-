import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router/Router";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="font-urbanist max-w-[1850px] mx-auto">
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>
);
