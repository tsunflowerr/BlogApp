  import React, { use, useCallback, useEffect, useState } from "react";
  import { Outlet } from "react-router-dom";
  import Navbar from "../Navbar";
  import { useNavigate } from "react-router-dom";
  import { IoMdTrendingUp } from "react-icons/io";
  import axios from "axios";
  import {toast}  from "react-toastify"
  import { FiHash } from "react-icons/fi";
  import { Clock } from "lucide-react";

  const url = "http://localhost:4000"
  const Layout = ({ user, onLogout }) => {
      const [dbpage, setDbPage] = React.useState(1)
      const [trendingPage, setTrendingPage] = useState(1);
      const [followersPage, setFollowersPage] = useState(1);

      const timeAgo = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      const seconds = Math.floor((new Date() - date) / 1000);

      let interval = Math.floor(seconds / 31536000);
      if (interval >= 1) return `${interval} year${interval > 1 ? "s" : ""} ago`;
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) return `${interval} month${interval > 1 ? "s" : ""} ago`;
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) return `${interval} day${interval > 1 ? "s" : ""} ago`;
      interval = Math.floor(seconds / 3600);
      if (interval >= 1) return `${interval} hour${interval > 1 ? "s" : ""} ago`;
      interval = Math.floor(seconds / 60);
      if (interval >= 1) return `${interval} minute${interval > 1 ? "s" : ""} ago`;
      return "Just now";
    };

    return (
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} timeAgo={timeAgo}  onHomeClick={() => {setDbPage(1); setFollowersPage(1); setTrendingPage(1)}} onLogout={onLogout} />
        <div className="flex flex-1 gap-10 w-full justify-center bg-gray-50 font-sans">
          <div className="justify-center w-full items-center flex-col">
            <Outlet context={{timeAgo, user}}/>
          </div>
        </div>
      </div>
    );
  };

  export default Layout;
