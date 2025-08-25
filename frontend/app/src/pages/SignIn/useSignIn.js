// import { useState } from 'react';

// export function useSignIn() {
//   const [form, setForm] = useState({ username: '', password: '' });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };
//  const handleSubmit = (e) => {
//     e.preventDefault();
//   //     const isEmail = form.username.includes('@');
//   // if (isEmail) {
//   //   console.log("Logging in with email:", form.username);
//   // } else {
//   //   console.log("Logging in with username:", form.username);
//   // }
//     // Xử lý đăng nhập ở đây
//     alert('Đăng nhập: ' + JSON.stringify(form));
//   };

//   const handleForgotPassword = () => {
//     alert('Chức năng quên mật khẩu');
//   };

//   const handleSocialLogin = (provider) => {
//     alert('Đăng nhập bằng: ' + provider);
//   };

//   const handleSignUp = () => {
    
//   };
//   return {
//     form,
//     handleChange,
//     handleSubmit,
//     handleForgotPassword,
//     handleSocialLogin,
//     handleSignUp
//   };
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function useSignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(""); // Reset lỗi trước khi gửi request
  setLoading(true); // Hiển thị loading

  try {
    await login(form.username.trim(), form.password);
    navigate("/"); // Chuyển hướng sau khi đăng nhập thành công
  } catch (err) {
    // Kiểm tra xem response có chứa thông báo "Invalid credentials" hay không
    const msg = 
      err?.response?.data?.detail === "No active account found with the given credentials"
        ? "Tên đăng nhập hoặc mật khẩu không đúng."
        : err?.response?.data?.detail || 
          err?.response?.data?.error || 
          err?.message || 
          "Đăng nhập thất bại";
    
    setError(msg); // Hiển thị thông báo lỗi
  } finally {
    setLoading(false); // Dừng loading
  }
};

  const handleForgotPassword = () => {
    alert("Chức năng quên mật khẩu đang phát triển");
  };

  const handleSocialLogin = (provider) => {
    alert(`Chức năng đăng nhập bằng ${provider} đang phát triển`);
  };

  return {
    form,
    loading,
    error,
    handleChange,
    handleSubmit,
    handleForgotPassword,
    handleSocialLogin,
  };
}