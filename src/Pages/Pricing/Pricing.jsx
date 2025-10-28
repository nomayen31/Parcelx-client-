import React from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

const Pricing = () => {
  return (
    <section className="bg-white text-gray-800">
      {/* Hero Section */}
      <div className="bg-lime-50 py-20 px-6 lg:px-16 text-center">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
          Simple & Transparent <span className="text-lime-600">Pricing</span>
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Choose the perfect plan for your delivery needs. No hidden fees, just
          reliable service — every time.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto py-20 px-6 lg:px-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Basic Plan */}
        <div className="border rounded-2xl shadow-sm hover:shadow-lg transition bg-white p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Basic</h3>
          <p className="text-gray-600 mb-6">
            Perfect for individuals sending parcels occasionally.
          </p>
          <h2 className="text-4xl font-extrabold text-lime-600 mb-2">৳99</h2>
          <p className="text-gray-500 mb-6">per parcel</p>
          <ul className="text-gray-700 text-sm space-y-3 mb-8 text-left max-w-xs mx-auto">
            <li className="flex items-center gap-2">
              <FiCheckCircle className="text-lime-600" /> Door-to-door delivery
            </li>
            <li className="flex items-center gap-2">
              <FiCheckCircle className="text-lime-600" /> SMS tracking updates
            </li>
            <li className="flex items-center gap-2">
              <FiCheckCircle className="text-lime-600" /> Delivery within 48 hours
            </li>
            <li className="flex items-center gap-2 text-gray-400">
              <FiXCircle className="text-red-400" /> No COD support
            </li>
          </ul>
          <Link
            to="/sendParcel"
            className="inline-block px-6 py-2 rounded-full bg-lime-500 text-gray-900 font-semibold hover:bg-lime-600 transition"
          >
            Get Started
          </Link>
        </div>

        {/* Standard Plan */}
        <div className="border-2 border-lime-500 rounded-2xl shadow-lg bg-lime-50 p-8 text-center transform scale-105">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Standard</h3>
          <p className="text-gray-600 mb-6">
            Ideal for small businesses and regular senders.
          </p>
          <h2 className="text-4xl font-extrabold text-lime-600 mb-2">৳149</h2>
          <p className="text-gray-500 mb-6">per parcel</p>
          <ul className="text-gray-700 text-sm space-y-3 mb-8 text-left max-w-xs mx-auto">
            <li className="flex items-center gap-2">
              <FiCheckCircle className="text-lime-600" /> Priority pickup & delivery
            </li>
            <li className="flex items-center gap-2">
              <FiCheckCircle className="text-lime-600" /> Real-time tracking dashboard
            </li>
            <li className="flex items-center gap-2">
              <FiCheckCircle className="text-lime-600" /> COD (Cash on Delivery)
            </li>
            <li className="flex items-center gap-2">
              <FiCheckCircle className="text-lime-600" /> 24/7 customer support
            </li>
          </ul>
          <Link
            to="/sendParcel"
            className="inline-block px-6 py-2 rounded-full bg-lime-500 text-gray-900 font-semibold hover:bg-lime-600 transition"
          >
            Get Started
          </Link>
        </div>

        {/* Business Plan */}
        <div className="border rounded-2xl shadow-sm hover:shadow-lg transition bg-white p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Business</h3>
          <p className="text-gray-600 mb-6">
            Best for e-commerce, retailers, and logistics partners.
          </p>
          <h2 className="text-4xl font-extrabold text-lime-600 mb-2">৳249</h2>
          <p className="text-gray-500 mb-6">per parcel</p>
          <ul className="text-gray-700 text-sm space-y-3 mb-8 text-left max-w-xs mx-auto">
            <li className="flex items-center gap-2">
              <FiCheckCircle className="text-lime-600" /> Same-day delivery
            </li>
            <li className="flex items-center gap-2">
              <FiCheckCircle className="text-lime-600" /> API integration
            </li>
            <li className="flex items-center gap-2">
              <FiCheckCircle className="text-lime-600" /> Dedicated account manager
            </li>
            <li className="flex items-center gap-2">
              <FiCheckCircle className="text-lime-600" /> Custom billing options
            </li>
          </ul>
          <Link
            to="/contact"
            className="inline-block px-6 py-2 rounded-full bg-lime-500 text-gray-900 font-semibold hover:bg-lime-600 transition"
          >
            Contact Sales
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-lime-100 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Need custom logistics support?
        </h2>
        <p className="text-gray-700 mb-6">
          We offer enterprise solutions for bulk deliveries, COD management, and
          return handling.
        </p>
        <Link
          to="/contact"
          className="px-8 py-3 bg-lime-500 text-gray-900 font-semibold rounded-full hover:bg-lime-600 transition"
        >
          Talk to Our Team
        </Link>
      </div>
    </section>
  );
};

export default Pricing;
