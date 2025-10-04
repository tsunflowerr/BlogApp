import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useLikePost } from "../hooks/useLikePost";
import { useBookmark } from "../hooks/useBookmark";
import { useUserBookmarks } from "../hooks/useUserBookmarks";
import { toast } from "react-toastify";
import axios from "axios";
import PostList from "../components/PostList";

const url = "http://localhost:4000";

const Following = () => {
    const { posts, setPosts, timeAgo, user } = useOutletContext();
    const { trendingPage, setTrendingPage } = useOutletContext();
    const [followingIds, setFollowingIds] = useState([]);
    
    const { mutate: likePost } = useLikePost(setPosts);
    const { mutate: bookmarkPost } = useBookmark();
    const { data: userBookmarks = [], refetch: refetchBookmarks } = useUserBookmarks(user?.token);
    const userBookmarkIds = userBookmarks.map(bookmark => bookmark._id);

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No auth token found");
        return { Authorization: `Bearer ${token}` };
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await axios.get(`${url}/api/users/me`, { 
                    headers: getAuthHeader() 
                });
                setFollowingIds(data.user.followings?.map(f => f._id) || []);
            } catch (err) {
                console.log("Fail to fetch user", err);
                toast.error("Fail to load user");
            }
        };
        fetchUser();
    }, []);

    const followingPosts = posts.filter(post => 
        followingIds.includes(post.author?._id)
    );

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

    return (
        <PostList
            posts={followingPosts}
            currentPage={trendingPage}
            onPageChange={setTrendingPage}
            timeAgo={timeAgo}
            user={user}
            onLike={handleLike}
            onBookmark={handleBookmark}
            userBookmarks={userBookmarkIds}
            emptyMessage="No posts from people you follow"
        />
    );
};

export default Following;