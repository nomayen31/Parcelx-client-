import { FaTruckLoading, FaCashRegister, FaWarehouse, FaBuilding, FaExchangeAlt, FaShippingFast, FaMoneyBillWave } from "react-icons/fa";

const ServiceCard = ({ title, description, highlight }) => {
  const cardBgClass = highlight ? "bg-[#c6f17e]" : "bg-white"; 
  const textColorClass = highlight ? "text-gray-800" : "text-gray-600"; 

  const iconMap = {
    "Express & Standard Delivery": <FaShippingFast className="text-[#0a4d46] text-5xl" />,
    "Cash On Delivery": <FaMoneyBillWave className="text-[#0a4d46] text-5xl" />,  // Ensure icon is used here
    "Fulfillment Solution": <FaWarehouse className="text-[#0a4d46] text-5xl" />,
    "Corporate Service / Contract In Logistics": <FaBuilding className="text-[#0a4d46] text-5xl" />,
    "Parcel Return": <FaExchangeAlt className="text-[#0a4d46] text-5xl" />,
    "Nationwide Delivery": <FaTruckLoading className="text-[#0a4d46] text-5xl" />,
  };

  return (
    <div
      className={`p-8 text-center rounded-3xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:bg-[#c6f17e] ${cardBgClass} h-full`}
    >
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
          {iconMap[title] || <span className="text-sm font-semibold text-gray-700">Icon</span>}
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-800 mb-3 leading-snug">{title}</h3>
      
      <p className={`text-base ${textColorClass} leading-relaxed font-light`}>
        {description}
      </p>
    </div>
  );
};

export default ServiceCard;
