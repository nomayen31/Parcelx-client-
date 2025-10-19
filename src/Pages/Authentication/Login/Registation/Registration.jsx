import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import UseAuth from "../../../../Hooks/UseAuth";
const Registration = () => {
  const { createNewUser, signInWithGoogle } = UseAuth(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    setLoading(true);
    try {
      const result = await createNewUser(formData.email, formData.password);
      console.log("User Registered:", result.user);
      alert("Registration successful!");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithGoogle();
      console.log("Google Sign-In Success:", result.user);
      alert("Logged in with Google successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-[400px] bg-white p-8 rounded-lg shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create an Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Register with Parcelx
        </p>

        <div className="flex justify-center mb-4">
          <FaUserCircle className="text-5xl text-gray-400 bg-gray-100 p-2 rounded-full" />
        </div>

        {error && (
          <p className="text-red-500 text-center text-sm mb-4">{error}</p>
        )}

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
            disabled={loading}
            className={`w-full bg-lime-400 hover:bg-lime-500 text-white font-semibold py-3 rounded-md transition duration-300 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : "Register"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-lime-500 hover:underline cursor-pointer"
          >
            Login
          </Link>
        </div>

        <div className="flex items-center justify-center my-4">
          <span className="text-gray-400 text-sm">Or</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center border border-gray-300 rounded-md py-3 hover:bg-gray-100 transition duration-300"
        >
          <FcGoogle className="text-xl mr-2" />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Registration;