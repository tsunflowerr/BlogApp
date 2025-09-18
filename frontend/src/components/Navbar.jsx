import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { FaBlogger } from "react-icons/fa6";
import { IoSearchOutline, IoNotifications } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import { IoMdTrendingUp } from "react-icons/io";
import { RiUserFollowFill } from "react-icons/ri";
import { LogOut, ChevronDown, Settings, Bell } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const url_api = "http://localhost:4000/api";

const Navbar = ({ user = null, onLogout, onHomeClick, timeAgo }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const menuref = useRef(null);
  const dropdownRef = useRef(null);

  // Icon cho notification
  const getNotificationIcon = (type) => {
    switch (type) {
      case "friend_request":
        return "👤";
      case "comment":
        return "💬";
      case "like":
        return "❤️";
      case "tag":
        return "🏷️";
      case "post":
        return "📝";
      default:
        return "🔔";
    }
  };


  // Đánh dấu đã đọc
  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${url_api}/notification/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const { data } = await axios.get(`${url_api}/notification/`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (data.success) {
          setNotifications(data.notification);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
        toast.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    const handleClickOutside = (event) => {
      if (menuref.current && !menuref.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [user]);

  return (
    <header className="sticky top-0 bg-white shadow-sm font-sans border-b border-gray-200 z-50">
      <div className="px-4 md:px-6 w-full mx-auto items-center flex">
        {/* Logo + Search */}
        <div className="flex py-2 items-center md:gap-5 gap-1 flex-1">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => {
              navigate("/");
              onHomeClick();
              window.scroll({ top: 0, behavior: "smooth" });
            }}
          >
            <FaBlogger className="w-10 h-10 text-blue-500" />
            <span className="text-2xl font-extrabold hidden lg:block text-blue-500">
              Blog
            </span>
          </div>

          <div className="relative flex-1 max-w-sm">
            <IoSearchOutline className="absolute mt-2.5 mr-1 inset-y-0 left-3 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Tìm kiếm trên Blog..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-gray-100 focus:bg-white text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 lg:gap-10 pt-2 flex-1 2xl:mr-60">
          {/* Home */}
          <NavLink
            to="/"
            end
            onClick={() => {
              onHomeClick();
              window.scroll({ top: 0, behavior: "smooth" });
            }}
            className={({ isActive }) =>
              `flex items-center justify-center lg:w-28 w-18 h-12 gap-2 cursor-pointer transition-colors relative ${
                isActive
                  ? "text-blue-500 border-b-blue-500 border-b-4"
                  : "text-gray-600 rounded-lg hover:bg-gray-100"
              }`
            }
          >
            <AiFillHome className="lg:w-6 lg:h-6 hidden lg:block" />
            <p className="mt-1 font-bold lg:text-md text-sm">Home</p>
          </NavLink>

          {/* Trending */}
          <NavLink
            to="/trending"
            onClick={() => {
              onHomeClick();
              window.scroll({ top: 0, behavior: "smooth" });
            }}
            className={({ isActive }) =>
              `flex items-center justify-center lg:w-28 w-18 h-12 gap-3 cursor-pointer transition-colors relative ${
                isActive
                  ? "text-blue-500 border-b-blue-500 border-b-4"
                  : "text-gray-600 rounded-lg hover:bg-gray-100"
              }`
            }
          >
            <IoMdTrendingUp className="lg:w-6 lg:h-6 hidden lg:block" />
            <p className="mt-1 font-bold lg:text-md text-sm">Trending</p>
          </NavLink>

          {/* Follower */}
          <NavLink
            to="/following"
            onClick={() => {
              onHomeClick();
              window.scroll({ top: 0, behavior: "smooth" });
            }}
            className={({ isActive }) =>
              `flex items-center justify-center lg:w-28 w-18 h-12 gap-2 cursor-pointer transition-colors relative ${
                isActive
                  ? "text-blue-500 border-b-blue-500 border-b-4"
                  : "text-gray-600 rounded-lg hover:bg-gray-100"
              }`
            }
          >
            <RiUserFollowFill className="lg:w-6 lg:h-6 hidden lg:block" />
            <p className="mt-1 font-bold lg:text-md text-sm">Following</p>
          </NavLink>

          {/* Follower */}
          <NavLink
            to="/follower"
            onClick={() => {
              onHomeClick();
              window.scroll({ top: 0, behavior: "smooth" });
            }}
            className={({ isActive }) =>
              `flex items-center justify-center lg:w-28 w-18 h-12 gap-2 cursor-pointer transition-colors relative ${
                isActive
                  ? "text-blue-500 border-b-blue-500 border-b-4"
                  : "text-gray-600 rounded-lg hover:bg-gray-100"
              }`
            }
          >
            <RiUserFollowFill className="lg:w-6 lg:h-6 hidden lg:block" />
            <p className="mt-1 font-bold lg:text-md text-sm">Follower</p>
          </NavLink>
        </div>

        {/* Bên phải */}
        <div className="flex items-center gap-1">
          {user ? (
            <>
              {/* Notification */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen((prev) => !prev)}
                  className={`${
                    open ? "text-blue-500" : ""
                  } p-2 text-gray-600 transition-colors duration-300 hover:bg-blue-50 rounded-full`}
                >
                  <IoNotifications className="w-6 h-6" />
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-100 bg-white shadow-lg rounded-xl border border-gray-200 z-50 max-h-128 overflow-y-auto">
                    {loading ? (
                      <div className="p-4 text-center text-gray-500">
                        Đang tải...
                      </div>
                    ) : notifications.length > 0 ? (
                      <div className="divide-y divide-gray-100 p-2 gap-4 flex flex-col">
                        <div className="font-bold text-gray-700 font-sans text-2xl px-2">Notifications</div>
                        {notifications.slice(0,7).map((notification) => (
                          <div
                            key={notification._id}
                            onClick={() => {markAsRead(notification._id), navigate(`/posts/${notification.postId}`)}}
                            className={`p-3 hover:bg-gray-100 cursor-pointer transition-colors ${
                              !notification.isRead ? "bg-blue-50" : ""
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              {/* Avatar */}
                              <div className="relative">
                                <div className="w-12 h-12 rounded-full overflow-hidden">
                                  {notification.user.avatar ? (
                                    <img
                                      src={notification.user.avatar}
                                      alt={notification.user.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                      {notification.user.username[0]?.toUpperCase() ||
                                        "U"}
                                    </div>
                                  )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-white">
                                  <span className="text-xs">
                                    {getNotificationIcon(notification.type)}
                                  </span>
                                </div>
                              </div>

                              {/* Nội dung */}
                              <div className="flex-1 min-w-0">
                                <p className="font-sans text-gray-700">
                                  <span className="font-semibold text-[18px]">
                                    {notification.user.username}
                                  </span>{" "}
                                  {notification.content}
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                  {timeAgo(notification.createAt)}
                                </p>
                              </div>

                              {/* Chưa đọc */}
                              {!notification.isRead && (
                                <div className="w-3 h-3 bg-blue-600 rounded-full mt-1"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>Không có thông báo nào</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User menu */}
              <div ref={menuref} className="relative">
                <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-purple-200"
                >
                  <div className="relative">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Avatar"
                        className="w-9 h-9 rounded-full shadow-sm"
                      />
                    ) : (
                      <div className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white font-semibold shadow-md rounded-full">
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>

                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-800">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                      menuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {menuOpen && (
                  <ul className="absolute top-14 right-0 w-56 bg-white rounded-2xl shadow-xl border border-purple-100 z-50 overflow-hidden animate-fadeIn">
                    <li className="p-2">
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          navigate(`/profile/${user._id}`);
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-purple-50 text-sm text-gray-700 flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4 text-gray-700" />
                        Profile Settings
                      </button>
                    </li>
                    <li className="p-2">
                      <button
                        onClick={onLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-red-50 text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 ml-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
