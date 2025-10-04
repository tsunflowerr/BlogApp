import axios from "axios";
import { Delete, Edit, Pen, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PostModal from "./PostModal";
import { useLikePost } from "../hooks/useLikePost";
import { useBookmark } from "../hooks/useBookmark";
import EditProfile from "./EditProfile";
import { RxReset } from "react-icons/rx";
import { CiSquarePlus } from "react-icons/ci";
import { IoCheckmarkOutline } from "react-icons/io5";
import FollowListModal from "./FollowListModal";
import ProfilePostCard from "./ProfilePostCard";
import { ChevronDown } from "lucide-react";
import { useUserBookmarks } from "../hooks/useUserBookmarks";

const url = "http://localhost:4000";

const Profile = ({ currentUser, setCurrentUser, onLogout }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editProfile, setEditProfile] = useState(false);
    const [open, setOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [postUpdate, setPostUpdate] = useState(null);
    const [openMenuEdit, setOpenMenuEdit] = useState(false);
    const [openChangePassword, setOpenChangePassword] = useState(false);
    const [openDeleteUser, setOpenDeleteUser] = useState(false);
    const [isFollow, setIsFollow] = useState(false);
    const [profileUser, setProfileUser] = useState(null);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingsModal, setShowFollowingsModal] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    
    const { userId } = useParams();
    const { timeAgo } = useOutletContext();
    const navigate = useNavigate();
    
    // Use custom hooks
    const { mutate: likePost } = useLikePost(activeTab === 'all' ? setPosts : () => {
        refetchBookmarks();
    });
    
    // Only fetch bookmarks if viewing own profile
    const isOwnProfile = currentUser?._id === userId;
    const { data: userBookmarks = [], refetch: refetchBookmarks, isLoading: bookmarksLoading } = useUserBookmarks(
        isOwnProfile ? currentUser?.token : null
    );
    
    const { mutate: bookmarkPost } = useBookmark(() => {
        refetchBookmarks();
    });

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No auth token found");
        return { Authorization: `Bearer ${token}` };
    };

    const handleSaveFromModal = (savedPost) => {
        if (!savedPost) return;
        setPosts(prev => {
            const exists = prev.find(p => p._id === savedPost._id);
            if (exists) {
                return prev.map(p => p._id === savedPost._id ? savedPost : p);
            }
            return [savedPost, ...prev];
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${url}/api/posts/${id}`, { headers: getAuthHeader() });
            setPosts(prev => prev.filter(post => post._id !== id));
            refetchBookmarks();
            toast.success("Post deleted successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete post");
            if (err.response?.status === 401) onLogout?.();
        }
    };

    const handleEdit = (post) => {
        setIsUpdate(true);
        setOpen(true);
        setPostUpdate(post);
    };

    const handleBookmark = (postId) => {
        bookmarkPost({ postId, token: currentUser?.token });
    };

    const handleFollow = async (id) => {
        try {
            const { data } = await axios.post(
                `${url}/api/users/${id}/follow`, 
                {}, 
                { headers: getAuthHeader() }
            );
            if (String(data.type) === "Follow") {
                setIsFollow(true);
                toast.success("Followed user successfully");
                setProfileUser(prev => ({
                    ...prev,
                    followers: [...(prev?.followers || []), currentUser]
                }));
            } else {
                setIsFollow(false);
                toast.success("Unfollowed user successfully");
                setProfileUser(prev => ({
                    ...prev,
                    followers: prev?.followers.filter(f => f._id !== currentUser._id) || []
                }));
            }
        } catch (err) {
            console.error("Failed to follow this user", err);
            toast.error("Failed to follow this user");
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${url}/api/posts/user/${userId}`);
                setPosts(data.posts || []);
            } catch (error) {
                console.log("Fail to fetch posts", error);
                toast.error("Fail to load posts");
            } finally {
                setLoading(false);
            }
        };

        const fetchUser = async () => {
            if (!currentUser) return;
            try {
                const { data } = await axios.get(`${url}/api/users/me`, { headers: getAuthHeader() });
                const isFollowing = data.user.followings.some(f => f._id.toString() === userId);
                setIsFollow(isFollowing);
            } catch (err) {
                console.log("Fail to fetch user", err);
            }
        };

        const fetchProfileUser = async () => {
            try {
                const { data } = await axios.get(`${url}/api/users/${userId}`);
                setProfileUser(data.user);
            } catch (err) {
                console.log("Fail to fetch profile user", err);
                toast.error("Fail to load user profile");
            }
        };

        fetchProfileUser();
        fetchPosts();
        fetchUser();
    }, [userId, currentUser]);

    const userBookmarkIds = userBookmarks?.map(post => post._id) || [];
    const displayPosts = activeTab === 'all' ? posts : userBookmarks;
    console.log({ displayPosts });

    return (
        <>
            {(loading || (bookmarksLoading && activeTab === 'saved')) ? (
                <div className="items-center flex justify-center h-full min-h-screen">
                    <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
                </div>
            ) : (
                <div className="gap-3 flex flex-col items-center">
                    {/* Profile Header */}
                    <div className="bg-white flex items-center mt-10 justify-evenly gap-12 w-full max-w-4xl border border-transparent rounded-3xl p-6">
                        <div className="flex gap-5 justify-center items-center">
                            <img 
                                src={profileUser?.avatar || currentUser?.avatar} 
                                alt="avatar" 
                                className="w-24 h-24 rounded-full object-cover"
                            />
                            <div className="flex flex-col gap-2">
                                <span className="text-3xl font-bold text-gray-700">
                                    {profileUser?.username || currentUser?.username}
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
                        
                        {currentUser?._id === userId ? (
                            <div className="gap-3 flex">
                                <button 
                                    className="bg-blue-500 gap-2 border flex hover:cursor-pointer md:w-42 w-18 h-10 justify-center items-center border-blue-500 rounded-2xl" 
                                    onClick={() => { setOpen(true); setIsUpdate(false); }}
                                >
                                    <Plus className="w-5 h-5 text-white text-center"/>
                                    <span className="font-sans text-white lg:block hidden font-semibold">Create a post</span>
                                </button>
                                <div className="relative">
                                    <button 
                                        className="bg-gray-200 gap-2 border flex border-transparent hover:cursor-pointer md:w-42 w-18 h-10 justify-center items-center rounded-2xl" 
                                        onClick={() => setOpenMenuEdit(!openMenuEdit)}
                                    >
                                        <Pen className="w-5 h-5 text-gray-800 text-center"/>
                                        <span className="font-sans text-gray-800 lg:block hidden font-semibold">Edit profile</span>
                                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${openMenuEdit ? 'rotate-180' : ''}`} />
                                    </button>
                                    {openMenuEdit && (
                                        <ul className="absolute top-11 md:w-48 w-30 bg-white rounded-2xl shadow-xl border border-purple-100 z-50 overflow-hidden animate-fadeIn">
                                            <li className='p-2'>
                                                <button 
                                                    onClick={() => { setEditProfile(true); setOpenMenuEdit(false); }}
                                                    className="w-full px-4 py-2.5 text-left hover:bg-gray-100 text-sm text-gray-700 transition-colors flex items-center gap-2 group"
                                                >
                                                    <Edit className="w-4 h-4 text-gray-700" />
                                                    Edit info
                                                </button>
                                            </li>
                                            <li className='p-2'>
                                                <button 
                                                    onClick={() => { setOpenChangePassword(true); setOpenMenuEdit(false); }} 
                                                    className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-blue-50 text-blue-600'
                                                >
                                                    <RxReset className="w-4 h-4" />
                                                    Change Password
                                                </button>
                                            </li>
                                            <li className='p-2'>
                                                <button 
                                                    onClick={() => { setOpenDeleteUser(true); setOpenMenuEdit(false); }} 
                                                    className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-red-50 text-red-600'
                                                >
                                                    <Delete className="w-4 h-4" />
                                                    Delete Account
                                                </button>
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ) : (
                            currentUser && (
                                <button 
                                    onClick={() => handleFollow(userId)} 
                                    className="rounded-xl w-32 h-12 gap-2 flex cursor-pointer items-center justify-center border bg-blue-500 text-white border-transparent font-bold text-center hover:bg-blue-600 transition-colors"
                                >
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
                            )
                        )}
                    </div>
                    
                    {/* Tabs - Only show for own profile */}
                    {isOwnProfile && (
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`font-bold text-2xl pb-2 px-4 transition-all ${
                                    activeTab === 'all' 
                                        ? 'text-blue-600 border-b-4 border-blue-600' 
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                All Posts ({posts.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('saved')}
                                className={`font-bold text-2xl pb-2 px-4 transition-all ${
                                    activeTab === 'saved' 
                                        ? 'text-blue-600 border-b-4 border-blue-600' 
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Saved Posts ({userBookmarks.length})
                            </button>
                        </div>
                    )}
                    
                    {/* Empty State */}
                    {displayPosts.length === 0 && (
                        <div className="items-center justify-center font-bold text-gray-700 text-2xl mt-10">
                            {activeTab === 'all' 
                                ? (isOwnProfile 
                                    ? "Let's create some posts" 
                                    : "No posts available")
                                : "No saved posts yet"}
                        </div>
                    )}
                    
                    {/* Posts List */}
                    <div className="w-full p-6 flex flex-col gap-8 items-center justify-center">
                        {displayPosts.map((post) => (
                            <ProfilePostCard
                                key={post._id}
                                post={post}
                                timeAgo={timeAgo}
                                currentUser={currentUser}
                                onLike={(postId) => likePost({ postId, token: currentUser?.token })}
                                onEdit={isOwnProfile ? handleEdit : undefined}
                                onDelete={isOwnProfile ? handleDelete : undefined}
                                onBookmark={handleBookmark}
                                isBookmarked={userBookmarkIds.includes(post._id)}
                            />
                        ))}
                    </div>
                </div>
            )}
            
            {/* Modals */}
            <PostModal 
                isOpen={open} 
                onClose={() => setOpen(false)} 
                onSave={handleSaveFromModal} 
                user={currentUser} 
                postToEdit={isUpdate ? postUpdate : null} 
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
                currentUserId={currentUser?._id}
            />

            <FollowListModal 
                isOpen={showFollowingsModal}
                onClose={() => setShowFollowingsModal(false)}
                users={profileUser?.followings || []}
                title="Following"
                currentUserId={currentUser?._id}
            />
        </>
    );
};

export default Profile;