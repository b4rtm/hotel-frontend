import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../stylesheets/slick-custom.css";

const RoomSlider = ({ room }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <Slider {...settings} className="slider">
      {room?.imagePaths.map((path, index) => (
        <div key={index}>
          <img src={path} alt={`Room image ${index + 1}`} />
        </div>
      ))}
    </Slider>
  );
};

export default RoomSlider;
