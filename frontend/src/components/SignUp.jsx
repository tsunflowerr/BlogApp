import React, { use, useState } from "react";
import {Mail, User, Lock, Eye, EyeOff, UserPlus, } from "lucide-react"
import { toast, ToastContainer } from "react-toastify";
import { FaBlogger } from "react-icons/fa6";
import axios from "axios";
const API_URL = "http://localhost:4000";
const INITIAL_FORM = {username: "", email:"", password:""}
const SignUp = ({onSwitchMode}) => {

    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState(INITIAL_FORM)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({text:"", type:""})
    const fields = [
        {
            name: "username",
            type: "text",
            placeholder:"Full Name",
            icon: User
        },
        {
            name: "email",
            type: "email",
            placeholder: "Email",
            icon: Mail
        },

        {
            name: "password",
            type: showPassword ? "text" : "password" ,
            placeholder: "Password",
            icon: Lock,
            isPassword: true
        }
    ]

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true)
        setMessage({text:"", type:""})
        try {
            const { data } = await axios.post(`${API_URL}/api/users/register`, formData)
            console.log("SignUp successful:", data)
            setMessage({text:"Sign Up successfully! Please login", type:"success"});
            setFormData(INITIAL_FORM)
        }
        catch(error) {
            console.error("Sign Up error", error)
            setMessage({text:error.response?.data?.message || "Sign up failed. Please try again"})
        }
        finally{
            setLoading(false)
        }
    }

    return (
            <div className="md:max-w-7xl max-w-lg bg-gradient-to-r from-sky-50 to-white w-full border-sky-200 shadow shadow-blue-200 border rounded-4xl flex flex-col">
                <ToastContainer position="top-center" autoClose={3000} hideProgressBar/>
                <div className="font-sans font-extrabold text-gray-600 text-3xl justify-start flex gap-3 items-center p-5">
                    <FaBlogger className="w-12 h-12 text-blue-500"/> Blog
                </div>
                <div className="justify-center gap-10 bg-transparent items-center flex">
                    <div className="w-128 border border-sky-200 shadow shadow-blue-200 rounded-3xl flex-col flex bg-white justify-center">
                        <div className="font-extrabold text-3xl text-gray-600 w-full flex justify-center mt-4">Sign Up</div>
                        {message.text && (
                            <div className={message.type === 'success' ? "bg-green-200 text-green-600 mt-6 mr-10 ml-10 border-transparent rounded-lg text-center justify-center font-sans font-bold flex" : "bg-red-200 text-center justify-center font-sans font-bold flex mt-6 mr-10 ml-10 border-transparent rounded-lg text-red-600"}>{message.text}</div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-5 mt-1  pl-8 pr-8 pt-8">
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
                            <button type="submit" disabled ={loading} className="flex bg-blue-600 cursor-pointer items-center justify-center w-full h-14 border rounded-xl gap-2 font-bold text-md text-white">
                                {loading ? (
                                    "Signing up"
                                ) : (
                                    <>
                                        <UserPlus className='w-5 h-5' />
                                        Sign up
                                    </>
                                )}
                            </button>
                        </form>
                        <p className="text-center text-sm text-gray-600">
                            Already have an account ? {' '}
                            <button onClick={onSwitchMode} className="text-blue-500 cursor-pointer hover:text-blue-700 hover:underline font-medium transition-colors mt-1 mb-4">
                                Login
                            </button>
                        </p>
                    </div>
                    <img src="src/assets/bg.png" className="hidden md:flex" width="550" alt="login illustration" />
                </div>
    
            </div>
        )
}
export default SignUp