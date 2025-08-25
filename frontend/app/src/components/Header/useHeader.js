import { useState, useRef, useEffect } from "react";

export function useHeader({ user }) {
  // // Product menu
  // const productMenu = [
  //   {
  //     label: "Áo",
  //     children: ["Áo thun", "Áo sơ mi", "Áo khoác"]
  //   },
  //   {
  //     label: "Quần",
  //     children: ["Quần jeans", "Quần short", "Quần tây"]
  //   },
  //   {
  //     label: "Giày",
  //     children: ["Sneaker", "Sandal", "Giày tây"]
  //   }
  // ];

  const [showProduct, setShowProduct] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [visible, setVisible] = useState(true);
  const [hasHidden, setHasHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);
  const hideTimeout = useRef(null);
  const headerRef = useRef(null);

  // Hàm reset timeout, chỉ set timeout nếu không ở đầu trang
  const resetTimeout = () => {
    setVisible(true);
    if (window.scrollY === 0) {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      return;
    }
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => {
      setVisible(false);
      setHasHidden(true);
    }, 2000); // 20 giây
  };

  // Lắng nghe các sự kiện tương tác
  useEffect(() => {
    if (hasHidden) return;

    window.addEventListener("mousemove", resetTimeout);
    window.addEventListener("keydown", resetTimeout);
    window.addEventListener("scroll", resetTimeout);

    const headerEl = headerRef.current;
    if (headerEl) headerEl.addEventListener("mouseenter", resetTimeout);

    // Gọi lần đầu để khởi tạo timeout nếu cần
    resetTimeout();

    return () => {
      window.removeEventListener("mousemove", resetTimeout);
      window.removeEventListener("keydown", resetTimeout);
      window.removeEventListener("scroll", resetTimeout);
      if (headerEl) headerEl.removeEventListener("mouseenter", resetTimeout);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
    // eslint-disable-next-line
  }, [hasHidden]);

  // Khi đã ẩn, chỉ hiện lại nếu scroll lên
  useEffect(() => {
    if (!hasHidden) return;
    const handleScroll = () => {
      if (window.scrollY < lastScrollY) {
        setVisible(true);
        setHasHidden(false);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasHidden, lastScrollY]);

  // Đóng dropdown khi click ngoài
  const userRef = useRef();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // Call API productMenu
  const [productMenu, setProductMenu] = useState([]);
  
  useEffect(() => {
      // Sử dụng biến môi trường từ .env
      const apiUrl = process.env.REACT_APP_API_URL;
      const data_productMenu = [];
      fetch(`${apiUrl}/api/header/productMenu`)
        .then(response => response.json())
        .then(data => {
          data.forEach(item => {
        // Kiểm tra xem đã có nhóm theo title chưa
        let category = data_productMenu.find(cat => cat.label === item.title);
    
        // Nếu chưa có, thêm mới nhóm
        if (!category) {
            category = { label: item.title, children: [] };
            data_productMenu.push(category);
        }
        // Thêm sản phẩm vào nhóm "children"
      category.children.push(item.name);});
      setProductMenu(data_productMenu);
        })
        .catch(error => {
          console.error('Error fetching productMenu:', error);
        });
    },[]);
  // const productMenu = [
  //   {
  //     label: "Áo",
  //     children: ["Áo thun", "Áo sơ mi", "Áo khoác"]
  //   },
  //   {
  //     label: "Quần",
  //     children: ["Quần jeans", "Quần short", "Quần tây"]
  //   },
  //   {
  //     label: "Giày",
  //     children: ["Sneaker", "Sandal", "Giày tây"]
  //   }
  // ];
  
  return {
    productMenu,
    showProduct,
    setShowProduct,
    hoveredProduct,
    setHoveredProduct,
    showSearch,
    setShowSearch,
    showUserDropdown,
    setShowUserDropdown,
    visible,
    hasHidden,
    lastScrollY,
    hideTimeout,
    headerRef,
    userRef,
    resetTimeout,
  };
};