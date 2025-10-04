import React from "react";
import PostCard from "./PostCard";
import Pagination from "./Pagination";
import {usePagination} from "../services/usePagination";


const PostList = ({ 
    posts, 
    currentPage, 
    onPageChange, 
    timeAgo, 
    user, 
    onLike, 
    onBookmark,
    userBookmarks = [],
    emptyMessage = "No posts available"
}) => {
    const { currentItems, totalPages } = usePagination(posts, currentPage, 5);

    if (posts.length === 0) {
        return (
            <div className="text-gray-500 font-medium text-lg">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-5">
            {currentItems.map((post) => (
                <PostCard
                    key={post._id}
                    post={post}
                    timeAgo={timeAgo}
                    user={user}
                    onLike={onLike}
                    onBookmark={onBookmark}
                    userBookmarks={userBookmarks}
                />
            ))}
            
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
};

export default PostList;