import React, { useEffect } from 'react';
import image1 from '../../../../public/assets/location-merchant.png';
import image2 from '../../../../public/assets/tiny-deliveryman.png';
import image3 from '../../../../public/assets/safedelivery.png';

// Import AOS library and CSS
import AOS from 'aos';
import 'aos/dist/aos.css';

const Features = () => {
    useEffect(() => {
        AOS.init({
            duration: 2000,   
            delay: 300,      
        });
    }, []);

    const features = [
        {
            title: "Live Parcel Tracking",
            description: "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment’s journey and get instant status updates for complete peace of mind.",
            image: image1
        },
        {
            title: "100% Safe Delivery",
            description: "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
            image: image2
        },
        {
            title: "24/7 Call Center Support",
            description: "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
            image: image3
        },
    ];

    return (
        <div className="py-16 px-6 flex justify-center">
            <div className="w-[1282px] max-w-full space-y-6">
                {features.map((feature, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-2xl w-full h-[264px] flex items-center p-8 overflow-hidden"
                        data-aos="fade-up" 
                    >
                        <div className="w-[30%] h-full flex items-center justify-center flex-shrink-0">
                            <img
                                src={feature.image}
                                alt={feature.title}
                                className="w-full max-w-[200px] h-auto object-contain"
                            />
                        </div>
                        <div className="h-full w-[1px] border-r-2 border-dotted border-gray-300 mx-10 flex-shrink-0"></div>
                        <div className="flex-grow text-left">
                            <h3 className="text-2xl font-semibold text-[#0a4d46] mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-700 text-base leading-relaxed font-normal">
                                {feature.description}
                            </p>
                        </div>
                    </div>
                ))}
                <div className="mt-12 border-b-2 border-dashed border-gray-300 w-full max-w-6xl mx-auto"></div>
            </div>
        </div>
    );
};

export default Features;
