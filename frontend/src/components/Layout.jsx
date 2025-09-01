import React, { use, useCallback, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
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
        setLoading(true)
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
      finally {
        setLoading(false)
      }
    },[onLogout])
    useEffect(() => {
        fetchCategories();
        fetchPosts();
    }, [fetchCategories, fetchPosts]);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex flex-1 justify-between w-full bg-gray-50 font-sans">
        <div className="justify-center w-full items-center px-3 flex-col">
          <Outlet/>
        </div>
        <div className="hidden md:flex flex-col gap-5 mt-5 mr-8 sticky w-110 h-full">
          <div className="border-2 rounded-2xl flex flex-col gap-3 items-center px-3 py-2.5 bg-white border-gray-100 shadow shadow-gray-200">
            <div className="text-xl font-bold flex gap-3 text-center  text-gray-700">
              <IoMdTrendingUp  className="w-6 mt-1 h-6 text-orange-500"/>Trending categories
            </div>
            {loading && <div className="animate-spin h-7 w-7 border-4 border-blue-500 border-t-transparent ml-6 rounded-full"></div>}
            <div className="w-full flex flex-col gap-4 mt-2 ">
              {categories.map((category) => (
              <div key={category.categoryId} onClick={() => navigate(`/category/${category.slug}`)} className="cursor-pointer font-semibold text-xl text-gray-600 justify-between flex items-center pl-2 pr-2 ">
                <span className="flex gap-2 items-center">
                  <FiHash className="w-5 h-5 text-center text-gray-400"/> {category.name}
                </span>
                <span className="bg-gray-200 text-gray-700 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded-full">{category.totalPosts}</span>
              </div>
            ))}
            </div>
          </div>
          <div className="border-2 rounded-2xl flex flex-col gap-3 items-center px-3 py-2.5 bg-white border-gray-100 shadow shadow-gray-200">
              <div className="text-xl font-bold flex gap-3 text-center text-gray-700">
                <Clock  className="w-6 mt-0.5 h-6 text-blue-500"/>Recently posted 
              </div>
                {loading && <div className="animate-spin h-7 w-7 border-4 border-blue-500 border-t-transparent ml-6 rounded-full"></div>}
                <div className="w-full flex flex-col gap-2 mt-2">
                  {posts.slice(0, 4).map((post) => (
                    <div key={post._id} onClick={() => navigate(`/posts/${post._id}`)} className="cursor-pointer font-semibold text-xl text-gray-600 justify-start flex flex-col px-2">
                      <span className="text-lg text-gray-700">{post.title}</span>
                      <span className="text-sm text-gray-400">{post.author.username} • {timeAgo(post.createAt)} </span>
                    </div>
                  ))}
                </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
