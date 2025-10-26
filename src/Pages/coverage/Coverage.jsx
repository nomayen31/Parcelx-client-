import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import branches from "../../../public/assets/warehouses.json";

const regionColors = {
  Dhaka: "#34D399",
  Chattogram: "#60A5FA",
  Sylhet: "#FBBF24",
  Rajshahi: "#F87171",
  Khulna: "#A78BFA",
  Barisal: "#F472B6",
  Rangpur: "#2DD4BF",
  Mymensingh: "#F59E0B",
};
const Coverage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBranches, setFilteredBranches] = useState(branches);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBranches(branches);
    } else {
      const lower = searchTerm.toLowerCase();
      const filtered = branches.filter(
        (b) =>
          b.district.toLowerCase().includes(lower) ||
          b.city.toLowerCase().includes(lower) ||
          b.region.toLowerCase().includes(lower) ||
          b.covered_area.some((area) => area.toLowerCase().includes(lower)) 
      );
      setFilteredBranches(filtered);
    }
  }, [searchTerm]);

  return (
    <div className="flex flex-col items-center py-14 px-6 bg-white shadow-xl rounded-2xl max-w-7xl mx-auto my-10 border border-gray-100">
      <div className="w-full max-w-4xl mb-10">
        <h1 className="text-4xl sm:text-5xl font-semibold text-gray-800 mb-8 text-center">
          We are available in {branches.length} districts
        </h1>
        {/* Search Bar Section */}
        <div className="flex w-full items-center justify-center mb-12">
          <div className="relative w-full max-w-xl">
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            <input
              type="text"
              placeholder="Search district, city, region, or covered area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-10 pr-4 border border-gray-200 rounded-l-lg focus:ring-green-500 focus:border-green-500 text-base"
            />
          </div>
          <button
            onClick={() => setSearchTerm("")}
            className="py-3 px-8 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-r-lg shadow-md transition duration-150 ease-in-out"
          >
            Clear
          </button>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        We deliver almost all over Bangladesh
      </h2>

      <MapContainer
        center={[23.685, 90.3563]}
        // झूम स्तर (Zoom level)
        zoom={7}
        scrollWheelZoom={true}
        className="w-full max-w-7xl"
        style={{
          height: "650px",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          zIndex: 0,
        }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredBranches.map((branch, i) => (
          <CircleMarker
            key={i}
            center={[branch.latitude, branch.longitude]}
            pathOptions={{
              color: regionColors[branch.region] || "#22C55E",
              fillColor: regionColors[branch.region] || "#22C55E",
              fillOpacity: 0.8,
            }}
            radius={8}
          >
            <Popup>
              <div className="text-sm font-semibold text-gray-800 mb-1">
                📍 {branch.district}, {branch.region}
              </div>
              <div className="text-xs text-gray-600 mb-1">
                City: <strong>{branch.city}</strong>
              </div>
              <div className="text-xs text-gray-600">
                Areas: {branch.covered_area.join(", ")}
              </div>
              <div className="mt-2">
                <a
                  href={branch.flowchart}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline text-xs"
                >
                  View Flowchart →
                </a>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <p className="text-gray-500 text-sm mt-6">
        Showing {filteredBranches.length}{" "}
        {filteredBranches.length === 1 ? "district" : "districts"}
      </p>
    </div>
  );
};

export default Coverage;