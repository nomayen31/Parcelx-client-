import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';

const ChevronDown = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
  </svg>
);

const ChevronUp = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06 0L10 9.06l-3.71 3.73a.75.75 0 01-1.06-1.06l4.25-4.25a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06z" clipRule="evenodd" />
  </svg>
);

const ArrowUpRight = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
  </svg>
);

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "How does this posture corrector work?",
      answer: 
        "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day. Here's how it typically functions: A posture corrector works by providing support and gentle alignment to your shoulders.",
    },
    {
      question: "Is it suitable for all ages and body types?",
      answer:
        "Yes, this posture corrector is designed to be suitable for a variety of body types and ages. It helps maintain proper posture for everyone.",
    },
    {
      question: "Does it really help with back pain and posture improvement?",
      answer:
        "Yes, regular use can help alleviate back pain and improve posture by encouraging proper spinal alignment.",
    },
    {
      question: "Does it have smart features like vibration alerts?",
      answer:
        "Currently, this posture corrector does not have smart features such as vibration alerts. However, it helps in maintaining posture without the need for such features.",
    },
    {
      question: "How will I be notified when the product is back in stock?",
      answer:
        "You will be notified via email when the product is back in stock, so you can purchase it as soon as it's available.",
    },
  ];

  return (
    <div className="py-16 px-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-6 text-[#0a4d46] text-center">
          Frequently Asked Questions (FAQ)
        </h2>
        <p className="text-lg text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment, reduce pain,
          and strengthen your body with ease!
        </p>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <button
                className={`w-full text-left p-4 text-lg font-semibold text-[#0a4d46] transition-all flex justify-between items-center 
                  ${activeIndex === index ? 'bg-[#c6f17e] hover:bg-[#c6f17e]' : 'bg-[#e7f1f2] hover:bg-[#c6f17e]'}`}
                onClick={() => toggleAnswer(index)}
              >
                <span>{faq.question}</span>
                <span>
                  {activeIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-[#0a4d46]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#0a4d46]" />
                  )}
                </span>
              </button>
              <div
                className={`p-4 text-gray-700 text-base bg-white ${activeIndex === index ? 'block' : 'hidden'} transition-all`} 
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            to="/faq"
            className="group relative inline-flex items-center justify-start rounded-full shadow-xl transition duration-300 transform hover:scale-[1.02] bg-lime-400"
          >
            <span 
                className="pl-8 pr-18 py-4 text-xl text-gray-900 font-bold tracking-tight h-full rounded-l-full"
                style={{ clipPath: 'polygon(0 0, 95% 0, 95% 100%, 0% 100%)' }}
            >
              See More FAQ’s 
            </span>
            
            <span className="absolute right-0 h-full w-[60px] flex items-center justify-center">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-900 text-white shadow-2xl group-hover:bg-gray-800 transition duration-300">
                    <ArrowUpRight className="w-6 h-6" />
                </div>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
