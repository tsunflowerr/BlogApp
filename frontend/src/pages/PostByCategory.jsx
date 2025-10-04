import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useLikePost } from "../hooks/useLikePost";
import { useBookmark } from "../hooks/useBookmark";
import { useUserBookmarks } from "../hooks/useUserBookmarks";
import PostList from "../components/PostList";

const URL_API = "http://localhost:4000/api";

const PostByCategory = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const { timeAgo, user, postsByCategoryPage, setPostsByCategoryPage } = useOutletContext();
    
    const { mutate: likePost } = useLikePost(setPosts);
    const { mutate: bookmarkPost } = useBookmark();
    const { data: userBookmarks = [], refetch: refetchBookmarks } = useUserBookmarks(user?.token);

    useEffect(() => {
        const fetchPostByCategory = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${URL_API}/posts/category/${slug}`);
                if (data.success) {
                    setPosts(data.posts);
                }
            } catch (err) {
                console.log("Failed to load posts", err.response?.message);
                toast.error("Failed to load posts");
            } finally {
                setLoading(false);
            }
        };
        fetchPostByCategory();
    }, [slug]);

    const category = posts[0]?.category.find(cat => cat.slug === slug);

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

    if (loading) {
        return (
            <div className="items-center flex justify-center h-full">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <>
            {/* Category Header */}
            {!loading && posts.length > 0 && (
                <div className="gap-2 flex flex-col p-2 mb-5">
                    <div className="flex gap-2 text-2xl text-gray-600 font-bold">
                        <span 
                            className="cursor-pointer hover:text-blue-500" 
                            onClick={() => navigate('/')}
                        >
                            Home
                        </span> 
                        {'>>'}
                        <span>{category?.name}</span>
                    </div>
                    <p className="text-lg font-semibold font-sans text-gray-700">
                        {category?.description}
                    </p>
                </div>
            )}

            {/* Post List */}
            {!loading && (
                <PostList
                    posts={posts}
                    currentPage={postsByCategoryPage}
                    onPageChange={setPostsByCategoryPage}
                    timeAgo={timeAgo}
                    user={user}
                    onLike={handleLike}
                    onBookmark={handleBookmark}
                    userBookmarks={userBookmarkIds}
                    emptyMessage="No posts in this category"
                />
            )}
        </>
    );
};

export default PostByCategory;