import React from "react";
import { Link } from "react-router-dom";
import aboutImg from "../../../public/assets/delivery-van.png"; 

const AboutUs = () => {
  return (
    <section className="bg-white text-gray-800">
      {/* Hero Section */}
      <div className="relative bg-lime-50 py-20 px-6 lg:px-16 text-center lg:text-left">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              About <span className="text-lime-600">ParcelX</span>
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              ParcelX is your trusted logistics partner in Bangladesh,
              simplifying delivery through technology, transparency, and
              real-time tracking. Our mission is to make parcel delivery faster,
              safer, and smarter for everyone — from individuals to enterprises.
            </p>
            <Link
              to="/sendParcel"
              className="inline-block px-6 py-3 bg-lime-500 text-gray-900 font-semibold rounded-full hover:bg-lime-600 transition"
            >
              Send a Parcel
            </Link>
          </div>

          <div className="flex justify-center lg:justify-end">
            <img
              src={aboutImg}
              alt="About ParcelX"
              className="w-80 lg:w-96 rounded-2xl shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Mission, Vision, and Values */}
      <div className="max-w-6xl mx-auto py-20 px-6 lg:px-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6 border rounded-2xl shadow-sm hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-lime-600 mb-3">Our Mission</h3>
          <p className="text-gray-600">
            To deliver every parcel with care and accuracy, empowering businesses
            and individuals through efficient logistics solutions that save time
            and build trust.
          </p>
        </div>

        <div className="p-6 border rounded-2xl shadow-sm hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-lime-600 mb-3">Our Vision</h3>
          <p className="text-gray-600">
            To be Bangladesh’s most customer-focused delivery network, combining
            innovation and sustainability for a seamless delivery experience.
          </p>
        </div>

        <div className="p-6 border rounded-2xl shadow-sm hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-lime-600 mb-3">Our Values</h3>
          <p className="text-gray-600">
            Reliability, transparency, speed, and sustainability are at the core
            of everything we do — ensuring your parcels always arrive safely.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gray-50 py-20 px-6 lg:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
            Why Choose <span className="text-lime-600">ParcelX?</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
            <div className="p-6 bg-white border rounded-2xl shadow hover:shadow-lg transition">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                🚚 Real-Time Tracking
              </h4>
              <p className="text-gray-600">
                Stay updated at every step — our live tracking ensures you always
                know where your parcel is.
              </p>
            </div>

            <div className="p-6 bg-white border rounded-2xl shadow hover:shadow-lg transition">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                ⚡ Fast & Reliable
              </h4>
              <p className="text-gray-600">
                With optimized routes and smart dispatching, we guarantee timely
                delivery every time.
              </p>
            </div>

            <div className="p-6 bg-white border rounded-2xl shadow hover:shadow-lg transition">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                💚 Eco-Friendly Approach
              </h4>
              <p className="text-gray-600">
                We’re committed to green delivery practices — minimizing carbon
                footprint through smarter logistics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call To Action */}
      <div className="py-20 bg-lime-100 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to simplify your delivery?
        </h2>
        <p className="text-gray-700 mb-8">
          Join thousands of happy customers who trust ParcelX for their daily
          logistics needs.
        </p>
        <Link
          to="/register"
          className="px-8 py-3 bg-lime-500 text-gray-900 font-semibold rounded-full hover:bg-lime-600 transition"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
};

export default AboutUs;
