import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

const Registration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // You can add API logic here
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-[400px] bg-white p-8 rounded-lg shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create an Account
        </h2>
        <p className="text-center text-gray-500 mb-6">Register with Parcelx</p>

        <div className="flex justify-center mb-4">
          <FaUserCircle className="text-5xl text-gray-400 bg-gray-100 p-2 rounded-full" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400"
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400"
              required
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-lime-400 hover:bg-lime-500 text-white font-semibold py-3 rounded-md transition duration-300"
          >
            Register
          </button>
        </form>

        <Link to='/login' className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <span className="text-lime-500 hover:underline cursor-pointer">
            Login
          </span>
        </Link>

        <div className="flex items-center justify-center my-4">
          <span className="text-gray-400 text-sm">Or</span>
        </div>

        <button className="w-full flex items-center justify-center border border-gray-300 rounded-md py-3 hover:bg-gray-100 transition duration-300">
          <FcGoogle className="text-xl mr-2" />
          Register with Google
        </button>
      </div>
    </div>
  );
};

export default Registration;
