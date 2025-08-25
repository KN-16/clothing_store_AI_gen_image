import { useEffect,useState } from "react";
export default function useHomePage() {
    const apiUrl = process.env.REACT_APP_API_URL;  
  //Call api lay danh sach san pham hien thi cho trang chinh
    const [productList, setProductList] = useState([]);
    useEffect(() => {
      console.log('Call api lay danh sach san pham hien thi cho trang chinh');
      fetch(`${apiUrl}/api/homePage/products`)
        .then(response => response.json())
        .then(data => {
          setProductList(data);
          console.log(data);
          //Save localStorage
          //           // Trước khi gọi API
          // const cached = JSON.parse(localStorage.getItem('homepage_data'));
          // if (cached && (Date.now() - cached.timestamp < 5 * 60 * 1000)) {
          //     return cached.data;
          // }

          // // Gọi API nếu chưa có hoặc hết hạn
          // fetch('/api/products/home')
          //     .then(res => res.json())
          //     .then(data => {
          //         localStorage.setItem('homepage_data', JSON.stringify({
          //             data,
          //             timestamp: Date.now()
          //         }));
          //     });
        })
        .catch(error => {
          console.error('Error fetching Home Page Products:', error);
        });
    },[]);
    return{
        productList,
    };
}
