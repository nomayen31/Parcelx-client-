import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import UseAuth from '../../../Hooks/UseAuth';


const Login = () => {
  const { signInUser, signInWithGoogle } = UseAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setError('');
    try {
      const result = await signInUser(data.email, data.password);
      console.log('Login Success:', result.user);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const result = await signInWithGoogle();
      console.log('Google Sign-In Success:', result.user);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-[400px] bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600 mb-6">Login with Parcelx</p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-green-400'
              }`}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pr-10 ${
                errors.password ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-green-400'
              }`}
              {...register('password', {
                required: 'Password is required',
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/,
                  message:
                    'Password must be at least 8 chars, 1 uppercase, 1 lowercase, 1 number & 1 special char',
                },
              })}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] cursor-pointer text-gray-600 hover:text-gray-800"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-md font-semibold hover:bg-green-600 focus:outline-none mb-4"
          >
            Login
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 mb-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-green-500 hover:underline">
            Register
          </Link>
        </div>

        {/* Google Login */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">Or</p>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center bg-gray-200 text-gray-700 py-3 rounded-md mt-3 hover:bg-gray-300"
          >
            <FaGoogle className="mr-3" /> Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
