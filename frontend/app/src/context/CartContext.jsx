// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/api";
import  useAuth  from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const CartContext = createContext(null);
// export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]); // if user: items with productstock etc; if guest: {productstock_id, quantity}
  const navigate= useNavigate();
  useEffect(() => {
    const load = async () => {
      if (user) {
        try
        {
          const { data } = await api.get("api/cart/");
          setItems(data.items || []);}
        catch (error) {
          if (error.response?.status === 401) {
            alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
           navigate("/login");
          }
          const msg= error.response?.data?.error || "Đã xảy ra lỗi khi lấy thông tin giỏ hàng";
          alert("❌ " + msg); 
        }
      } else {
        const guest = sessionStorage.getItem("guest_cart");
        setItems(guest ? JSON.parse(guest) : []);
      }
    };
    load();
  }, [user, navigate]);

  const persistGuest = next => sessionStorage.setItem("guest_cart", JSON.stringify(next));

  // const add = async (productstock_id, quantity = 1) => {
  //   if (user) {
  //     const { data } = await api.post("api/shop/cart/add/", { productstock_id, quantity });
  //     setItems(data.items);
  //   } else {
  //     setItems(prev => {
  //       const found = prev.find(x => x.productstock_id === productstock_id);
  //       const next = found ? prev.map(x => x.productstock_id === productstock_id ? { ...x, quantity: x.quantity + quantity } : x) : [...prev, { productstock_id, quantity }];
  //       persistGuest(next);
  //       return next;
  //     });
  //   }
  // };
  const add = async (productstock_id, quantity = 1,msg_default_success="Đã thêm sản phẩm vào giỏ hàng",msg_default_error="Đã xảy ra lỗi khi thêm sản phẩm") => {
  if (user) {
    try {
      const { data } = await api.post("api/cart/add/", { productstock_id, quantity });
      setItems(data.items);
      alert("✅ " + msg_default_success);
    } catch (error) {
         if (error.response?.status === 401) {
    // Nếu refresh token fail, bạn có thể redirect về trang login
    alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
    navigate("/login"); // Hoặc dùng react-router: navigate('/login')
  }
      const msg = error.response?.data?.error || msg_default_error;
      alert("❌ " + msg);
    }
  } else {
    setItems(prev => {
      const found = prev.find(x => x.productstock_id === productstock_id);
      const next = found
        ? prev.map(x =>
            x.productstock_id === productstock_id
              ? { ...x, quantity: x.quantity + quantity }
              : x
          )
        : [...prev, { productstock_id, quantity }];
      persistGuest(next);
      alert("✅ Đã thêm sản phẩm vào giỏ hàng");
      return next;
    });
  }
};

  const updateQty = async (idOrPsId, quantity,msg_default_success="Đã cập nhật số lượng sản phẩm thành công",msg_default_error="Đã xảy ra lỗi khi cập nhật số lượng sản phẩm") => {
    if (user) {
          try {
      const { data } = await api.patch("api/cart/update-item/", { id: idOrPsId, quantity });
      setItems(data.items);
      alert("✅ " + msg_default_success);
    } catch (error) {
      if (error.response?.status === 401) {
    // Nếu refresh token fail, bạn có thể redirect về trang login
    alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
    navigate("/login"); // Hoặc dùng react-router: navigate('/login')
  }
      const msg = error.response?.data?.error || msg_default_error;
      alert("❌ " + msg);
      setItems(error.response?.data?.data.items);
    }
    } else {
      setItems(prev => {
        const next = prev.map(x => x.productstock_id === idOrPsId ? { ...x, quantity } : x);
        alert("✅ " + msg_default_success);
        persistGuest(next);
        return next;
      });
    }
  };

  const remove = async (idOrPsId,msg_default_success="Đã xóa sản phẩm trong giỏ hàng",msg_default_error="Đã xảy ra lỗi khi xóa sản phẩm") => {
    if (user) {
      try {
      const { data } = await api.delete(`api/cart/remove-item/?id=${idOrPsId}`);
      setItems(data.items);
      alert("✅ " + msg_default_success);
    } catch (error) {
      if (error.response?.status === 401) {
    // Nếu refresh token fail, bạn có thể redirect về trang login
    alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
    navigate("/login"); // Hoặc dùng react-router: navigate('/login')
  }
      const msg = error.response?.data?.error || msg_default_error;
      alert("❌ " + msg);
      setItems(error.response?.data?.data.items);
    }
    } else {
      setItems(prev => {
        const next = prev.filter(x => x.productstock_id !== idOrPsId);
        persistGuest(next);
        alert("✅ " + msg_default_success);
        return next;
      });
    }
  };

  const distinctCount = useMemo(() => {
    // console.log(items);
    // if (user) {
    //   const setIds = new Set(items.map(it => it.productstock?.product?.id).filter(Boolean));
    //   return setIds.size;
    // } else {
    //   return items.length;
    // }
    return items.length;
  }, [items]);

  const placeOrder = async (item_ids) => {
    if (!user) 
      return alert("⚠️ Bạn cần đăng nhập để đặt hàng");
    const colorMap = {
    Unknown: "Unknown",
    white: "Trắng",
    black: "Đen",
    gray: "Xám",
    light_gray: "Xám nhạt",
    dark_gray: "Xám đậm",
    blue: "Xanh dương",
    navy: "Xanh navy / xanh than",
    sky_blue: "Xanh da trời",
    dark_blue: "Xanh đậm",
    green: "Xanh lá",
    olive: "Xanh rêu",
    red: "Đỏ",
    wine: "Đỏ đô",
    pink: "Hồng",
    light_pink: "Hồng phấn",
    purple: "Tím",
    yellow: "Vàng",
    beige: "Be",
    brown: "Nâu",
    cream: "Kem",
    orange: "Cam",
  };
     try {
      const { data } = await api.post("/api/orders/create-from-cart/", { item_ids: item_ids });
      setItems(data.items);
      alert("✅ Đã đặt hàng thành công" );
    } catch (error) {
      if (error?.response?.status === 401) {
    // Nếu refresh token fail, bạn có thể redirect về trang login
    alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
    navigate("/login"); 
  }
      alert("❌ Đã xảy ra lỗi khi đặt hàng, vui lòng kiểm tra danh sách sản phẩm lỗi sau trong giỏ hàng" );
      const {errors}= error.response?.data;
      if (errors.length > 0) {
          alert("Một số sản phẩm không thể thêm:\n" + errors.map(e => {
            if (e.cart_item_id) {
              return `${e.cart_item_id}: ${e.error}`;
            }
            return `Sản phẩm ${e.name} ,Size ${e.size} - Màu ${colorMap[e.color]}, ${e.quantity}, Số lượng trong kho ${e.quantity_in_stock}: ${e.error}`;
          }).join("\n"));
        }
      setItems(error?.response?.data?.data?.items);

    }
  };

  return (
    <CartContext.Provider value={{ items, add, updateQty, remove, distinctCount, placeOrder,setItems }}>
      {children}
    </CartContext.Provider>
  );
};