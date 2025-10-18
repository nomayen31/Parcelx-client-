import { createBrowserRouter } from "react-router-dom";
import MainLayouts from "../Layouts/MainLayouts";
import Home from "../Pages/Home/Home/Home";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Authentication/Login/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayouts />,
    children: [
      {
        index: true, 
        element: <Home />, 
      },
    ],
  },
  {
    path:'/',
    element:<AuthLayout/>,
    children:[
      {
        path:'/login',
        element:<Login/>
      }
    ]
  }
]);
