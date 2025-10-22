import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import regionData from "../../../public/assets/warehouses.json";
import UseAuth from "../../Hooks/UseAuth";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";

const SendParcel = () => {
  const { register, handleSubmit, watch, reset } = useForm();
  const [cost, setCost] = useState(0);
  const { user } = UseAuth();
  const axiosSecure = UseAxiosSecure();

  const type = watch("type");
  const senderRegion = watch("senderRegion");
  const receiverRegion = watch("receiverRegion");

  const generateTrackingId = () => {
    const prefix = "PX";
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${randomPart}`;
  };

  // Extract unique regions and districts
  const uniqueRegions = [...new Set(regionData.map((item) => item.region))];
  const allDistricts = [...new Set(regionData.map((item) => item.district))];

  // Get districts dynamically based on region
  const getDistrictsByRegion = (region) => {
    if (!region) return allDistricts;
    const districts = regionData
      .filter((item) => item.region === region)
      .map((item) => item.district);
    return [...new Set(districts)];
  };

  // 🧮 Pricing Logic
  const calculateCost = (data) => {
    let cost = 0;
    const isWithinCity = data.senderRegion === data.receiverRegion;

    if (data.type === "document") {
      cost = isWithinCity ? 60 : 80;
    } else if (data.type === "non-document") {
      const weight = parseFloat(data.weight) || 0;
      if (weight <= 3) {
        cost = isWithinCity ? 110 : 150;
      } else {
        cost = isWithinCity ? 110 : 150;
        const extraKg = weight - 3;
        cost += extraKg * 40;
        if (!isWithinCity) cost += 40;
      }
    }
    return cost;
  };

  // 🧾 On form submission
  const onSubmit = (data) => {
    const deliveryCost = calculateCost(data);
    setCost(deliveryCost);

    const isWithinCity = data.senderRegion === data.receiverRegion;
    const weight = parseFloat(data.weight) || 0;
    const extraKg = weight > 3 ? weight - 3 : 0;

    Swal.fire({
      title: "📦 Delivery Cost Breakdown",
      html: `
        <div style="text-align:left; font-size:15px;">
          <p><strong>Parcel Type:</strong> ${data.type === "document" ? "Document" : "Non-Document"}</p>
          ${data.type === "non-document" ? `<p><strong>Weight:</strong> ${weight} kg</p>` : ""}
          <p><strong>From:</strong> ${data.senderRegion || "N/A"}</p>
          <p><strong>To:</strong> ${data.receiverRegion || "N/A"}</p>
          <hr style="margin:10px 0;">
          ${
            data.type === "document"
              ? `<p>Base Rate (${isWithinCity ? "Within City" : "Outside City"}): ৳${isWithinCity ? 60 : 80}</p>`
              : `<p>Base Rate (Up to 3kg): ৳${isWithinCity ? 110 : 150}</p>
                 ${weight > 3 ? `<p>Extra Weight Charge: ৳${extraKg * 40}</p>` : ""}
                 ${!isWithinCity && weight > 3 ? `<p>Outside City Extra: ৳40</p>` : ""}`
          }
          <hr style="margin:10px 0;">
          <h3><strong>Total Cost:</strong> ৳${deliveryCost}</h3>
        </div>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "✅ Confirm Booking",
      cancelButtonText: "❌ Cancel",
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#d33",
      width: 450,
      background: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        handleConfirm(data, deliveryCost);
      } else {
        Swal.fire({
          title: "❌ Booking Cancelled",
          text: "You have cancelled the parcel booking.",
          icon: "warning",
          timer: 1800,
          showConfirmButton: false,
        });
      }
    });
  };

  // ✅ Confirm booking and save
  const handleConfirm = async (data, deliveryCost) => {
    const now = new Date();
    const trackingId = generateTrackingId();

    const parcel = {
      trackingId,
      type: data.type,
      title: data.title,
      weight: data.type === "non-document" ? (data.weight || null) : null,
      senderName: data.senderName,
      senderContact: data.senderContact,
      senderRegion: data.senderRegion,
      senderDistrict: data.senderDistrict,
      senderAddress: data.senderAddress,
      receiverName: data.receiverName,
      receiverContact: data.receiverContact,
      receiverRegion: data.receiverRegion,
      receiverDistrict: data.receiverDistrict,
      receiverAddress: data.receiverAddress,
      pickupInstruction: data.pickupInstruction,
      deliveryInstruction: data.deliveryInstruction,
      deliveryCost,
      createdByEmail: user?.email,
      createdAt: now.toISOString(),
      createdAtReadable: now.toLocaleString("en-BD", {
        timeZone: "Asia/Dhaka",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      status: "Pending",
      paymentStatus: "Unpaid",
      deliveryStatusHistory: [{ status: "Pending", time: now.toISOString() }],
    };

    try {
      const res = await axiosSecure.post("/parcels", parcel);
      // Your server responds with: { success, message, data: { insertedId, ... } }
      const insertedId = res?.data?.data?.insertedId;

      if (insertedId) {
        await Swal.fire({
          icon: "success",
          title: "🎉 Booking Confirmed!",
          html: `
            <div style="text-align:left">
              <p>Your parcel has been successfully booked.</p>
              <p><strong>Tracking ID:</strong></p>
              <p><code style="user-select:all">${trackingId}</code></p>
              <p style="margin-top:8px"><strong>Total Cost:</strong> ৳${deliveryCost}</p>
            </div>
          `,
          confirmButtonColor: "#16a34a",
        });
        reset();
      } else {
        await Swal.fire({
          icon: "error",
          title: "Save Failed",
          text: "We couldn't save your parcel. Please try again.",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      const msg = error?.response?.data?.message || error.message || "Failed to save parcel.";
      await Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: msg,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg max-w-6xl mx-auto my-10 p-10 border border-gray-100">
      <h1 className="text-4xl font-semibold text-gray-800 mb-2">Add Parcel</h1>
      <p className="text-gray-500 mb-8">
        Enter your parcel details below to create a new booking.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* Parcel Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
            Parcel Information
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input type="radio" value="document" {...register("type", { required: true })} />
                <span>Document</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" value="non-document" {...register("type", { required: true })} />
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

        {/* Sender Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
            Sender Information
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Sender Name"
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

        {/* Receiver Information */}
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
