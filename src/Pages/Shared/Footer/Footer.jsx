import { Link } from "react-router-dom";
import { FaLinkedinIn, FaXTwitter, FaFacebookF, FaYoutube } from "react-icons/fa6";
import logo from "../../../../public/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 rounded-2xl py-10 px-6 mt-12">
      <div className="max-w-6xl mx-auto flex flex-col items-center space-y-8">

        {/* Logo + Brand */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Profast Logo" className="w-8 h-8" />
          <span className="text-2xl font-extrabold text-white">Parcelx</span>
        </div>

        {/* Description */}
        <p className="text-center text-sm max-w-xl leading-relaxed text-gray-400">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. 
          From personal packages to business shipments — we deliver on time, every time.
        </p>

        {/* Divider Line */}
        <div className="w-ful"></div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
          <Link to="/services" className="hover:text-white transition">Services</Link>
          <Link to="/coverage" className="hover:text-white transition">Coverage</Link>
          <Link to="/about" className="hover:text-white transition">About Us</Link>
          <Link to="/pricing" className="hover:text-white transition">Pricing</Link>
          <Link to="/blog" className="hover:text-white transition">Blog</Link>
          <Link to="/contact" className="hover:text-white transition">Contact</Link>
        </div>

        {/* Dotted Divider Line */}
        <div className="w-full border border-dotted border-gray-700"></div>

        {/* Social Icons */}
        <div className="flex space-x-5 mt-2">
          <Link to="/linkedin" className="text-white bg-[#0A66C2] w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#004182] transition">
            <FaLinkedinIn size={16} />
          </Link>
          <Link to="/x" className="text-black bg-gray-100 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-300 transition">
            <FaXTwitter size={16} />
          </Link>
          <Link to="/facebook" className="text-white bg-[#1877F2] w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#0f5bb5] transition">
            <FaFacebookF size={16} />
          </Link>
          <Link to="/youtube" className="text-white bg-[#FF0000] w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#cc0000] transition">
            <FaYoutube size={16} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
