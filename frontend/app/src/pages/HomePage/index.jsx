
import { useEffect } from "react";
import ImageSlider  from "../../components/ImageSlider";
import image_1 from "../../assets/images/home_page_1.png"
import image_2 from "../../assets/images/home_page_2.png"
import image_3 from "../../assets/images/home_page_3.png"
import useHomePage  from "./useHomePage";
import ProductCarousel from "../../components/ProductCarousel"; 

export default function HomePage() {
    // const apiUrl = process.env.REACT_APP_API_URL;
   useEffect(() => {
    // Thay đổi tiêu đề trang khi component này được render
    document.title = "Trang chủ";
  }, []); // [] để chỉ chạy một lần khi component mount
    const images_slider_images= [
            image_1,
            image_2,
            image_3,
        ];
    const {productList}=useHomePage();
    return (
        <div className="home-page">
        <ImageSlider images={images_slider_images} />
        
        {
            productList.map((product,index) => (
                <ProductCarousel key={index} data={product} />
            ))
        }
        </div>
    );
    }