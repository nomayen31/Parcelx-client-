import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import bannerImage1  from '../../../../public/assets/banner/banner1.png';
import bannerImage2  from '../../../../public/assets/banner/banner2.png';
import bannerImage3  from '../../../../public/assets/banner/banner3.png';

const Banner = () => {
  return (
    <Carousel autoPlay={true} infiniteLoop={true} showThumbs={false} className="mt-5">
      <div>
        <img src={bannerImage1} />
      </div>
      <div>
        <img src={bannerImage2} />
      </div>
      <div>
        <img src={bannerImage3} />
      </div>
    </Carousel>
  );
};

export default Banner;
