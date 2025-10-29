import { createBrowserRouter } from "react-router-dom";
import MainLayouts from "../Layouts/MainLayouts";
import Home from "../Pages/Home/Home/Home";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Authentication/Login/Login";
import Registration from "../Pages/Authentication/Login/Registation/Registration";
import Coverage from "../Pages/coverage/Coverage";
import SendParcel from "../Pages/SendParcel/SendParcel";
import PrivateRoute from "../Routes/PrivateRoute";
import DashbordLayout from "../Layouts/DashbordLayout";
import MyParcels from "../Pages/Dashboard/MyParcels/MyParcels";
import Payment from "../Pages/Dashboard/Payment/Payment";
import PaymentHistory from "../Pages/Dashboard/PaymentHistory/PaymentHistory";
import TrackParcel from "../Pages/Dashboard/TrackParcel/TrackParcel";
import BeARider from "../Pages/Dashboard/BeARider/BeARider";
import PendingRiders from "../Pages/Dashboard/PendingRiders/PendingRiders";
import ActiveRiders from "../Pages/Dashboard/ActiveRiders/ActiveRiders";
import AboutUs from "../Pages/AboutUs/AboutUs";
import Pricing from "../Pages/Pricing/Pricing";
import Services from "../Pages/Services/Services";
import AdminManager from "../Pages/Dashboard/AdminManager/AdminManager";
import Forbidden from "../Pages/Forbidden/Forbidden";
import AdminRoute from "./AdminRoute";
import AssignRider from "../Pages/Dashboard/AssignRider/AssignRider";
import PendingDeliveries from "../Pages/Dashboard/PedingDeleveries/PedingDeleveries";

export const router = createBrowserRouter([
  // 🏠 MAIN WEBSITE ROUTES
  {
    path: "/",
    element: <MainLayouts />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "coverage",
        element: <Coverage />,
      },
      {
          path:'forbidden',
          element:<Forbidden/>
      },
      {
        path:'about',
        element:<AboutUs/>
      },
      {
        path:'pricing',
        element:<Pricing/>
      },
      {

        path:'services',
        element:<Services/>
      },
      {
        path: "sendParcel",
        element: (
          <PrivateRoute>
            <SendParcel />
          </PrivateRoute>
        ),
      },
     {
    path: "rider",
    element: (
      <PrivateRoute>
        <BeARider />
      </PrivateRoute>
    ),
  },
    ],
  },

  // 🔐 AUTHENTICATION ROUTES
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Registration />,
      },
    ],
  },

  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashbordLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "myParcels",
        element: <MyParcels />,
      },
      {
        path:'payment/:id',
        element:<Payment/>
      },
      {
        path:'paymenthistory',
        element:<PaymentHistory/>
      },
      {
          path:'pendingDeliveries',
          element:<PendingDeliveries/>
      },
      {
          path:'track',
          element:<TrackParcel/>
      },
      {
        path:'assign-rider',
        element:<AdminRoute><AssignRider/></AdminRoute>
      },
      {
          path:'pendingRiders',
          element:<AdminRoute><PendingRiders/></AdminRoute>
      }
      ,
      {
          path:'activeRiders',
          element:<AdminRoute><ActiveRiders/></AdminRoute>
      },
      {
        path:'admin-manager',
        element:<AdminRoute><AdminManager/></AdminRoute>
      }
    ],
  },
]);
