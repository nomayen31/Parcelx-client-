import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import riderImage from "../../../../public/assets/agent-pending.png";
import UseAuth from "../../../Hooks/UseAuth";
import regionData from "../../../../public/assets/warehouses.json";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const BeARider = () => {
  const { user } = UseAuth();
  const axiosSecure = UseAxiosSecure();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Populate regions
  useEffect(() => {
    const uniqueRegions = [...new Set(regionData.map((item) => item.region))];
    setRegions(uniqueRegions);
  }, []);

  // ✅ Autofill user data
  useEffect(() => {
    if (user) {
      setValue("name", user.displayName || "");
      setValue("email", user.email || "");
    }
  }, [user, setValue]);

  // ✅ Update districts on region change
  const handleRegionChange = (e) => {
    const selectedRegion = e.target.value;
    const regionDistricts = regionData.filter(
      (item) => item.region === selectedRegion
    );
    setDistricts(regionDistricts.map((item) => item.district));
    setValue("district", "");
  };

  // ✅ Submit rider registration
  const onSubmit = async (data) => {
    const riderData = {
      ...data,
      status: "Pending",
      create_at: new Date().toISOString(),
    };

    try {
      setLoading(true);

      // 🧠 Check if rider already applied
      const checkRes = await axiosSecure.get("/riders/pending");
      const existingRider = checkRes.data.find(
        (r) => r.email === riderData.email
      );
      if (existingRider) {
        Swal.fire({
          title: "Already Applied",
          text: "You have already submitted a rider request. Please wait for admin approval.",
          icon: "info",
          confirmButtonText: "OK",
        });
        setLoading(false);
        return;
      }

      // 🧾 Submit to backend
      const res = await axiosSecure.post("/riders", riderData);

      // 🧩 FIXED: Check nested response
      if (res.data.data?.insertedId) {
        Swal.fire({
          title: "Success!",
          text: "Your rider registration has been submitted successfully!",
          icon: "success",
          confirmButtonColor: "#16a34a",
        });
        reset();
      } else {
        throw new Error("Failed to insert data");
      }
    } catch (error) {
      console.error("Error submitting rider data:", error);
      Swal.fire({
        title: "Error!",
        text:
          error?.response?.data?.message ||
          "There was an error submitting your registration. Please try again.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-lg p-12 max-w-8xl w-full flex gap-12">
        {/* Left Side: Form */}
        <div className="flex-1">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Be a Rider</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Join our delivery team! Reliable, fast, and flexible work with real-time tracking and great rewards.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Tell us about yourself
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  defaultValue={user?.displayName || ""}
                  {...register("name", { required: "Name is required" })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Age
                </label>
                <input
                  type="number"
                  placeholder="Your Age"
                  {...register("age", {
                    required: "Age is required",
                    min: { value: 18, message: "Minimum age is 18" },
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                {errors.age && (
                  <p className="text-red-500 text-sm">{errors.age.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  placeholder="Your Email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Region */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Region
                </label>
                <select
                  {...register("region", { required: "Region is required" })}
                  onChange={handleRegionChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                >
                  <option value="">Select your region</option>
                  {regions.map((region, index) => (
                    <option key={index} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                {errors.region && (
                  <p className="text-red-500 text-sm">{errors.region.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* District */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <select
                  {...register("district", {
                    required: "District is required",
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                >
                  <option value="">Select your district</option>
                  {districts.map((district, index) => (
                    <option key={index} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="text-red-500 text-sm">
                    {errors.district.message}
                  </p>
                )}
              </div>

              {/* NID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NID No
                </label>
                <input
                  type="text"
                  placeholder="NID"
                  {...register("nid", { required: "NID is required" })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                {errors.nid && (
                  <p className="text-red-500 text-sm">{errors.nid.message}</p>
                )}
              </div>
            </div>

            {/* Warehouse */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Which warehouse you want to work in?
              </label>
              <select
                {...register("warehouse", {
                  required: "Warehouse selection is required",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
              >
                <option value="">Select warehouse</option>
                <option value="warehouse1">Warehouse 1</option>
                <option value="warehouse2">Warehouse 2</option>
              </select>
              {errors.warehouse && (
                <p className="text-red-500 text-sm">
                  {errors.warehouse.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-medium py-3.5 px-6 rounded-lg transition-colors duration-200 ${
                loading
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-lime-400 hover:bg-lime-500 text-gray-900"
              }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>

        {/* Right Side: Illustration */}
        <div className="flex-1 flex items-center justify-center">
          <img src={riderImage} alt="Rider" className="w-full max-w-md" />
        </div>
      </div>
    </div>
  );
};

export default BeARider;
