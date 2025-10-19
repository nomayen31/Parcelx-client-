import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  // Handle form submission
  const onSubmit = (data) => {
    console.log('Form Data:', data);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[400px] bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600 mb-6">Login with Parcelx</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-green-400'
              }`}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pr-10 ${
                errors.password
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-green-400'
              }`}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {/* Eye Icon */}
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] cursor-pointer text-gray-600 hover:text-gray-800"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit + Forgot Password */}
          <div className="flex flex-col gap-3 mb-6">
            <a
              href="#"
              className="text-sm text-green-500 hover:underline text-right"
            >
              Forget Password?
            </a>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-md font-semibold hover:bg-green-600 focus:outline-none"
            >
              Login
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <Link to="/register" className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="text-green-500 hover:underline">
                Register
              </a>
            </Link>
          </div>

          {/* Google Login */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">Or</p>
            <button
              type="button"
              className="w-full flex items-center justify-center bg-gray-200 text-gray-700 py-3 rounded-md mt-3 hover:bg-gray-300"
            >
              <FaGoogle className="mr-3" /> Login with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
