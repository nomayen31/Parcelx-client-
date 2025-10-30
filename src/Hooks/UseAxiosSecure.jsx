import { useEffect } from "react";
import axios from "axios";
import UseAuth from "./UseAuth";

const axiosSecure = axios.create({
  baseURL: "https://parcelx-server.vercel.app/",
});

const UseAxiosSecure = () => {
  const { user } = UseAuth(); // ✅ call hook properly

  useEffect(() => {
    const interceptor = axiosSecure.interceptors.request.use(
      (config) => {
        if (user?.accessToken) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => axiosSecure.interceptors.request.eject(interceptor);
  }, [user]);

  return axiosSecure;
};

export default UseAxiosSecure;
