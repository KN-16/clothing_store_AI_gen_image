import { useState } from 'react';

export function useSignUp() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    phoneNumber: '',
    address: ''
  });

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const fieldLabels = {
      fullName: 'Họ và tên',
      username: 'Tên đăng nhập',
      email: 'Email',
      password: 'Mật khẩu',
      phoneNumber: 'Số điện thoại',
      address: 'Địa chỉ'
    };

    for (const field in fieldLabels) {
      if (!form[field]) {
        alert(`Vui lòng nhập ${fieldLabels[field]}.`);
        const input = document.querySelector(`[name="${field}"]`);
        if (input) input.focus();
        return;
      }
    }

    // Gửi request tới API
    try {
      const response = await fetch(`${apiUrl}/api/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        const data = await response.json();
        alert('Đăng ký thành công!');
        console.log('User:', data);
        // Optional: reset form
        setForm({
          fullName: '',
          email: '',
          username: '',
          password: '',
          phoneNumber: '',
          address: ''
        });
      } else {
        const errorData = await response.json();
        console.error('Lỗi:', errorData);
        alert('Đăng ký thất bại: ' + errorData.error);
      }
    } catch (error) {
      console.error('Lỗi kết nối:', error);
      alert('Có lỗi xảy ra khi kết nối đến máy chủ.');
    }
  };

  const handleSocialLogin = (provider) => {
    alert('Tính năng đăng nhập bằng ' + provider + ' đang được phát triển.');
  };

  return {
    form,
    handleSubmit,
    handleChange,
    handleSocialLogin,
  };
}