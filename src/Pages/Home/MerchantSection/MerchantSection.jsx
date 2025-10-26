import React from 'react';

const PackageIllustrationSVG = () => (
    <svg 
        viewBox="0 0 450 300" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-full h-auto max-h-[350px] opacity-90"
    >
        <path d="M400 240L320 280V200L400 160V240Z" stroke="#48b89e" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M320 280L240 240L320 200L400 240" stroke="#48b89e" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M240 240V160L320 120L400 160" stroke="#48b89e" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M380 140L300 180V100L380 60V140Z" stroke="#48b89e" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M300 180L220 140L300 100L380 140" stroke="#48b89e" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M220 140V60L300 20L380 60" stroke="#48b89e" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M20 280 C 150 350, 250 150, 430 250" stroke="#106f5e" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3"/>
        <path d="M300 20 L300 40 L320 40" stroke="#48b89e" strokeWidth="2" strokeLinejoin="round"/>
        <circle cx="300" cy="10" r="5" fill="#c6f17e"/>
        <path d="M300 10 V 20" stroke="#c6f17e" strokeWidth="2"/>
    </svg>
);

const MerchantSection = () => {
    const backgroundStyle = {
        background: '#093a35',
        backgroundImage: 'radial-gradient(circle at 10% 0%, rgba(198, 241, 126, 0.2) 0%, transparent 40%)',
    };

    return (
        <div 
            style={backgroundStyle} 
            className="rounded-[2rem] py-20 px-6 mt-12 flex justify-center items-center overflow-hidden shadow-2xl shadow-gray-900/50"
        >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
                <div className="text-white w-full md:w-1/2 p-4 md:p-0">
                    <h2 className="text-5xl font-extrabold mb-6 leading-tight">
                        Merchant and Customer Satisfaction is Our First Priority
                    </h2>
                    <p className="text-base font-light text-gray-300 mb-10 max-w-sm">
                        We offer the lowest delivery charge with the highest value along with
                        100% safety of your product. Pathao courier delivers your parcels in
                        every corner of Bangladesh right on time.
                    </p>
                    <div className="inline-flex flex-wrap gap-4">
                        <button className="bg-lime-300 text-[#0a4d46] px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-lime-200 transition-colors">
                            Become a Merchant
                        </button>
                        <button className="bg-transparent border-2 border-[#106f5e] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-[#106f5e] transition-colors">
                            Earn with Profast Courier
                        </button>
                    </div>
                </div>
                <div className="w-full md:w-1/2 flex justify-end mt-12 md:mt-0">
                    <PackageIllustrationSVG />
                </div>
            </div>
        </div>
    );
};

export default MerchantSection;
