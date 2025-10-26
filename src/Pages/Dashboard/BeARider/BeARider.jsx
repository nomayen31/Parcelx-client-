import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import riderImage from "../../../../public/assets/agent-pending.png"; // Import the image
import UseAuth from "../../../Hooks/UseAuth";
import regionData from "../../../../public/assets/warehouses.json"; // JSON data containing regions and districts
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const BeARider = () => {
  const { user } = UseAuth(); // Access user data from UseAuth hook
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const axiosSecure = UseAxiosSecure();

  useEffect(() => {
    // Extract unique regions from the JSON data
    const uniqueRegions = [...new Set(regionData.map((item) => item.region))];
    setRegions(uniqueRegions);
  }, []);

  useEffect(() => {
    // Automatically populate form with user's details if available
    if (user) {
      setValue("name", user.displayName || ""); // Set user's name
      setValue("email", user.email || ""); // Set user's email
    }
  }, [user, setValue]);

  const handleRegionChange = (e) => {
    const selectedRegion = e.target.value;
    // Find districts associated with the selected region
    const regionDistricts = regionData.filter(
      (item) => item.region === selectedRegion
    );
    setDistricts(regionDistricts.map((item) => item.district));
    setValue("district", ""); // Reset district field on region change
  };

  const onSubmit = async (data) => {
    // Add status and created_at to the data
    const riderData = {
      ...data,
      status: "Pending", // Example status, can be 'Active', 'Pending', etc.
      create_at: new Date().toISOString(),
    };

    try {
      // Send data to backend using axiosSecure
      const res = await axiosSecure.post("/riders", riderData);

      // Check if backend returned insertedId
      if (res.data.insertedId) {
        Swal.fire({
          title: "Success!",
          text: "Your registration has been submitted successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });

        // Reset the form after successful submission
        reset(); // Reset form fields after submission
      } else {
        throw new Error("Failed to insert data");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "There was an error submitting your registration. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error submitting rider data:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-lg p-12 max-w-8xl w-full flex gap-12">
        <div className="flex-1">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Be a Rider</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Enjoy fast, reliable parcel delivery with real-time tracking and
            zero hassle. From personal packages to business shipments — we
            deliver on time, every time.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Tell us about yourself
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  defaultValue={user?.displayName || ""} // Pre-fill with user display name
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Age
                </label>
                <input
                  type="text"
                  placeholder="Your Age"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  {...register("age", { required: "Age is required" })}
                />
                {errors.age && (
                  <p className="text-red-500 text-sm">{errors.age.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Region
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white appearance-none"
                  {...register("region", { required: "Region is required" })}
                  onChange={handleRegionChange}
                >
                  <option value="">Select your region</option>
                  {regions.map((region, index) => (
                    <option key={index} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                {errors.region && (
                  <p className="text-red-500 text-sm">
                    {errors.region.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white appearance-none"
                  {...register("district", {
                    required: "District is required",
                  })}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NID No
                </label>
                <input
                  type="text"
                  placeholder="NID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  {...register("nid", { required: "NID is required" })}
                />
                {errors.nid && (
                  <p className="text-red-500 text-sm">{errors.nid.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Which wire-house you want to work?
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white appearance-none"
                {...register("warehouse", {
                  required: "Wire-house selection is required",
                })}
              >
                <option value="">Select wire-house</option>
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
              className="w-full bg-lime-400 hover:bg-lime-500 text-gray-900 font-medium py-3.5 px-6 rounded-lg transition-colors duration-200"
            >
              Submit
            </button>
          </form>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <img src={riderImage} alt="Rider" className="w-full max-w-md" />
        </div>
      </div>
    </div>
  );
};

export default BeARider;
