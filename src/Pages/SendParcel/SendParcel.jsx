import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import regionData from "../../../public/assets/warehouses.json";

const SendParcel = () => {
  const { register, handleSubmit, watch, reset } = useForm();
  const [cost, setCost] = useState(0);

  const type = watch("type");
  const senderRegion = watch("senderRegion");
  const receiverRegion = watch("receiverRegion");

  const uniqueRegions = [...new Set(regionData.map((item) => item.region))];

  const allDistricts = [...new Set(regionData.map((item) => item.district))];


  const getDistrictsByRegion = (region) => {
    if (!region) return allDistricts; // if region not selected, show all
    const districts = regionData
      .filter((item) => item.region === region)
      .map((item) => item.district);
    return [...new Set(districts)];
  };

  const calculateCost = (data) => {
    let base = data.type === "document" ? 50 : 100;
    if (data.type === "non-document" && data.weight) {
      base += parseFloat(data.weight) * 10;
    }
    if (data.senderRegion !== data.receiverRegion) base += 50;
    return base;
  };

  const onSubmit = (data) => {
    const deliveryCost = calculateCost(data);
    setCost(deliveryCost);

    toast.info(
      <div className="text-gray-800">
        <p className="font-semibold">Estimated Delivery Cost: ৳{deliveryCost}</p>
        <button
          onClick={() => handleConfirm(data)}
          className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded text-sm"
        >
          Confirm Booking
        </button>
      </div>,
      { autoClose: false }
    );
  };

  const handleConfirm = (data) => {
    const parcel = {
      ...data,
      deliveryCost: cost,
      creation_date: new Date().toISOString(),
    };
    console.log("Parcel saved:", parcel);
    toast.dismiss();
    toast.success("🎉 Parcel successfully booked!");
    reset();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg max-w-6xl mx-auto my-10 p-10 border border-gray-100">
      <ToastContainer />
      <h1 className="text-4xl font-semibold text-gray-800 mb-2">Add Parcel</h1>
      <p className="text-gray-500 mb-8">
        Enter your parcel details below to create a new booking.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
    
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
            Parcel Information
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="document"
                  {...register("type", { required: true })}
                />
                <span>Document</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="non-document"
                  {...register("type", { required: true })}
                />
                <span>Non-Document</span>
              </label>
            </div>

            <input
              type="text"
              placeholder="Describe Your Parcel"
              {...register("title", { required: "Describe Your Parcel required" })}
              className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-lime-400"
            />

            {type === "non-document" && (
              <input
                type="number"
                placeholder="Weight (KG)"
                step="0.1"
                {...register("weight")}
                className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-lime-400"
              />
            )}
          </div>
        </div>


        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
            Sender Information
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Sender Name"
              defaultValue="John Doe"
              {...register("senderName", { required: true })}
              className="border border-gray-300 rounded-md p-3"
            />
            <input
              type="text"
              placeholder="Sender Contact No"
              {...register("senderContact", { required: true })}
              className="border border-gray-300 rounded-md p-3"
            />


            <select
              {...register("senderRegion", { required: true })}
              className="border border-gray-300 rounded-md p-3"
            >
              <option value="">Select Region</option>
              {uniqueRegions.map((region, i) => (
                <option key={i} value={region}>
                  {region}
                </option>
              ))}
            </select>

   
            <select
              {...register("senderDistrict", { required: true })}
              className="border border-gray-300 rounded-md p-3"
            >
              <option value="">Select District</option>
              {getDistrictsByRegion(senderRegion).map((district, i) => (
                <option key={i} value={district}>
                  {district}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Address"
              {...register("senderAddress", { required: true })}
              className="border border-gray-300 rounded-md p-3"
            />
            <textarea
              placeholder="Pickup Instruction"
              {...register("pickupInstruction", { required: true })}
              className="border border-gray-300 rounded-md p-3 h-24"
            ></textarea>
          </div>
        </div>

    
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
            Receiver Information
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Receiver Name"
              {...register("receiverName", { required: true })}
              className="border border-gray-300 rounded-md p-3"
            />
            <input
              type="text"
              placeholder="Receiver Contact No"
              {...register("receiverContact", { required: true })}
              className="border border-gray-300 rounded-md p-3"
            />


            <select
              {...register("receiverRegion", { required: true })}
              className="border border-gray-300 rounded-md p-3"
            >
              <option value="">Select Region</option>
              {uniqueRegions.map((region, i) => (
                <option key={i} value={region}>
                  {region}
                </option>
              ))}
            </select>

            <select
              {...register("receiverDistrict", { required: true })}
              className="border border-gray-300 rounded-md p-3"
            >
              <option value="">Select District</option>
              {getDistrictsByRegion(receiverRegion).map((district, i) => (
                <option key={i} value={district}>
                  {district}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Receiver Address"
              {...register("receiverAddress", { required: true })}
              className="border border-gray-300 rounded-md p-3"
            />
            <textarea
              placeholder="Delivery Instruction"
              {...register("deliveryInstruction", { required: true })}
              className="border border-gray-300 rounded-md p-3 h-24"
            ></textarea>
          </div>
        </div>

        <p className="text-gray-500 text-sm mt-2">
          * Pickup Time: 4pm - 7pm Approx.
        </p>

        <button
          type="submit"
          className="bg-lime-400 hover:bg-lime-500 text-white font-semibold py-3 px-10 rounded-md shadow-md transition duration-300"
        >
          Proceed to Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default SendParcel;
