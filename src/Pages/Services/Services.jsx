import React from "react";
import { Link } from "react-router-dom";
import { FiPackage, FiTruck, FiMapPin, FiClock, FiTrendingUp, FiShield } from "react-icons/fi";

const Services = () => {
  return (
    <section className="bg-white text-gray-800">
      {/* Hero Section */}
      <div className="bg-lime-50 py-20 px-6 lg:px-16 text-center">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
          Our <span className="text-lime-600">Services</span>
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          We provide fast, secure, and reliable parcel delivery solutions for
          individuals and businesses across Bangladesh.
        </p>
      </div>

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto py-20 px-6 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* Service 1 */}
        <div className="p-8 border rounded-2xl shadow-sm hover:shadow-lg transition bg-white text-center">
          <div className="flex justify-center mb-4">
            <FiPackage size={40} className="text-lime-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Door-to-Door Delivery
          </h3>
          <p className="text-gray-600 mb-4">
            Enjoy seamless delivery directly from sender to receiver — no
            middlemen, no hassle, just efficiency.
          </p>
          <Link
            to="/sendParcel"
            className="text-lime-600 font-semibold hover:underline"
          >
            Learn more →
          </Link>
        </div>

        {/* Service 2 */}
        <div className="p-8 border rounded-2xl shadow-sm hover:shadow-lg transition bg-white text-center">
          <div className="flex justify-center mb-4">
            <FiTruck size={40} className="text-lime-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Express Delivery
          </h3>
          <p className="text-gray-600 mb-4">
            Need it fast? Our express routes ensure quick delivery for
            time-sensitive parcels anywhere in the country.
          </p>
          <Link
            to="/sendParcel"
            className="text-lime-600 font-semibold hover:underline"
          >
            Learn more →
          </Link>
        </div>

        {/* Service 3 */}
        <div className="p-8 border rounded-2xl shadow-sm hover:shadow-lg transition bg-white text-center">
          <div className="flex justify-center mb-4">
            <FiMapPin size={40} className="text-lime-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Nationwide Coverage
          </h3>
          <p className="text-gray-600 mb-4">
            From Dhaka to remote upazilas — we’ve got every corner covered with
            reliable logistics and local riders.
          </p>
          <Link
            to="/coverage"
            className="text-lime-600 font-semibold hover:underline"
          >
            Learn more →
          </Link>
        </div>

        {/* Service 4 */}
        <div className="p-8 border rounded-2xl shadow-sm hover:shadow-lg transition bg-white text-center">
          <div className="flex justify-center mb-4">
            <FiClock size={40} className="text-lime-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Same-Day Delivery
          </h3>
          <p className="text-gray-600 mb-4">
            For urgent parcels, our same-day delivery network ensures your
            shipment reaches its destination on time, every time.
          </p>
          <Link
            to="/sendParcel"
            className="text-lime-600 font-semibold hover:underline"
          >
            Learn more →
          </Link>
        </div>

        {/* Service 5 */}
        <div className="p-8 border rounded-2xl shadow-sm hover:shadow-lg transition bg-white text-center">
          <div className="flex justify-center mb-4">
            <FiTrendingUp size={40} className="text-lime-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Business Solutions
          </h3>
          <p className="text-gray-600 mb-4">
            Partner with us for customized e-commerce delivery, COD management,
            and API-based order integration.
          </p>
          <Link
            to="/contact"
            className="text-lime-600 font-semibold hover:underline"
          >
            Learn more →
          </Link>
        </div>

        {/* Service 6 */}
        <div className="p-8 border rounded-2xl shadow-sm hover:shadow-lg transition bg-white text-center">
          <div className="flex justify-center mb-4">
            <FiShield size={40} className="text-lime-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Secure Handling
          </h3>
          <p className="text-gray-600 mb-4">
            Every parcel is protected with barcode tracking, verification
            checks, and 24/7 monitoring for maximum safety.
          </p>
          <Link
            to="/about"
            className="text-lime-600 font-semibold hover:underline"
          >
            Learn more →
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-lime-100 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Need a custom logistics plan?
        </h2>
        <p className="text-gray-700 mb-6">
          From startups to enterprises — we create tailored delivery solutions
          to match your business needs.
        </p>
        <Link
          to="/contact"
          className="px-8 py-3 bg-lime-500 text-gray-900 font-semibold rounded-full hover:bg-lime-600 transition"
        >
          Contact Us
        </Link>
      </div>
    </section>
  );
};

export default Services;
