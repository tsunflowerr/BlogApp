import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useLikePost } from "../hooks/useLikePost";
import { useBookmark } from "../hooks/useBookmark";
import { useUserBookmarks } from "../hooks/useUserBookmarks";
import PostModal from "../components/PostModal";
import PostList from "../components/PostList";

const Dashboard = () => {
    const { posts, setPosts, timeAgo, user } = useOutletContext();
    const { dbpage, setDbPage } = useOutletContext();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    
    const { mutate: likePost } = useLikePost(setPosts);
    const { mutate: bookmarkPost } = useBookmark();
    const { data: userBookmarks = [], refetch: refetchBookmarks } = useUserBookmarks(user?.token);

    const handleLike = (postId) => {
        likePost({ postId, token: user?.token });
    };

    const handleBookmark = (postId) => {
        bookmarkPost(
            { postId, token: user?.token },
            {
                onSuccess: () => {
                    refetchBookmarks();
                }
            }
        );
    };
    
    const userBookmarkIds = userBookmarks.map(bookmark => bookmark._id);
    return (
        <>
            <div className="w-full flex flex-col gap-5">
                {/* Create Post Section */}
                {user && dbpage === 1 && (
                    <div className="bg-white border rounded-3xl border-gray-100 lg:h-40 items-center mb-6 px-5 py-5 pl-10 pr-10 shadow shadow-gray-200 gap-5 flex">
                        <img 
                            onClick={() => navigate(`/profile/${user._id}`)} 
                            src={user.avatar} 
                            alt="avatar" 
                            className="w-12 hover:cursor-pointer h-12 rounded-full object-cover" 
                        /> 
                        <button 
                            onClick={() => setOpen(true)} 
                            className="flex hover:cursor-pointer w-full rounded-2xl px-4 h-20 items-center font-sans font-semibold text-gray-600 bg-gray-100 border border-transparent"
                        >
                            Hey, {user.name}! Let's create some posts!    
                        </button>
                    </div>
                )}

                {/* Post List */}
                <PostList
                    posts={posts}
                    currentPage={dbpage}
                    onPageChange={setDbPage}
                    timeAgo={timeAgo}
                    user={user}
                    onLike={handleLike}
                    onBookmark={handleBookmark}
                    userBookmarks={userBookmarkIds}
                />
            </div>

            <PostModal 
                isOpen={open} 
                onClose={() => setOpen(false)} 
                onSave={setPosts} 
                user={user} 
            />
        </>
    );
};

export default Dashboard;