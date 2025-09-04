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
      const [categories, setCategories] = React.useState([]);
      const navigate = useNavigate();
      const [loading, setLoading] = React.useState(false);
      const [posts, setPosts] = React.useState([])
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


      const fetchCategories = useCallback(async () => {
          try {
              setLoading(true)
              const {data} = await axios.get(`${url}/api/posts/categories/trending`);
              setCategories(data.categories || []);
          }catch(error) {
              console.error("Error fetching categories:", error);
              toast.error("Failed to load categories");
              if(error.response && error.response.status === 401) {
                  onLogout();
              }
          }
          finally {
              setLoading(false)
          }
      }, [])

      const fetchPosts = useCallback(async () => {
        try {
          const {data} = await axios.get(`${url}/api/posts/`);
          setPosts(data.posts || []);
        }
        catch(error) {
          console.error("Error fetching posts:", error);
          toast.error("Failed to load posts");
          if(error.response && error.response.status === 401) {
            onLogout();
          }
        }
      },[onLogout])
      useEffect(() => {
          fetchCategories();
          fetchPosts();
      }, [fetchCategories, fetchPosts]);
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onHomeClick={() => {setDbPage(1); setFollowersPage(1); setTrendingPage(1)}} onLogout={onLogout} />
        <div className="flex flex-1 gap-10 w-full justify-center bg-gray-50 font-sans">
          <div className="justify-center mt-8 mb-8 ml-10 lg:ml-30 lg:mr-0 mr-10 w-full items-center flex-col">
            <Outlet context={{posts, setPosts: fetchPosts, timeAgo, user, dbpage, setDbPage, trendingPage, setTrendingPage, followersPage, setFollowersPage}}/>
          </div>
        </div>
      </div>
    );
  };

  export default Layout;
