import axios from "axios";
import { Delete, Edit, PackageSearch, Pen, Plus } from "lucide-react";
import React, { useCallback, useEffect } from "react";
import { useNavigate, useOutlet, useOutletContext, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PostModal from "./PostModal";
import { useLikePost } from "../hooks/useLikePost";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { MoreVertical, Edit2, Trash2, ChevronDown } from "lucide-react";
import EditProfile from "./EditProfile"
import { RxReset } from "react-icons/rx";
import { CiSquarePlus } from "react-icons/ci";
import { IoCheckmarkOutline } from "react-icons/io5";
import FollowListModal from "./FollowListModal"; // Import component mới

const url = "http://localhost:4000"

const Profile = ({currentUser, setCurrentUser, onLogout}) => {
    const [posts, setPosts] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [editProfile, setEditProfile] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    const [openMenuId, setOpenMenuId] = React.useState(null)
    const [isUpdate, setIsUpdate] = React.useState(false)
    const [postUpdate, setPostUpdate] = React.useState(false)
    const {userId} = useParams()
    const {timeAgo} = useOutletContext()
    const [openMenuEdit, setOpenMenuEdit] = React.useState(false)
    const [openChangePassword, setOpenChangePassword] = React.useState(false)
    const [openDeleteUser, setOpenDeleteUser] = React.useState(false)
    const [isFollow, setIsFollow] = React.useState(false)
    const [profileUser, setProfileUser] = React.useState(null)
    
    // States cho follow modals
    const [showFollowersModal, setShowFollowersModal] = React.useState(false)
    const [showFollowingsModal, setShowFollowingsModal] = React.useState(false)
    
    const navigate = useNavigate()
    
    const MENU_OPTIONS = [
        { action: "edit", label: "Edit Task", icon: <Edit2 size={14} className="text-blue-600" /> },
        { action: "delete", label: "Delete Task", icon: <Trash2 size={14} className="text-red-600" /> },
    ]

    const handleSaveFromModal = (savedPost) => {
        if (!savedPost) return
        setPosts(prev => {
            const exists = prev.find(p => p._id === savedPost._id)
            if (exists) {
                return prev.map(p => p._id === savedPost._id ? savedPost : p)
            }
            return [savedPost, ...prev]
        })
    }

    const saveDelete = (deletedPostId) => {
        setPosts(prevPosts => prevPosts.filter(post => post._id !== deletedPostId))
    }

    const getAuthHeader = () => {
        const token = localStorage.getItem('token')
        if(!token) throw new Error("No auth token found")
        return {Authorization: `Bearer ${token}`}
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${url}/api/posts/${id}`, {headers:getAuthHeader()})
            saveDelete(id)
            toast.success("Post delete successfully")
        }
        catch(err) {
            console.error(err)
            toast.error("Failed to delete post")
            if(err.response?.status === 401) onLogout?.()
        }
    }

    const handleFollow = async(id) => {
        try {
            const {data} = await axios.post(`${url}/api/users/${id}`, {}, {headers:getAuthHeader()})
            if(String(data.type) === "Follow") {
                setIsFollow(true)
                toast.success("Followed user successfully")
                // Cập nhật lại profileUser
                setProfileUser(prev => ({
                    ...prev,
                    followers: [...(prev?.followers || []), currentUser]
                }))
            }
            else {
                setIsFollow(false)
                toast.success("Unfollowed user successfully")
                // Cập nhật lại profileUser
                setProfileUser(prev => ({
                    ...prev,
                    followers: prev?.followers.filter(f => f._id !== currentUser._id) || []
                }))
            }
        }
        catch(err) {
            console.error("Failed to follow this user", err)
            toast.error("Failed to follow this user")
        }
    }

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const {data} = await axios.get(`${url}/api/posts/user/${userId}`)
                setPosts(data.posts || [])
            }
            catch(error) {
                console.log("Fail to fetch posts", error)
                toast.error("Fail to load posts")
            }
            finally {
                setLoading(false)
            }
        }

        const fetchUser = async() => {
            try {
                setLoading(true);
                const{data} = await axios.get(`${url}/api/users/me`,{headers:getAuthHeader()})
                const isFollowing = data.user.followings.some(f => f._id.toString() === userId)
                setIsFollow(isFollowing)
            }
            catch(err) {
                console.log("Fail to fetch user", err)
                toast.error("Fail to load user")
            }
            finally{
                setLoading(false)
            }
        }

        const fetchProfileUser = async() => {
            try {
                const {data} = await axios.get(`${url}/api/users/${userId}`)
                setProfileUser(data.user)
            }
            catch(err) {
                console.log("Fail to fetch profile user", err)
                toast.error("Fail to load user profile")
            }
        }

        fetchProfileUser()
        fetchPosts();
        fetchUser()
    },[userId,currentUser])

    const handleAction = (action, post) => {
        setOpenMenuId(false)
        if(action =='edit') {
            setIsUpdate(true)
            setOpen(true)
            setPostUpdate(post)
        }
        if(action == 'delete') handleDelete(post._id)
    }

    const {mutate: likePost} = useLikePost(setPosts)

    return (
        <>
        {loading && 
        <div className="items-center flex justify-center h-full">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"/>
        </div>}
        
        {!loading && <div className="gap-3 flex flex-col items-center">
            <div className="bg-white flex items-center mt-10 justify-evenly gap-12 w-full max-w-4xl border border-transparent rounded-3xl p-6">
                <div className="flex gap-5 justify-center items-center">
                    <img src={profileUser?.avatar || currentUser.avatar} alt="avatar" className="w-24 h-24 rounded-full object-cover"/>
                    <div className="flex flex-col gap-2">
                        <span className="text-3xl font-bold text-gray-700">
                            {profileUser?.username || currentUser.username}
                        </span>
                        <div className="flex gap-2 text-sm">
                            <button 
                                onClick={() => setShowFollowersModal(true)}
                                className="hover:underline font-semibold hover:cursor-pointer text-gray-600"
                            >
                                <span className="text-gray-800">{profileUser?.followers?.length || 0}</span> Followers
                            </button>
                            {"•"}
                            <button 
                                onClick={() => setShowFollowingsModal(true)}
                                className="hover:underline font-semibold hover:cursor-pointer text-gray-600"
                            >
                                <span className="text-gray-800">{profileUser?.followings?.length || 0}</span> Following
                            </button>
                        </div>
                    </div>
                </div>
                
                {currentUser._id === userId ? (
                    <div className="gap-3 flex">
                        <button className="bg-blue-500 gap-2 border flex hover:cursor-pointer md:w-42 w-18 h-10 justify-center items-center border-blue-500 rounded-2xl" onClick={() => {setOpen(true), setIsUpdate(false)}}>
                            <Plus className="w-5 h-5 text-white text-center"/>
                            <span className="font-sans text-white lg:block hidden font-semibold">Create a post</span>
                        </button>
                        <div className="relative">
                            <button className="bg-gray-200 gap-2 border flex border-transparent hover:cursor-pointer md:w-42 w-18 h-10 justify-center items-center rounded-2xl" onClick={() => setOpenMenuEdit(!openMenuEdit)}>
                                <Pen className="w-5 h-5 text-gray-800 text-center"/>
                                <span className="font-sans text-gray-800 lg:block hidden font-semibold">Edit profile</span>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${openMenuEdit ? 'rotate-180' : ''}`} />
                            </button>
                            {openMenuEdit && (
                                <ul className="absolute top-11 md:w-48 w-30 bg-white rounded-2xl shadow-xl border border-purple-100 z-50 overflow-hidden animate-fadeIn">
                                    <li className='p-2'>
                                        <button onClick={() => {setEditProfile(true), setOpenMenuEdit(false)}}
                                        className="w-full px-4 py-2.5 text-left hover:bg-gray-100 text-sm text-gray-700 transition-colors flex items-center gap-2 group">
                                            <Edit className="w-4 h-4 text-gray-700" />
                                            Edit info
                                        </button>
                                    </li>
                                    <li className='p-2'>
                                        <button onClick={() => {setOpenChangePassword(true), setOpenMenuEdit(false)}} className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-blue-50 text-blue-600'>
                                            <RxReset className="w-4 h-4" />
                                            Change Password
                                        </button>
                                    </li>
                                    <li className='p-2'>
                                        <button onClick={() => {setOpenDeleteUser(true),setOpenMenuEdit(false)}} className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-red-50 text-red-600'>
                                            <Delete className="w-4 h-4" />
                                            Delete Account
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                ) : (
                    <button onClick={() => handleFollow(userId)} className="rounded-xl w-32 h-12 gap-2 flex cursor-pointer items-center justify-center border bg-blue-500 text-white border-transparent font-bold text-center hover:bg-blue-600 transition-colors">
                        {!isFollow ? (
                            <>
                                <CiSquarePlus className="w-8 h-8 text-white" /> Follow
                            </>
                        ) : (
                            <>
                                <IoCheckmarkOutline className="w-8 h-8 text-white" /> Following
                            </>
                        )}
                    </button>
                )}
            </div>
            
            <span className="font-bold text-center text-4xl text-gray-700 p-5">All Posts</span>
            
            {posts.length === 0 && (
                currentUser._id === userId ? (
                    <div className="items-center justify-center font-bold text-gray-700 text-2xl">Let's create some posts</div>
                ) : (
                    <div className="items-center justify-center font-bold text-gray-700 text-2xl">No posts available</div>
                )
            )}
            
            <div className="w-full p-6 flex flex-col gap-8 items-center justify-center">
                {posts.map((post) => (
                    <div key={post._id} className="bg-white max-w-5xl w-full border rounded-3xl border-gray-100 shadow flex flex-col shadow-gray-200 justify-start p-3">
                        <div className="flex gap-10 justify-between border-b-2 border-gray-200">
                            <div className="flex flex-col">
                                <div className="gap-2 flex items-center hover:cursor-pointer" onClick={() => navigate(`/profile/${post.author._id}`)}>
                                    <img src={post.author.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                                    <div className="flex flex-col gap-0 mb-1.5">
                                        <span className="text-md font-semibold text-gray-700 hover:underline">{post.author.username}</span>
                                        <span className="text-xs text-gray-500">{timeAgo(post.createAt)}</span>
                                    </div>
                                </div>
                                <div className="mb-3 mt-3 flex items-start gap-2">
                                    {post.category.map((category) => (
                                        <span key={category._id} onClick={() => navigate(`/category/${category.slug}`)} className="text-sm hover:cursor-pointer font-sans font-semibold bg-blue-100 text-blue-600 hover:bg-blue-200 px-2 py-0.5 rounded-full">{category.name}</span>
                                    ))}
                                </div>
                                <div className="flex flex-col">
                                    <div onClick={() => navigate(`/posts/${post._id}`)} className="gap-3 justify-start hover:cursor-pointer flex flex-col pb-2">
                                        <span className="text-xl font-semibold text-gray-700">{post.title}</span>
                                        <p className="text-gray-700 leading-relaxed">{post.content.length > 200 ? post.content.slice(0, 200) + "..." : post.content}</p>
                                    </div>
                                    <div className="mb-3 flex items-start gap-2">
                                        {post.tags.map((tag) => (
                                            <span onClick={() => navigate(`/tag/${tag._id}`)} key={tag._id} className="text-sm font-semibold bg-gray-100 hover:cursor-pointer text-gray-700 hover:bg-gray-200 px-2 py-0.5 rounded-full">#{tag.name}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <img src={post.thumbnail || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.username || "User")}&background=random`} alt="post" className="max-w-sm p-3 hidden lg:block w-full 2xl:h-100 mb-2 h-64 object-cover rounded-xl"/>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <div className="flex ml-5 gap-3 justify-start text-center mt-4">
                                <span onClick={() => likePost({ postId: post._id, token: currentUser.token })} className={`text-md hover:cursor-pointer hover:bg-gray-200 hover:scale-105 hover:rounded-md w-22 ${post.likes.includes(currentUser?._id) ? "text-blue-600 font-semibold" : "text-gray-500"}`}>
                                    <AiOutlineLike className="inline w-5 h-5 items-center mb-1 text-lg"/> {post.likeCount} Likes
                                </span>
                                <span onClick={() => navigate(`/post/${post._id}`)} className="ml-2 text-md items-center text-gray-500 hover:cursor-pointer hover:bg-gray-200 hover:scale-105 hover:rounded-md w-32">
                                    <FaRegComment className="w-4 mb-1 mr-1.5 inline h-4"/>{post.comments.length} Comments
                                </span>
                            </div>
                            <div className={`relative ${currentUser._id === post.author._id ? "block" : "hidden"}`}>
                                <button onClick={() => setOpenMenuId(openMenuId === post._id ? null : post._id)} className="flex justify-center hover:cursor-pointer items-center mt-4">
                                    <MoreVertical className="w-5 h-5 text-gray-500 hover:bg-gray-200 hover:border hover:border-gray-200 hover:rounded-md hover:cursor-pointer hover:text-yellow-600 mr-5"/>
                                </button>
                                {openMenuId === post._id &&
                                    <div className="absolute right-0 mt-1 w-40 sm:w-48 bg-white border border-purple-100 rounded-xl shadow-lg z-10 overflow-hidden animate-fadeIn">
                                        {MENU_OPTIONS.map(opt => (
                                            <button key={opt.action} onClick={()=>handleAction(opt.action, post)} className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-purple-50 flex items-center gap-2 transition-colors duration-200">
                                                {opt.icon}{opt.label}
                                            </button>
                                        ))}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>}
        
        <PostModal 
            isOpen={open} 
            onClose={() => setOpen(false)} 
            onSave={handleSaveFromModal} 
            user={currentUser} 
            postToEdit={isUpdate ? postUpdate : ""} 
        />
        
        <EditProfile 
            currentUser={currentUser} 
            setCurrentUser={setCurrentUser} 
            openEdit={editProfile} 
            closeEdit={() => setEditProfile(false)} 
            openChangePassword={openChangePassword} 
            closeChangePassword={() => setOpenChangePassword(false)} 
            openDeleteUser={openDeleteUser} 
            closeDeleteUser={() => setOpenDeleteUser(false)} 
            onLogout={onLogout} 
        />

        <FollowListModal 
            isOpen={showFollowersModal}
            onClose={() => setShowFollowersModal(false)}
            users={profileUser?.followers || []}
            title="Followers"
            currentUserId={currentUser._id}
        />

        <FollowListModal 
            isOpen={showFollowingsModal}
            onClose={() => setShowFollowingsModal(false)}
            users={profileUser?.followings || []}
            title="Following"
            currentUserId={currentUser._id}
        />
        </>
    )
}

export default Profile;