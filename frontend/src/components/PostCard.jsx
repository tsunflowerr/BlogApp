import React from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import BookmarkButton from "./BookmarkButton";

const PostCard = ({ post, timeAgo, user, onLike, onBookmark, userBookmarks = [] }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white border rounded-3xl border-gray-100 shadow flex flex-col shadow-gray-200 justify-start p-3">
            {/* Author Info */}
            <div 
                className="gap-2 flex items-center hover:cursor-pointer" 
                onClick={() => navigate(`/profile/${post.author._id}`)}
            >
                <img 
                    src={post.author.avatar || "/default-thumbnail.png"} 
                    alt="avatar" 
                    className="w-10 h-10 rounded-full object-cover" 
                />
                <div className="flex flex-col gap-0 mb-1.5">
                    <span className="text-md font-semibold text-gray-700 hover:underline">
                        {post.author.username}
                    </span>
                    <span className="text-xs text-gray-500">
                        {timeAgo(post.createAt)}
                    </span>
                </div>
            </div>

            {/* Categories */}
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

            {/* Post Content */}
            <div className="border-b-2 flex flex-col border-gray-200">
                <div 
                    onClick={() => navigate(`/posts/${post._id}`)} 
                    className="gap-3 justify-start hover:cursor-pointer flex flex-col pb-2"
                >
                    <span className="text-xl font-semibold text-gray-70">
                        {post.title}
                    </span>
                    <img 
                        src={post.thumbnail || "https://ui-avatars.com/api/?name=user2&background=random"} 
                        alt="post" 
                        className="w-full 2xl:h-128 h-84 object-cover rounded-xl"
                    />
                    <p 
                        className="text-gray-700 leading-relaxed" 
                        dangerouslySetInnerHTML={{
                            __html: post.content.length > 200 
                                ? post.content.slice(0, 200) + "..." 
                                : post.content
                        }}
                    />
                </div>

                {/* Tags */}
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
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
                <div className="flex ml-5 justify-start text-center mt-4">
                    <span 
                        onClick={() => onLike && onLike(post._id)} 
                        className={`text-md hover:cursor-pointer hover:bg-gray-200 hover:scale-105 hover:rounded-md w-22 ${
                            post.likes.includes(user?._id) 
                                ? "text-blue-600 font-semibold" 
                                : "text-gray-500"
                        }`}
                    >
                        <AiOutlineLike className="inline w-5 h-5 items-center mb-1 text-lg"/> 
                        {post.likeCount} Likes
                    </span>
                    <span 
                        onClick={() => navigate(`/posts/${post._id}#comments`)} 
                        className="ml-2 text-md items-center text-gray-500 hover:cursor-pointer hover:bg-gray-200 hover:scale-105 hover:rounded-md w-32"
                    >
                        <FaRegComment className="w-4 mb-1 mr-1.5 inline h-4"/>
                        {post.comments.length} Comments
                    </span>
                </div>
                <div className="flex justify-center items-center mt-4 mr-5">
                    <BookmarkButton
                        isBookmarked={userBookmarks.includes(post._id)}
                        onClick={() => onBookmark && onBookmark(post._id)}
                    />
                </div>
            </div>
        </div>
    );
};

export default PostCard;