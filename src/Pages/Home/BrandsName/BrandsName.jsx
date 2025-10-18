import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import image1 from '../../../../public/assets/brands/amazon.png';
import image2 from '../../../../public/assets/brands/amazon_vector.png';
import image3 from '../../../../public/assets/brands/casio.png';
import image4 from '../../../../public/assets/brands/moonstar.png';
import image5 from '../../../../public/assets/brands/randstad.png';
import image6 from '../../../../public/assets/brands/start-people 1.png';
import image7 from '../../../../public/assets/brands/start.png';

const BrandsName = () => {
    const logos = [
        { src: image1, alt: "Amazon" },
        { src: image2, alt: "Amazon Vector" },
        { src: image3, alt: "Casio" },
        { src: image4, alt: "Moonstar" },
        { src: image5, alt: "Randstad" },
        { src: image6, alt: "Start People" },
        { src: image7, alt: "Star" },
    ];

    const settings = {
        infinite: true,
        speed: 1000,
        autoplay: true,
        autoplaySpeed: 0,
        cssEase: "linear",
        slidesToShow: 6,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
    };

    return (
        <div className=" py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-center text-xl font-semibold mb-12 text-[#0a4d46]">
                    We've helped thousands of sales teams
                </h2>
                
                <Slider {...settings} className='mt-5'>
                    {logos.map((logo, index) => (
                        <div key={index} className="px-4">
                            <img 
                                src={logo.src} 
                                alt={logo.alt} 
                                className="w-24 h-auto object-contain mx-auto opacity-75"
                            />
                        </div>
                    ))}
                </Slider>

                <div className="mt-12 border-b-2 border-dashed border-gray-300 w-full max-w-6xl mx-auto"></div>
            </div>
        </div>
    );
};

export default BrandsName;
