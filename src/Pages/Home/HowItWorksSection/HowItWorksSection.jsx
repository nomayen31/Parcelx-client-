// HowItWorksSection.jsx

import HowItWorksCard from "./HowItWorksCard";

const HowItWorksSection = () => {
  const services = [
    {
      title: "Booking Pick & Drop",
      description:
        "From personal packages to business shipments — we deliver on time, every time.",
    },
    {
      title: "Cash On Delivery",
      description:
        "From personal packages to business shipments — we deliver on time, every time.",
    },
    {
      title: "Delivery Hub",
      description:
        "From personal packages to business shipments — we deliver on time, every time.",
    },
    {
      title: "Booking SME & Corporate",
      description:
        "From personal packages to business shipments — we deliver on time, every time.",
    },
  ];

  return (
    // Apply a light gray background to the entire section container
    <section className="bg-gray-100 py-20 px-6"> 
      <div className="max-w-7xl mx-auto">
        {/* Adjusted text color and size to match image more closely */}
        <h2 className="text-3xl font-normal text-gray-800 mb-12 text-left">How it Works</h2> 
        
        {/* Grid layout for the cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <HowItWorksCard key={idx} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;