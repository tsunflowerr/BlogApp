import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { useLikePost } from "../hooks/useLikePost";
import { useBookmark } from "../hooks/useBookmark";
import { useUserBookmarks } from "../hooks/useUserBookmarks";
import PostList from "../components/PostList";

const Trending = () => {
    const { posts, setPosts, timeAgo, user } = useOutletContext();
    const { trendingPage, setTrendingPage } = useOutletContext();
    
    const { mutate: likePost } = useLikePost(setPosts);
    const { mutate: bookmarkPost } = useBookmark();
    const { data: userBookmarks = [], refetch: refetchBookmarks } = useUserBookmarks(user?.token);

    // Calculate trending score for posts
    const trendingPosts = useMemo(() => {
        const w_views = 1;
        const w_likes = 6;
        const w_comments = 8;
        const alpha = 1.5;

        return [...posts].map((post) => {
            const createdAt = post.createAt ? new Date(post.createAt) : null;
            const hoursSincePost = createdAt && !isNaN(createdAt) 
                ? (Date.now() - createdAt.getTime()) / 1000 / 3600 
                : 0;
            
            const trendingScore = (
                (w_views * post.view) +
                (w_likes * post.likes.length) +
                (w_comments * post.comments.length)
            ) / Math.pow(hoursSincePost + 2, alpha);
            
            return { ...post, trendingScore };
        }).sort((a, b) => b.trendingScore - a.trendingScore);
    }, [posts]);

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
        <PostList
            posts={trendingPosts}
            currentPage={trendingPage}
            onPageChange={setTrendingPage}
            timeAgo={timeAgo}
            user={user}
            onLike={handleLike}
            onBookmark={handleBookmark}
            userBookmarks={userBookmarkIds}
            emptyMessage="No trending posts available"
        />
    );
};

export default Trending;