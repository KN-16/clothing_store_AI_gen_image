import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import {  Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";

import "./ProductCarousel.css";
  // Example data for the carousel
  // {
  //   /* 
  //   data = {
  //     title: "Featured Products",
  //     products: [
  //       { id: 1, title: "Product 1", image: "https://example.com/image1.jpg" },
  //       { id: 2, title: "Product 2", image: "https://example.com/image2.jpg" },
  //       // Add more products as needed
  //     ]
  //   };
  //   */
  // }
export default function ProductCarousel({data}) {
  const products = data.products || []; // Lấy danh sách sản phẩm từ props, nếu không có thì là mảng rỗng
  const navigate = useNavigate(); // Hook để điều hướng
  // Hàm xử lý khi người dùng click vào sản phẩm

  const handleProductClick = (productId) => {
    // Điều hướng đến trang chi tiết sản phẩm với productId
    navigate(`/products/detail?id=${productId}`);
  };

  const handleCategoryClick = () => {
    // Điều hướng đến trang danh mục (ví dụ: "/category")
    navigate(`/category`);
  };
  const apiUrl = process.env.REACT_APP_API_URL;
  return (
    <div className="carousel-container">
      <div className="carousel-title-container">
        <h2 className="carousel-title" onClick={handleCategoryClick}>{data.title}</h2>
      </div>
      {
      products.length === 0 ? (
        <p className="carousel-empty-message">No products available</p>
      )
      : (
      <Swiper
        modules={[Navigation]}
        slidesPerView={4}
        centeredSlides={true}
        navigation
        loop={true}
        className="mySwiper"
        spaceBetween={24}
      >      
        { 
          products.concat(products).map((item, idx) => (
          <SwiperSlide key={idx}>
            <div className="carousel-image-wrapper">
              <img src={`${apiUrl}/${item.image}`} alt={item.title} className="carousel-image" onClick={() => handleProductClick(item.id)} />
              <div className="carousel-caption">{item.title}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      )}
    </div>
  );
}