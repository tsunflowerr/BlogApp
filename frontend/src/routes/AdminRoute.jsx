import React from "react";
import { toast } from "react-toastify";


const AdminRoute = ({currentUser}) => {
    if(currentUser === undefined) {
        return <div className="animate-spin h-7 w-7 border-4 border-blue-500 border-t-transparent ml-6 rounded-full"></div>
    }
    if (!currentUser) {
    toast.info("Bạn phải đăng nhập để xem trang này", { autoClose: 2000, position: "top-center" });

    const timer = setTimeout(() => {
      navigate("/login", { state: { from: location.pathname }, replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }
}