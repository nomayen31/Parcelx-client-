import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import UseAuth from "../../../../Hooks/UseAuth";
import axios from "axios";
import UseAxiosSecure from "../../../../Hooks/UseAxiosSecure";

const Registration = () => {
  const { createNewUser, signInWithGoogle, updateUser } = UseAuth();
  const axiosSecure = UseAxiosSecure();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Handle text field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Handle image upload to ImgBB
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const formDataToSend = new FormData();
    formDataToSend.append("image", file);

    try {
      setLoading(true);
      const apiKey = import.meta.env.VITE_IMAGE_UPLOAD_KEY;
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?expiration=600&key=${apiKey}`,
        formDataToSend
      );

      const imageUrl = response.data.data.url;
      console.log("✅ Uploaded Image URL:", imageUrl);

      setFormData((prev) => ({ ...prev, image: imageUrl }));
    } catch (error) {
      console.error("❌ Image upload failed:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Password validation
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Create Firebase Auth user
      const result = await createNewUser(formData.email, formData.password);
      console.log("🆕 User created:", result.user);

      // 2️⃣ Update Firebase profile
      await updateUser({
        displayName: formData.name,
        photoURL: formData.image,
      });
      console.log("✅ Firebase profile updated.");

      // 3️⃣ Save user data securely to your backend
      const userInfo = {
        name: formData.name,
        email: formData.email,
        image: formData.image,
        createdAt: new Date(),
        role: "user",
      };

      const res = await axiosSecure.post("/users", userInfo);
      console.log("✅ User saved to DB:", res.data);

      alert("🎉 Registration successful!");
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google login
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      console.log("✅ Google Sign-In:", result.user);
      alert("Logged in successfully with Google!");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ JSX UI
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-[400px] bg-white p-8 rounded-lg shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create an Account
        </h2>
        <p className="text-center text-gray-500 mb-6">Register with ParcelX</p>

        {/* ✅ Profile Image Upload */}
        <div className="flex justify-center mb-4">
          <label htmlFor="profileImage" className="relative cursor-pointer group">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="w-20 h-20 object-cover rounded-full border-4 border-lime-400 shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300 group-hover:border-lime-400 transition">
                <FaUserCircle className="text-5xl text-gray-400" />
              </div>
            )}
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <span className="absolute bottom-0 right-0 bg-lime-400 text-white text-xs font-semibold rounded-full px-2 py-0.5">
              Upload
            </span>
          </label>
        </div>

        {error && (
          <p className="text-red-500 text-center text-sm mb-4">{error}</p>
        )}

        {/* ✅ Registration Form */}
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
