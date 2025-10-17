import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import { useCallback } from "react";
import { Icon, Type, X } from "lucide-react";
import { RxAvatar } from "react-icons/rx";
import { User } from "lucide-react";
import { Mail } from "lucide-react";
const url_api = "http://localhost:4000/api"
const EditProfile = ({currentUser, setCurrentUser, openEdit, closeEdit, openChangePassword, closeChangePassword, openDeleteUser, closeDeleteUser, onLogout}) => {
    const [profile, setProfile] = React.useState({
  username: currentUser?.name, 
  email: currentUser?.email,
  avatar: currentUser?.avatar
})
    const [inputDelete, setInputDelete] = React.useState("")
    const [password, setPassword] = React.useState({current:"", new:"", confirm:""})
    const personalFields = [
    { name: "username", type: "text", placeholder: "Full Name", icon: User },
    { name: "email", type: "email", placeholder: "Email", icon: Mail },
    {name:"avatar", type:"text" ,placeholder:"avatar", icon: RxAvatar }
]
    const passwordFields = [
        {name:"current", label: "Old password", type:"text", placeholder: "Current Password"},
        {name: "new", label: "New password", type:"text", placeholder: "New Password"},
        {name: "confirm", label: "Confirm password", type: "text", placeholder:"Confirm your password"}
    ]
    const handleDeleteUser = async() => {
        try {
            const token = localStorage.getItem("token")
            const {data} = await axios.delete(`${url_api}/users/me`, {headers:{Authorization:`Bearer ${token}`}})
            if(data.success) {
                toast.success("Delete user successfully")
                localStorage.removeItem("token")
                localStorage.removeItem("userId")
                closeDeleteUser?.()
                onLogout?.()
                setInputDelete("")
            }
            else toast.error(data.message)
        }
        catch(err) {
            toast.error(err.response?.data?.message || "Error delete")
            console.log("Sever error")
        }
    }
    const authDeleteUser = async(e) => {
        e.preventDefault()
        if(inputDelete.toLowerCase() === currentUser.name.toLowerCase()) {
            handleDeleteUser();
        }
        else {
            toast.error("Incorrect name for uthorization")
        }
    }

    const handleUpdateUser = async(e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem("token")
            const {data} = await axios.put(`${url_api}/users/me`, {username: profile.username, email:profile.email, avatar:profile.avatar}, {headers:{Authorization:`Bearer ${token}`}})
            if(data.success === true) {
                setCurrentUser((prev) => ({
                    ...prev,
                    name: data.user.username,
                    email: data.user.email,
                    avatar: data.user.avatar,
                    isAdmin: data.user.isAdmin,
                    _id: data.user._id

                }))
                toast.success("User update successfully")
                closeEdit()
            }
            else toast.error(data.message)
        }
        catch(err) {
            toast.error(err.response?.data?.message || "Profile Update failed")
        }
    }
    const changePassword = async(e) =>{
        e.preventDefault()
        if(password.new !== password.confirm) {
            return toast.error("Password do not match")
        }
        try {
            const token = localStorage.getItem('token')
            const {data} = await axios.put(`${url_api}/users/password`, {oldPassword: password.current, newPassword:password.new}, {headers:{Authorization:`Bearer ${token}`}})
            if(data.success) {
                toast.success("Password changed")
                setPassword({current:"", new:"" , confirm:""})
            }
            else toast.error(data.message)
            closeChangePassword()
        }
        catch(err) {
            toast.error(err.response?.data?.message || "Password change failed")
        }
    }
    return (
        <>
        {openEdit && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 z-50 flex items-center justify-center p-4">
            <div className=" bg-white border border-white rounded-2xl max-w-2xl w-full">
                <div className="flex justify-end text-gray-500 p-4">
                    <X onClick={closeEdit} className="w-7 h-7 cursor-pointer" />
                </div>
                <form onSubmit={handleUpdateUser} className="space-y-4" >
                    <div className="flex justify-center font-bold">
                        <h1 className="text-3xl text-gray-600">Update User</h1>
                    </div>
                    {personalFields.map(({name, type, placeholder, icon:Icon}) => (
                        <div key={name} className="flex flex-col mx-10">
                            <h1 className="text-md font-bold text-gray-600">{name.charAt(0).toLocaleUpperCase() + name.slice(1)}</h1>
                            <div className="flex bg-gray-100 border border-white rounded-2xl h-14 items-center gap-2 mb-3 px-2 focus-within:ring-2 focus-within:ring-blue-500">
                                <Icon className="w-6 h-6 text-blue-500"/>
                                <input type={type} placeholder={placeholder} value={profile[name]} onChange={(e) => setProfile({...profile, [name]: e.target.value})} className="focus:outline-none text-gray-700 font-sans w-full h-full"/>
                            </div>
                        </div>
                    ))}
                    <div className="flex gap-2 justify-end mr-5 mb-5">
                        <button className="border bg-gray-200 text-lg hover:cursor-pointer border-white font-bold text-gray-600 rounded-lg w-20 h-10" onClick={closeEdit}>Cancel</button>
                        <button type="submit" className="border bg-blue-500 text-lg hover:cursor-pointer  border-white font-bold text-white rounded-lg w-20 h-10">Save</button>
                    </div>
                </form>
            </div>
            </div>}

            {openChangePassword && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 z-50 flex items-center justify-center p-4">
            <div className=" bg-white border border-white rounded-2xl max-w-2xl w-full">
                <div className="flex justify-end text-gray-500 p-4">
                    <X onClick={closeChangePassword} className="w-7 h-7 cursor-pointer" />
                </div>
                <form onSubmit={changePassword} className="space-y-4" >
                    <div className="flex justify-center font-bold">
                        <h1 className="text-3xl text-gray-600">Change Password</h1>
                    </div>
                    {passwordFields.map(({name, label, type, placeholder}) => (
                        <div key={name} className="flex flex-col mx-10 gap-1">
                            <h1 className="text-lg font-bold text-gray-600">{label}</h1>
                            <div className="flex bg-gray-100 border border-white rounded-2xl h-14 items-center gap-2 mb-3 px-2 focus-within:ring-2 focus-within:ring-blue-500">
                                <input type={type} placeholder={placeholder} value={password[name]} onChange={(e) => setPassword({...password, [name]: e.target.value})} className="focus:outline-none text-gray-700 font-sans w-full h-full"/>
                            </div>
                        </div>
                    ))}
                    <div className="flex gap-2 justify-end mr-5 mb-5">
                        <button className="border bg-gray-200 text-lg hover:cursor-pointer border-white font-bold text-gray-600 rounded-lg w-20 h-10" onClick={closeChangePassword}>Cancel</button>
                        <button type="submit" className="border bg-blue-500 text-lg hover:cursor-pointer  border-white font-bold text-white rounded-lg w-20 h-10">Save</button>
                    </div>
                </form>
            </div>
            </div>}

            {openDeleteUser && 
            <div className="fixed inset-0 backdrop-blur-sm bg-black/20 z-50 flex justify-center items-center p-4">
                <div className="bg-white border rounded-3xl border-transparent flex flex-col">
                    <div className="flex justify-end text-gray-500 p-4">
                        <X onClick={closeDeleteUser} className="w-7 h-7 cursor-pointer" />
                    </div>
                    <form onSubmit={authDeleteUser} className="space-y-2 flex flex-col">
                        <h1 className="font-bold text-shadow-gray-700 text-2xl text-center">Delete User</h1>
                        <span className="font-semibold text-gray-600 text-md p-3">Please type your username to confirm account deletion. This action cannot be undone</span>
                        <textarea name="Authorization" rows="5" onChange={e => setInputDelete(e.target.value)} value={inputDelete} placeholder="Enter your account name " className="border border-gray-400 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none p-3 m-5"/>
                        <div className="flex gap-2 justify-end mr-5 mb-5">
                            <button className="border bg-gray-200 text-lg hover:cursor-pointer border-white font-bold text-gray-600 rounded-lg w-20 h-10" onClick={closeDeleteUser}>Cancel</button>
                            <button type="submit" className="border bg-blue-500 text-lg hover:cursor-pointer  border-white font-bold text-white rounded-lg w-20 h-10">Save</button>
                        </div>    
                    </form>
                </div>
            </div>}
        </>

    )
}
export default EditProfile;