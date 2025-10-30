import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import UseAuth from "../../../../Hooks/UseAuth";
import axios from "axios";

const Registration = () => {
  const { createNewUser, signInWithGoogle, updateUser } = UseAuth();
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
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Password regex (strong and Firebase-safe)
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

  // ✅ Input handler (no validation here, only store)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Handle image upload
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
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formDataToSend
      );
      const imageUrl = response.data.data.url;
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    } catch (error) {
      console.error("❌ Image upload failed:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // clear any old error

    const password = formData.password.trim();

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      setLoading(true);

      // Create Firebase user
      const result = await createNewUser(formData.email, password);

      // Update Firebase profile
      await updateUser({
        displayName: formData.name,
        photoURL: formData.image,
      });

      // Save user to backend
      const userInfo = {
        uid: result.user.uid,
        name: formData.name,
        email: formData.email,
        image: formData.image,
        role: "user",
        createdAt: new Date().toISOString(),
        provider: "email",
      };

      await axios.post("https://parcelx-server.vercel.app/users", userInfo);

      alert("🎉 Registration successful!");
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);

      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please log in.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Please choose a stronger password.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithGoogle();
      const user = result.user;
      const userInfo = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        image: user.photoURL,
        role: "user",
        createdAt: new Date().toISOString(),
        provider: "google",
      };
      await axios.post("https://parcelx-server.vercel.app/users", userInfo);
      alert("Logged in with Google!");
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
        <p className="text-center text-gray-500 mb-6">Register with ParcelX</p>

        {/* Profile Image Upload */}
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

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-lime-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-lime-400"
            required
          />

          {/* Password field with eye toggle */}
          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-lime-400 pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <AiFillEyeInvisible className="text-2xl" />
              ) : (
                <AiFillEye className="text-2xl" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-lime-400 hover:bg-lime-500 text-white font-semibold py-3 rounded-md transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-lime-500 hover:underline">
            Login
          </Link>
        </p>

        <div className="flex items-center justify-center my-4">
          <span className="text-gray-400 text-sm">Or</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center border border-gray-300 rounded-md py-3 hover:bg-gray-100 transition"
        >
          <FcGoogle className="text-xl mr-2" />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Registration;
