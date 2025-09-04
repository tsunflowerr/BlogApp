import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { useLikePost } from "../hooks/useLikePost";


const Trending = () => {
    const {posts, setPosts, timeAgo, user} = useOutletContext();
    const {trendingPage, setTrendingPage} = useOutletContext();


    const trendingPost = useMemo(() => {
        const w_views = 1;
        const w_likes = 6;
        const w_comments = 8;
        const alpha = 1.5
        return [...posts].map((post) => {
            const createdAt = post.createAt ? new Date(post.createAt) : null 
            const hoursSincePost = createdAt && !isNaN(createdAt) ? (Date.now() -createdAt.getTime()) / 1000 / 3600 : 0
            const trendingScore = ((w_views * post.view) +
                 (w_likes * post.likes.length) +
                 (w_comments * post.comments.length)) /
                Math.pow(hoursSincePost + 2, alpha);
            return { ...post, trendingScore };
        }).sort((a, b) => b.trendingScore - a.trendingScore)
    }, [posts])
    console.log(trendingPost.map(p => ({ id: p._id, score: p.trendingScore })))


    const postPerPage = 5; 
    const lastIndex = postPerPage * trendingPage;
    const firstIndex = lastIndex - postPerPage;
    const currentPosts = trendingPost.slice(firstIndex, lastIndex)

    const totalPages = Math.ceil(posts.length / postPerPage)
    const getPageNumbers = () => {
        let pages = [];
        for(let i = 1; i <= Math.min(3, totalPages); i++) {
            pages.push(i)
        }
        if(trendingPage > 5) {
            pages.push("...")
        }
        let start = Math.max(4, trendingPage-1)
        let end = Math.min(totalPages-3, trendingPage+1);

        for(let i = start; i <= end; i++) {
            if(i > 3 && i < totalPages - 2) {
                pages.push(i)
            }
        }
        if(trendingPage < totalPages - 4) {
            pages.push("...")
        }
        for(let i = Math.max(totalPages-2, 4); i <= totalPages; i++) {
            if(i > 3) {
                pages.push(i)
            }
        }
        return pages
            
    }


        
    const navigate = useNavigate();
    const {mutate: likePost} = useLikePost(setPosts)
    
    if(posts.length === 0) {
        return <div className="text-gray-500 font-medium text-lg">No posts available</div>
    }
    return (
        <div className="w-full flex flex-col gap-5">
            {currentPosts.map((post) => (
                <div key={post._id} className="bg-white border rounded-3xl border-gray-100 shadow flex flex-col shadow-gray-200 justify-start p-3">
                    <div className="gap-2 flex items-center  hover:cursor-pointer" onClick={() => navigate(`/profile/${post.author._id}`)}>
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
                    <div className="border-b-2 flex flex-col border-gray-200">
                        <div onClick={() => navigate(`/posts/${post._id}`)} className="gap-3 justify-start hover:cursor-pointer flex flex-col  pb-2">
                            <span className="text-xl font-semibold text-gray-70">{post.title}</span>
                            <img src={post.thumbnail} alt="post" className="w-full 2xl:h-128 h-84 object-cover rounded-xl"/>
                            <p className="text-gray-700 leading-relaxed">{post.content.length > 200 ? post.content.slice(0, 200) + "..." : post.content}</p>
                        </div>
                        <div className="mb-3  flex items-start gap-2">
                            {post.tags.map((tag) => (
                                <span onClick={() => navigate(`/tag/${tag._id}`)} key={tag._id} className="text-sm font-semibold bg-gray-100 hover:cursor-pointer text-gray-700 hover:bg-gray-200 px-2 py-0.5 rounded-full">#{tag.name}</span>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex ml-5 justify-start text-center mt-4">
                            <span onClick={() => likePost({ postId: post._id, token: user.token })} className={`text-md hover:cursor-pointer hover:bg-gray-200 hover:scale-105 hover:rounded-md w-22 ${post.likes.includes(user?._id) ? "text-blue-600 font-semibold" : "text-gray-500"}`}>
                                <AiOutlineLike className="inline w-5 h-5 items-center mb-1 text-lg"/> {post.likeCount} Likes
                            </span>
                            <span onClick={() => navigate(`/post/${post._id}`)} className="ml-2 text-md items-center text-gray-500 hover:cursor-pointer hover:bg-gray-200 hover:scale-105 hover:rounded-md w-32">
                                <FaRegComment className="w-4 mb-1 mr-1.5  inline h-4"/>{post.comments.length} Comments
                            </span>
                        </div>
                        <div className="flex justify-center items-center mt-4">
                            <CiBookmark className="w-5 h-5 text-gray-500 hover:bg-gray-200 hover:border hover:border-gray-200 hover:rounded-md hover:cursor-pointer hover:text-yellow-600 mr-5"/>
                        </div>
                    </div>
                    
                </div>
            ))}
            <div className="flex justify-center items-center gap-2 mt-5">
                <button
                onClick={() => setTrendingPage((p) => {Math.max(p - 1, 1), window.scroll({top: 0, behavior:"smooth"})})}
                disabled={trendingPage === 1}
                className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"> Prev 
                </button>

            {getPageNumbers().map((page, index) =>
                page === "..." ? (
                    <span key={index} className="px-2">
                        ...
                    </span>
                ) : (
                <button
                key={page}
                onClick={() => {setTrendingPage(page), window.scroll({top: 0, behavior:"smooth"})}}
                className={`px-3 py-1 rounded-md hover:cursor-pointer ${
                trendingPage === page
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}>
            {page}
          </button>
        )
      )}
        <button
          onClick={() => setTrendingPage((p) => {Math.min(p + 1, totalPages), window.scroll({top: 0, behavior:"smooth"})})}
          disabled={trendingPage === totalPages}
          className="px-3 py-1 bg-gray-200 hover:cursor-pointer rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
        </div>
    )
}
export default Trending;