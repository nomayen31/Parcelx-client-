import React, { useState, useEffect, useCallback } from 'react';
import image1 from '../../../../public/assets/customer-top.png';

const reviews = [
  { review: "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.", name: "Awlad Hossin", position: "Senior Product Designer" },
  { review: "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.", name: "Raset Ahamed", position: "CTO" },
  { review: "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.", name: "Nasir Uddin", position: "CEO" },
  { review: "Excellent service! The parcel arrived on time and in perfect condition. Highly recommend!", name: "John Doe", position: "CEO, TechWorld" },
  { review: "Amazing experience! The tracking feature is super helpful and the customer service is great.", name: "Jane Smith", position: "Marketing Director, FastCom" },
  { review: "Reliable service! My packages were always delivered safely and on time. Will continue using.", name: "Daniel Harris", position: "E-commerce Manager, ShipMaster" }
];

const Review = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = reviews.length;
  const slidesPerPage = 3;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 3500);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const getVisibleSlides = () => {
    const visible = [];
    for (let i = 0; i < slidesPerPage; i++) {
      visible.push(reviews[(currentSlide + i) % totalSlides]);
    }
    return visible;
  };

  const ArrowButton = ({ children, onClick, isNext }) => (
    <button
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg z-10 transition-all ${isNext ? 'right-[-50px] bg-[#c6f17e] hover:bg-lime-300' : 'left-[-50px] bg-white hover:bg-gray-50'} hidden lg:flex items-center justify-center`}
      style={{ width: 40, height: 40 }}
      aria-label={isNext ? 'Next' : 'Previous'}
    >
      {children}
    </button>
  );

  const visible = getVisibleSlides();

  return (
    <div className="py-16 px-6 bg-gray-100">
      <div className="max-w-7xl mx-auto text-center">
        <img src={image1} alt="Customer Top" className="w-[244px] h-[100px] mx-auto block" />

        <h2 className="text-4xl font-extrabold mb-4 text-[#0a4d46]">
          What our customers are saying
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
          Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment, reduce pain, and strengthen your body with ease!
        </p>

        <div className="relative mx-auto max-w-[1200px]">
          <div className="flex justify-center gap-8">
            {visible.map((review, idx) => {
              const isCenter = idx === 1; // center item highlighted
              return (
                <div key={idx} className="flex-shrink-0">
                  <div
                    className={`w-[410px] h-[315px] rounded-2xl p-8 flex flex-col justify-between transition-all duration-500
                      ${isCenter
                        ? 'bg-white shadow-2xl ring-1 ring-[#0a4d46]/10'
                        : 'bg-white/70 backdrop-blur-[1.5px] opacity-40 grayscale-[20%]'
                      }`}
                  >
                    <div className="text-5xl text-[#0a4d46]/30 text-left leading-none">“</div>
                    <p className={`text-left text-sm leading-relaxed mt-2 ${isCenter ? 'text-gray-700' : 'text-gray-500'}`}>
                      {review.review}
                    </p>
                    <div className="border-t border-dashed border-gray-300 my-4" />
                    <div className="flex items-center text-left">
                      <div className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center
                        ${isCenter ? 'bg-[#0a4d46] text-white' : 'bg-[#0a4d46]/60 text-white/80'}`}>
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <div className={`font-semibold ${isCenter ? 'text-[#0a4d46]' : 'text-[#0a4d46]/70'}`}>
                          {review.name}
                        </div>
                        <div className={`${isCenter ? 'text-gray-500' : 'text-gray-400'} text-xs`}>{review.position}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <ArrowButton onClick={prevSlide} isNext={false}>
            <svg className="w-4 h-4" fill="none" stroke="#0a4d46" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </ArrowButton>

          <ArrowButton onClick={nextSlide} isNext={true}>
            <svg className="w-4 h-4" fill="none" stroke="#0a4d46" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          </ArrowButton>

          <div className="flex justify-center mt-10 gap-2">
            {reviews.slice(0, totalSlides - slidesPerPage + 1).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${index === currentSlide ? 'bg-[#c6f17e]' : 'bg-gray-400'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
