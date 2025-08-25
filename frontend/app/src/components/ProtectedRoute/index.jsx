import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading, fetchUser } = useAuth();
  const [checked, setChecked] = useState(false); // Đảm bảo chỉ fetchUser 1 lần
  useEffect(() => {
    const init = async () => {
      if (!user) {
        try {
          await fetchUser(); // Gọi 1 lần để lấy user
        } catch (err) {
          console.log(err);
          return <Navigate to="/login" />;
          }
        }
      }
      setChecked(true); // Đánh dấu đã xử lý
    
    init();
  }, []);

  // Hiển thị loading trong khi đang fetch user
  if (!checked || loading) {
    return <p>Loading...</p>;
  }

  // Nếu sau khi fetch mà vẫn không có user
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Kiểm tra quyền truy cập nếu có (roles)
  if (roles && !roles.includes(user.role)) {
    alert("Bạn không có quyền để truy cập");
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;