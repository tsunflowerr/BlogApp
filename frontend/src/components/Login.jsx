import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {toast, ToastContainer}  from "react-toastify"
import { FaBlogger } from "react-icons/fa6"
import {Lock, Mail, Eye, EyeOff, LogIn} from "lucide-react"

const url = "http://localhost:4000"
const INITIAL_FORM = {email: "", password: ""}
const Login = ({onSubmit, onSwitchMode}) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [formData, setFormData] = React.useState(INITIAL_FORM)
    const navigate = useNavigate(); 
    const [rememberMe, setRememberMe] = React.useState(false);
    const location = useLocation()
    const from = location.state?.from || "/";

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if(token) {
            (async () => {
                try {
                    const {data} = await axios.get(`${url}/api/users/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if(data?.success) {
                        onSubmit?.({token, userId, ...data.user});
                        toast.success("Session restored successfully")
                        navigate(from, {replace: true})
                    }
                    else {
                        localStorage.clear()
                    }
                }
                catch(error) {
                    localStorage.clear()
                    console.error("Error restoring session:", error);
                    toast.error("Session restoration failed, please log in again")
                }
            })()
        };
    }, [navigate, onSubmit, from])

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(!rememberMe) {
            toast.error("Please agree to remember me")
            return
        }
        setLoading(true)
        try {
            const {data} = await axios.post(`${url}/api/users/login`, formData);
            if(!data.token) throw new Error(data.message || "Login failed. Please try again");

            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.user.id)
            setFormData(INITIAL_FORM)
            onSubmit?.({token:data.token, userId:data.user.id, ...data.user});
            toast.success("Login successful")
            navigate(from, {replace: true})
        }
        catch(error) {
            const msg = error.response?.data?.message || error.message
            toast.error(msg)
        }
        finally{
            setLoading(false)
        }
    }

    const handleSwitchMode = () => {
        toast.dismiss()
        onSwitchMode?.()
    }

    const fields = [
        {
            name: "email",
            type: "email",
            placeholder: "Email", 
            icon: Mail,
        },
        {
            name: "password",
            type: showPassword ? "text" : "password",
            placeholder: "Password",
            icon: Lock, 
            isPassword: true
        }
    ]

    return (
        <div className="md:max-w-7xl max-w-lg bg-gradient-to-r from-sky-50 to-white w-full border-sky-200 shadow shadow-blue-200 border rounded-4xl flex flex-col">
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar/>
            <div className="font-sans font-extrabold text-gray-600 text-3xl justify-start flex gap-3 items-center p-5">
                <FaBlogger className="w-12 h-12 text-blue-500"/> Blog
            </div>
            <div className="justify-center gap-10 bg-transparent items-center flex">
                <div className="w-128 border border-sky-200 shadow shadow-blue-200 rounded-3xl flex-col flex bg-white justify-center">
                    <div className="font-extrabold text-3xl text-gray-600 w-full flex justify-center mt-4">Login</div>
                    <form onSubmit={handleSubmit} className="space-y-6 mt-1  pl-8 pr-8 pt-8">
                        {fields.map(({name, type, placeholder, icon: Icon, isPassword}) => (
                            <div key={name} className="flex items-center border-white bg-gray-100 h-14 rounded-lg gap-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
                                <Icon className="w-5 h-5 text-blue-400 ml-2" />
                                <input type={type} placeholder={placeholder} value={formData[name]} onChange={(e) => setFormData({...formData, [name]: e.target.value})}
                                className="w-full focus:outline-none text-sm text-gray-700" required/>

                                {isPassword && (
                                    <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="ml-2 text-gray-500">
                                        {showPassword ? <EyeOff className="w-5 h-5 mr-3 cursor-pointer" /> : <Eye className="w-5 h-5 mr-3 cursor-pointer"/>}
                                    </button>
                                )}
                            </div>
                        ))}
                        <div className="flex items-center">
                            <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={() =>setRememberMe(!rememberMe)} className="h-4 w-4" required/>
                            <label  htmlFor="rememberMe" className="ml-2 text-sm text-gray-500 font-bold">Remember me</label>
                        </div>
                        <button type="submit" disabled ={loading} className="flex bg-blue-600 cursor-pointer items-center justify-center w-full h-14 border rounded-xl gap-2 font-bold text-md text-white">
                            {loading ? (
                                "Loading in..."
                            ) : (
                                <>
                                    <LogIn className='w-5 h-5' />
                                    Login
                                </>
                            )}
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-600">
                        Don't have an account? {' '}
                        <button onClick={handleSwitchMode} className="text-blue-500 cursor-pointer hover:text-blue-700 hover:underline font-medium transition-colors mt-1 mb-4">
                            Sign Up
                        </button>
                    </p>
                </div>
                <img src="src/assets/bg.png" className="hidden md:flex" width="550" alt="login illustration" />
            </div>

        </div>
    )
}
export default Login;
    