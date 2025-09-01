import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBlogger } from "react-icons/fa6"
import { IoSearchOutline } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import { IoMdTrendingUp } from "react-icons/io";
import { RiUserFollowFill } from "react-icons/ri";
import { LogOut, ChevronDown, Settings } from "lucide-react";
import { IoNotifications } from "react-icons/io5";
import { NavLink } from "react-router-dom";


const Navbar = ({user=null, onLogout}) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isLoggedIn, setIsLoggedIn] = useState(!!user)
    const [menuOpen, setMenuOpen] = useState(false)
    const menuref = React.useRef(null)
    const handleMenuToggle = () => setMenuOpen((prev) => !prev)

    const handleLogout = () => {
        setMenuOpen(false)
        setIsLoggedIn(false)
        onLogout()
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if(menuref.current && !menuref.current.contains(event.target)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return() => document.removeEventListener("mousedown", handleClickOutside)
    },[])
    return (
        <header className="sticky top-0 bg-white shadow-sm font-sans border-b border-gray-200 z-50">
            <div className="px-4 md:px-6 w-full mx-auto items-center flex">
                <div className="flex py-2 items-center md:gap-5 gap-1 flex-1">
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
                        <div className="flex items-center justify-center">
                            <FaBlogger className="w-10 h-10 text-blue-500"/>
                        </div>
                        <span className="text-center items-center text-2xl font-extrabold hidden lg:block text-blue-500">Blog</span>
                    </div>
                    <div className="relative flex-1 max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IoSearchOutline className="w-4 h-4 text-gray-400" />
                        </div>
                        <input type="search" name="q" placeholder="Tìm kiếm trên Blog..." className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-gray-100 appearance-none focus:bg-white text-sm"></input>
                    </div>
                </div>
                <div className="flex items-center gap-1 lg:gap-10 pt-2 flex-1 2xl:mr-60">
      
                    {/* Home */}
                    <NavLink 
                            to="/" 
                            end
                            className={({ isActive }) => 
                            `flex items-center justify-center lg:w-28 w-18 h-12 gap-3 cursor-pointer transition-colors relative ${
                                isActive 
                                ? "text-blue-500 border-b-blue-500 border-b-4" 
                                : "text-gray-600 rounded-lg hover:bg-gray-100"
                            }`
                            } >
                            <AiFillHome className="lg:w-6 lg:h-6 hidden lg:block"/>
                            <p className="text-center mt-1 font-bold lg:text-md text-sm">Home</p>
                    </NavLink>

                    {/* Trending */}
                    <NavLink 
                        to="/trending" 
                        className={({ isActive }) => 
                        `flex items-center justify-center lg:w-28 w-18 h-12 gap-4 cursor-pointer transition-colors relative ${
                            isActive 
                            ? "text-blue-500 border-b-blue-500 border-b-4" 
                            : "text-gray-600 rounded-lg hover:bg-gray-100"
                        }`
                        }>
                        <IoMdTrendingUp className="lg:w-6 lg:h-6 hidden lg:block"/>
                        <p className="text-center mt-1 font-bold lg:text-md text-sm">Trending</p>
                    </NavLink>

                    {/* Follower */}
                    <NavLink 
                        to="/follower" 
                        className={({ isActive }) => 
                        `flex items-center justify-center lg:w-28 w-18 h-12 gap-3 cursor-pointer transition-colors relative ${
                            isActive 
                            ? "text-blue-500 border-b-blue-500 border-b-4" 
                            : "text-gray-600 rounded-lg hover:bg-gray-100"
                        }`
                        }>
                        <RiUserFollowFill className="lg:w-6 lg:h-6 hidden lg:block"/> 
                        <p className="text-center mt-1 font-bold lg:text-md text-sm">Follower</p>
                    </NavLink>

                    <NavLink 
                        to="/follower" 
                        className={({ isActive }) => 
                        `flex items-center justify-center lg:w-28 w-18 h-12 gap-3 cursor-pointer transition-colors relative ${
                            isActive 
                            ? "text-blue-500 border-b-blue-500 border-b-4" 
                            : "text-gray-600 rounded-lg hover:bg-gray-100"
                        }`
                        }>
                        <RiUserFollowFill className="lg:w-6 lg:h-6 hidden lg:block"/> 
                        <p className="text-center mt-1 font-bold lg:text-md text-sm">Follower</p>
                    </NavLink>

                </div>
                <div className="flex items-center  gap-1">
                    {isLoggedIn ? (
                        <> 
                            <button className="p-2 text-gray-600 hover:text-blue-500 transition-colors duration-300 hover:bg-blue-50 rounded-full
                            ">
                                <IoNotifications className="w-6 h-6"> </IoNotifications>
                            </button>
                            <div ref={menuref} className="relative">
                                  <button onClick={handleMenuToggle} className= 'flex items-center gap-2 px-3 py-2 rounded-2xl bg-transparent hover:bg-purple-200'>
                            <div className= 'relative'>
                                {user.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="w-9 h-9 rounded-full shadow-sm" />
                                ) : (
                                    <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white font-semibold shadow-md">
                                        {user.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                )}
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 boder-white animate-pulse">
                                </div>
                            </div>

                            <div className = 'text-left hidden md:block'>
                                <p className = 'text-sm font-medium text-gray-800'>{user.name} </p>
                                <p className = 'text-xs text-gray-500'>{user.email}</p> 
                            </div>

                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {menuOpen && (
                            <ul className="absolute top-14 right-0 w-56 bg-white rounded-2xl shadow-x1 border border-purple-100 z-50 overflow-hidden animate-fadeIn">
                                <li className = 'p-2'>
                                    <button onClick={() =>{
                                        setMenuOpen(false)
                                        navigate("/profile")
                                    }}
                                    className="w-full px-4 py-2.5 text-left hover:bg-purple-50 text-sm text-gray-700 transition-colors flex items-center gap-2 group" role ='menuitem'>
                                        <Settings className="w-4 h-4 text-gray-700" />
                                        Profile Settings
                                    </button>
                                </li>

                                <li className ='p-2'>
                                    <button onClick={handleLogout} className = 'flex w-full items-center gap-2 rouned-lg px-3 py-2 text-sm hover:bg-red-50 text-red-600 '>
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </li>
                            </ul>)}
                            </div>
                        </>
                    ) : (
                        <>
                                <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm cursor-pointer font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                                    Đăng nhập
                                </button>
                                <button onClick={() => navigate('/signup')} className="px-4 py-2 text-sm cursor-pointer font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                                    Đăng ký
                                </button>
                       </>
                    )}
                </div>
            </div>
        </header>
    )
}
export default Navbar
