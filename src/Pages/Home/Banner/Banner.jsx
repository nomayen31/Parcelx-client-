import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import bannerImage1  from '../../../../public/assets/banner/banner1.png';
import bannerImage2  from '../../../../public/assets/banner/banner2.png';
import bannerImage3  from '../../../../public/assets/banner/banner3.png';

const Banner = () => {
  return (
    <Carousel>
      <div>
        <img src={bannerImage1} />
        <p className="legend">Legend 1</p>
      </div>
      <div>
        <img src={bannerImage2} />
        <p className="legend">Legend 2</p>
      </div>
      <div>
        <img src={bannerImage3} />
        <p className="legend">Legend 3</p>
      </div>
    </Carousel>
  );
};

export default Banner;
