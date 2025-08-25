import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { setLogoutCallback } from "../utils/authCallback"; 
import axios from "axios";

export const AuthContext = createContext();

/**
 * AuthProvider responsibilities:
 * - login(username,password) -> call /api/login/ (TokenObtainPairView)
 * - store access/refresh in localStorage
 * - load /api/user/ into user state
 * - logout() clears storage and navigates to home
 */
export const AuthProvider = ({ children }) => {
  
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const login = async (username, password) => {
    // returns when completed or throws error
    const res = await axios.post(`${API_URL}/api/login/`, { username, password });
    const { access, refresh } = res.data;
    if (!access) throw new Error("No access token in response");
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    // load user info via api (api instance will attach Authorization)
    const userRes = await api.get("/api/user/");
    setUser(userRes.data);
    alert("Đăng nhập thành công");
const guestCart = sessionStorage.getItem("guest_cart");

if (guestCart) {
  if (window.confirm("Hiện tại bạn có giỏ hàng ở trên web, bạn có muốn thêm giỏ hàng này vào giỏ hàng của bạn không?")) {
    try {
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
      const parsed = JSON.parse(guestCart);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const response = await api.post("/api/cart/merge/", { items: parsed });

        sessionStorage.removeItem("guest_cart");
        
        const { added_productstock_ids, errors,data } = response.data;
        // ({"productstock_id": ps_id, "name": productstock.product.name,"quantity": qty})
        if (added_productstock_ids.length > 0) {
          alert("Thêm giỏ hàng thành công:\n" + added_productstock_ids.map(e => `Sản phẩm ${e.name} ,Size ${e.size} - Màu ${colorMap[e.color]}: ${e.quantity}`).join("\n"));
        }
        if (errors.length > 0) {
          alert("Một số sản phẩm không thể thêm:\n" + errors.map(e => `ID ${e.productstock_id}: ${e.error || JSON.stringify(e.errors)}`).join("\n"));
        }
      }
    } catch (err) {
      console.error("Lỗi khi thêm giỏ hàng guest:", err);
      alert("Đã xảy ra lỗi khi thêm giỏ hàng.");
    }
  }
}
    
    return userRes.data;
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    navigate("/"); // go home after logout
  };

  const fetchUser = async (accessToken) => {
    try {
      // temporary call using axios to be safe
      const res = await api.get("/api/user/");
      setUser(res.data);
      return res.data;
    } catch (err) {
      // maybe access expired; let caller handle refresh
      throw err;
    }
  };

  // attempt to initialize auth on mount: try access -> fetchUser, else try refresh->fetchUser
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const access = localStorage.getItem("access");
        if (access) {
          try {
            await fetchUser(access);
          } catch (e) {
            // try refresh flow
            const refresh = localStorage.getItem("refresh");
            if (refresh) {
              try {
                const resp = await axios.post(`${API_URL}/api/token/refresh/`, { refresh });
                const newAccess = resp.data.access;
                localStorage.setItem("access", newAccess);
                api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
                await fetchUser(newAccess);
              } catch (err) {
                // refresh failed
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                setUser(null);
              }
            } else {
              setUser(null);
            }
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    init();
    return () => (mounted = false);
  }, []);
useEffect(() => {
  setLogoutCallback(() => () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  });
}, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};