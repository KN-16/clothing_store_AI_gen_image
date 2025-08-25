// import { useHeader } from "./useHeader";
// import clsx from "clsx";
// import "./header.css";
// import logo from '../../assets/images/logo.png';
// import { useNavigate } from "react-router-dom";

// export default function Header( { user }) {
//     const {
//     productMenu,
//     showProduct,
//     setShowProduct,
//     hoveredProduct,
//     setHoveredProduct,
//     showSearch,
//     setShowSearch,
//     showUserDropdown,
//     setShowUserDropdown,
//     visible,
//     // hasHidden,
//     // lastScrollY,
//     // hideTimeout,
//     headerRef,
//     userRef,
//     // resetTimeout,
//     } = useHeader({ user });
//     const navigate = useNavigate();
//   return (
//     <header className={clsx("main-header", "header-opt", { hidden: !visible })} ref={headerRef} >
//       <div className="logo">
//         <img src= {logo}alt="Fashion.com" />
//       </div>
//       <nav className="nav-opt">
//         <div
//           className="nav-item product"
//           onMouseEnter={() => setShowProduct(true)}
//           onMouseLeave={() => { setShowProduct(false); setHoveredProduct(null); }}
//           onClick={() => navigate("/products")}
//         >
//           Sản phẩm
//           <div className={`dropdown-product${showProduct ? " show" : ""}`}>
//             <div className="dropdown-col">
//               {productMenu.map((cat, idx) => (
//                 <div
//                   key={cat.label}
//                   className="dropdown-row"
//                   onMouseEnter={() => setHoveredProduct(idx)}
//                 >
//                   {cat.label}
//                   {hoveredProduct === idx && (
//                     <div className="dropdown-sub">
//                       {cat.children.map(sub => (
//                         <div key={sub} className="dropdown-sub-item">{sub}</div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//         <a className="nav-item" href="#bop">Bóp/Túi</a>
//         <a className="nav-item" href="#sticker">Sticker</a>
//         <a className="nav-item" href="#kiemtra">Kiểm tra đơn hàng</a>
//         <a className="nav-item" href="#mau">Mẫu da</a>
//       </nav>
//       <div className="header-actions">
//         {/* Search */}
//         <div className="search-opt">
//           {!showSearch && (
//             <span className="search-icon" onClick={() => setShowSearch(true)}>🔍</span>
//           )}
//           {showSearch && (
//             <div className="search-bar-opt">
//               <input type="text" placeholder="Tìm kiếm sản phẩm..." autoFocus />
//               <button>🔍</button>
//               <span className="close-search" onClick={() => setShowSearch(false)}>✖</span>
//             </div>
//           )}
//         </div>
//         {/* User */}
//         <div className="user-opt" ref={userRef}>
//           {!user?.username ? (
//             <div
//               className="user-btn"
//               onClick={() => {navigate("/signin")}}
//             >
//               👤 Đăng nhập / Đăng ký
//             </div>
//           ) : (
//             <div
//               className="user-btn"
//               onClick={() => setShowUserDropdown(v => !v)}
//             >
//               👤 {user.username} ▼
//               {showUserDropdown && (
//                 <div className="user-dropdown">
//                   <div>Thông tin tài khoản</div>
//                   <div onClick={() => alert("Đăng xuất")}>Đăng xuất</div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//         {/* Cart */}
//         <div className="cart-opt">
//           🛒 <span>Giỏ hàng</span>
//           <span className="cart-count">0</span>
//         </div>
//       </div>
//     </header>
//   );
// }

import { useHeader } from "./useHeader";
import clsx from "clsx";
import "./header.css";
import logo from '../../assets/images/logo.png';
import { useNavigate } from "react-router-dom";
import useAuth  from "../../hooks/useAuth"; // Lấy user & logout từ context
import useCart  from "../../hooks/useCart";
// src/components/Header/index.jsx
import React from "react";

import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import "./header.css";



export default function Header() {
  const navigate = useNavigate();
  
  //Context
  const { user, logout } = useAuth();
  const { distinctCount } = useCart();
    
  // useHeader hook
  const {
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
    headerRef,
    userRef,
  } = useHeader({ user });
  


  return (
    <header
      className={clsx("main-header", "header-opt", { hidden: !visible })}
      ref={headerRef}
    >
      {/* Logo */}
      <div className="logo" onClick={() => navigate("/")}>
        <img src={logo} alt="Fashion.com" />
      </div>

      {/* Menu */}
      <nav className="nav-opt">
        <div
          className="nav-item product"
          onMouseEnter={() => setShowProduct(true)}
          onMouseLeave={() => {
            setShowProduct(false);
            setHoveredProduct(null);
          }}
          onClick={() => navigate("/products")}
        >
          Sản phẩm
          <div className={`dropdown-product${showProduct ? " show" : ""}`}>
            <div className="dropdown-col">
              {productMenu.map((cat, idx) => (
                <div
                  key={cat.label}
                  className="dropdown-row"
                  onMouseEnter={() => setHoveredProduct(idx)}
                  onClick={() => navigate("/products?category=" + cat.label)}
                >
                  {cat.label}
                  {hoveredProduct === idx && (
                    <div className="dropdown-sub">
                      {cat.children.map((sub) => (
                        <div key={sub} className="dropdown-sub-item">
                          {sub}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="nav-item" onClick={() => navigate("/gen-image")}>Tạo hình ảnh AI sinh động</div>
        <div className="nav-item" onClick={() => navigate("/cart")}>Giỏ hàng của bạn</div>
        {user && <div className="nav-item" onClick={() => navigate("/orders")}>Kiểm tra đơn hàng</div>}
      </nav>

      {/* Actions */}
      <div className="header-actions">
        {/* Search */}
        <div className="search-opt">
          {!showSearch && (
            <span
              className="search-icon"
              onClick={() => setShowSearch(true)}
            >
              🔍
            </span>
          )}
          {showSearch && (
            <div className="search-bar-opt">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                autoFocus
              />
              <button>🔍</button>
              <span
                className="close-search"
                onClick={() => setShowSearch(false)}
              >
                ✖
              </span>
            </div>
          )}
        </div>

        {/* User */}
        <div className="user-opt" ref={userRef}>
          {!user?.username ? (
            <div
              className="user-btn"
              onClick={() => {
                navigate("/login");
              }}
            >
              👤 Đăng nhập / Đăng ký
            </div>
          ) : (
            <div
              className="user-btn"
              onClick={() => setShowUserDropdown((v) => !v)}
            >
              👤 {user.username} ▼
              {showUserDropdown && (
                <div className="user-dropdown">
                  <div onClick={() => navigate("/profile")}>Thông tin tài khoản</div>
                  <div onClick={logout}>Đăng xuất</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cart */}
        <div className="cart-opt" onClick={() => navigate("/cart")}>
          <Badge badgeContent={distinctCount} color="error">
            <ShoppingCartIcon />
          </Badge>
        </div>

      </div>
    </header>
  );
}