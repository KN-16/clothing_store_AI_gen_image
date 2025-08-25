import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "./ImageSlider.css";
import { Pagination } from "swiper/modules";

// const images = [
//   "https://your-image-url-1.jpg",
//   "https://your-image-url-2.jpg",
//   "https://your-image-url-3.jpg",
// ];

export default function ImageSlider({images}) {
  if (!images || images.length === 0) {
    return <div>No images available</div>;
  }
  return (
    <Swiper
      modules={[Pagination]}
      pagination={{ clickable: true }}
      slidesPerView={1}
      loop={true}
      className="fullwidth-swiper"
    >
      {images.map((img, idx) => (
        <SwiperSlide key={idx}>
          <img src={img} alt={`slide-${idx}`} className="fullwidth-image" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}