// src/components/ProtectedRoute.jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, currentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
  if (!currentUser) {
    toast.info("Bạn phải đăng nhập để xem trang này", { autoClose: 2000, position: "top-center" });

    const timer = setTimeout(() => {
      navigate("/login", { state: { from: location.pathname }, replace: true });
    }, 3000);

    return () => clearTimeout(timer); // clear nếu component unmount
  }
}, [currentUser, navigate, location.pathname]);

return currentUser ? children : null;
};

export default ProtectedRoute;
