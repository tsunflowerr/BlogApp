import React from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import BookmarkButton from "./BookmarkButton";

const ProfilePostCard = ({ 
    post, 
    timeAgo, 
    currentUser, 
    onLike, 
    onEdit, 
    onDelete,
    onBookmark,
    isBookmarked,
    showActions = true // Optional prop to control action visibility
}) => {
    const navigate = useNavigate();
    const [openMenuId, setOpenMenuId] = React.useState(false);
    
    // Check if current user is the post owner
    const isOwner = currentUser?._id === post.author?._id;
    
    // Only show edit/delete menu if onEdit or onDelete is provided AND user is owner
    const showEditMenu = isOwner && (onEdit || onDelete);
    
    const MENU_OPTIONS = [
        ...(onEdit ? [{ action: "edit", label: "Edit Post", icon: <Edit2 size={14} className="text-blue-600" /> }] : []),
        ...(onDelete ? [{ action: "delete", label: "Delete Post", icon: <Trash2 size={14} className="text-red-600" /> }] : []),
    ];

    const handleAction = (action) => {
        setOpenMenuId(false);
        if (action === 'edit' && onEdit) onEdit(post);
        if (action === 'delete' && onDelete) onDelete(post._id);
    };

    const handleLike = () => {
        if (onLike && currentUser) {
            onLike(post._id);
        }
    };

    const handleBookmark = () => {
        if (onBookmark && currentUser) {
            onBookmark(post._id);
        }
    };

    return (
        <div className="bg-white max-w-5xl w-full border rounded-3xl border-gray-100 shadow flex flex-col shadow-gray-200 justify-start p-3">
            <div className="flex gap-10 justify-between border-b-2 border-gray-200">
                <div className="flex flex-col">
                    {/* Author Info */}
                    <div 
                        className="gap-2 flex items-center hover:cursor-pointer" 
                        onClick={() => navigate(`/profile/${post.author._id}`)}
                    >
                        <img 
                            src={post.author?.avatar} 
                            alt="avatar" 
                            className="w-10 h-10 rounded-full object-cover" 
                        />
                        <div className="flex flex-col gap-0 mb-1.5">
                            <span className="text-md font-semibold text-gray-700 hover:underline">
                                {post.author?.username}
                            </span>
                            <span className="text-xs text-gray-500">
                                {timeAgo(post.createAt)}
                            </span>
                        </div>
                    </div>
                    
                    {/* Categories */}
                    {post.category && post.category?.length > 0 && (
                        <div className="mb-3 mt-3 flex items-start gap-2">
                            {post.category.map((category) => (
                                <span 
                                    key={category._id} 
                                    onClick={() => navigate(`/category/${category.slug}`)} 
                                    className="text-sm hover:cursor-pointer font-sans font-semibold bg-blue-100 text-blue-600 hover:bg-blue-200 px-2 py-0.5 rounded-full"
                                >
                                    {category.name}
                                </span>
                            ))}
                        </div>
                    )}
                    
                    {/* Post Content */}
                    <div className="flex flex-col">
                        <div 
                            onClick={() => navigate(`/posts/${post._id}`)} 
                            className="gap-3 justify-start hover:cursor-pointer flex flex-col pb-2"
                        >
                            <span className="text-xl font-semibold text-gray-700">
                                {post.title}
                            </span>
                            <p 
                                className="text-gray-700 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: post.content?.length > 200 
                                        ? post.content.slice(0, 200) + "..." 
                                        : post.content
                                }}
                            />
                        </div>
                        
                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="mb-3 flex items-start gap-2">
                                {post.tags.map((tag) => (
                                    <span 
                                        onClick={() => navigate(`/tag/${tag.slug}`)} 
                                        key={tag._id} 
                                        className="text-sm font-semibold bg-gray-100 hover:cursor-pointer text-gray-700 hover:bg-gray-200 px-2 py-0.5 rounded-full"
                                    >
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Thumbnail */}
                <img 
                    src={post.thumbnail || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.username || "User")}&background=random`} 
                    alt="post" 
                    className="max-w-sm p-3 hidden lg:block w-full 2xl:h-100 mb-2 h-64 object-cover rounded-xl"
                />
            </div>
            
            {/* Actions */}
            {showActions && (
                <div className="flex justify-between items-center">
                    <div className="flex ml-5 gap-3 justify-start text-center mt-4">
                        <span 
                            onClick={handleLike} 
                            className={`text-md hover:cursor-pointer hover:bg-gray-200 hover:scale-105 hover:rounded-md w-22 ${
                                (post.likes || []).includes(currentUser?._id)
                                    ? "text-blue-600 font-semibold" 
                                    : "text-gray-500"
                            }`}
                        >
                            <AiOutlineLike className="inline w-5 h-5 items-center mb-1 text-lg"/> 
                            {post.likeCount || 0} Likes
                        </span>
                        <span 
                            onClick={() => navigate(`/posts/${post._id}`)} 
                            className="ml-2 text-md items-center text-gray-500 hover:cursor-pointer hover:bg-gray-200 hover:scale-105 hover:rounded-md w-32"
                        >
                            <FaRegComment className="w-4 mb-1 mr-1.5 inline h-4"/>
                            {post.comments?.length || 0} Comments
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-4 mr-5">
                        {/* Bookmark Button - Show only if onBookmark is provided */}
                        {onBookmark && currentUser && (
                            <BookmarkButton
                                isBookmarked={isBookmarked}
                                onClick={handleBookmark}
                            />
                        )}
                        
                        {/* Edit/Delete Menu - Only for post owner */}
                        {showEditMenu && MENU_OPTIONS.length > 0 && (
                            <div className="relative">
                                <button 
                                    onClick={() => setOpenMenuId(!openMenuId)} 
                                    className="flex justify-center hover:cursor-pointer items-center"
                                >
                                    <MoreVertical className="w-5 h-5 text-gray-500 hover:bg-gray-200 hover:border hover:border-gray-200 hover:rounded-md hover:cursor-pointer hover:text-yellow-600"/>
                                </button>
                                {openMenuId && (
                                    <div className="absolute right-0 mt-1 w-40 sm:w-48 bg-white border border-purple-100 rounded-xl shadow-lg z-10 overflow-hidden animate-fadeIn">
                                        {MENU_OPTIONS.map(opt => (
                                            <button 
                                                key={opt.action} 
                                                onClick={() => handleAction(opt.action)} 
                                                className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-purple-50 flex items-center gap-2 transition-colors duration-200"
                                            >
                                                {opt.icon}{opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePostCard;