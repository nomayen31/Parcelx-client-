import { FaTruckLoading, FaExchangeAlt, FaWarehouse, FaBuilding } from "react-icons/fa";

const HowItWorksCard = ({ title, description }) => {
  // Mapping titles to icons
  const iconMap = {
    "Booking Pick & Drop": <FaTruckLoading className="text-[#0a4d46] text-5xl" />,
    "Cash On Delivery": <FaExchangeAlt className="text-[#0a4d46] text-5xl" />,
    "Delivery Hub": <FaWarehouse className="text-[#0a4d46] text-5xl" />,
    "Booking SME & Corporate": <FaBuilding className="text-[#0a4d46] text-5xl" />,
  };

  return (
    <div className="bg-white rounded-xl p-8 text-left h-full flex flex-col items-start transition-all duration-300 hover:shadow-lg">
      <div className="mb-6">
        <div className="w-16 h-12 flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-[#0a4d46] rounded-full flex items-center justify-center">
            {iconMap[title] || <span className="text-sm font-semibold text-gray-700">Icon</span>}
          </div>
        </div>
      </div>
      <h3 className="text-2xl font-semibold text-[#0a4d46] mb-2">{title}</h3>
      <p className="text-lg text-gray-600 leading-relaxed font-light">
        {description}
      </p>
    </div>
  );
};

export default HowItWorksCard;
