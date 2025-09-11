import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useLikePost } from "../hooks/useLikePost";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";

const URL_API = "http://localhost:4000/api";
const PostByTag = () => {
    const {slug} = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useState([])
    const {timeAgo, user, postsByTagPage, setPostsByTagPage} = useOutletContext();
    useEffect (() =>{
        const fetchPostByTag = async() => {
            try {
                setLoading(true)
                const {data} = await axios.get(`${URL_API}/posts/tag/${slug}`)
                if(data.success) {
                    setPosts(data.posts)
                }
            }
            catch(err) {
                console.log("Failed to load posts", err.response?.message)
                toast.error("Failed to load posts")
            }
            finally{
                setLoading(false)
            }
        }
        fetchPostByTag();
    },[slug])
    const tag = posts[0]?.tags.find(tg => tg.slug === slug)

    const postPerPage = 5; 
    const lastIndex = postPerPage * postsByTagPage;
    const firstIndex = lastIndex - postPerPage;
    const currentPosts = posts.slice(firstIndex, lastIndex)
    const totalPages = Math.ceil(posts.length / postPerPage)
    const getPageNumbers = () => {
        let pages = [];
        for(let i = 1; i <= Math.min(3, totalPages); i++) {
            pages.push(i)
        }
        if(postsByTagPage > 5) {
            pages.push("...")
        }
        let start = Math.max(4, postsByTagPage-1)
        let end = Math.min(totalPages-3, postsByTagPage+1);

        for(let i = start; i <= end; i++) {
            if(i > 3 && i < totalPages - 2) {
                pages.push(i)
            }
        }
        if(postsByTagPage < totalPages - 4) {
            pages.push("...")
        }
        for(let i = Math.max(totalPages-2, 4); i <= totalPages; i++) {
            if(i > 3) {
                pages.push(i)
            }
        }
        return pages
            
    }
    const {mutate: likePost} = useLikePost(setPosts)
    if(posts.length === 0 && !loading) {
        return <div className="text-gray-500 font-medium text-lg">No posts available</div>
    }
    return (
        <>
        {loading && 
        <div className="items-center flex justify-center  h-full">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"/>
        </div>}
        <div className="gap-2 flex flex-col p-2 mb-5">
            <div className="flex gap-2 text-2xl text-gray-600 font-bold">
                <span className="cursor-pointer hover:text-blue-500" onClick={() => navigate('/')}>Home</span> {'>> ##'}
                <span>{tag?.name}</span>
            </div>
        </div>
        {!loading && <div className="w-full flex flex-col gap-5">
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
                                <span onClick={() => navigate(`/tag/${tag.slug}`)} key={tag._id} className="text-sm font-semibold bg-gray-100 hover:cursor-pointer text-gray-700 hover:bg-gray-200 px-2 py-0.5 rounded-full">#{tag.name}</span>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex ml-5 justify-start text-center mt-4">
                            <span onClick={() => likePost({ postId: post._id, token: user.token })} className={`text-md hover:cursor-pointer hover:bg-gray-200 hover:scale-105 hover:rounded-md w-22 ${post.likes.includes(user?._id) ? "text-blue-600 font-semibold" : "text-gray-500"}`}>
                                <AiOutlineLike className="inline w-5 h-5 items-center mb-1 text-lg"/> {post.likeCount} Likes
                            </span>
                            <span onClick={() => navigate(`/posts/${post._id}`)} className="ml-2 text-md items-center text-gray-500 hover:cursor-pointer hover:bg-gray-200 hover:scale-105 hover:rounded-md w-32">
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
                onClick={() => setPostsByTagPage((p) => {Math.max(p - 1, 1), window.scroll({top: 0, behavior:"smooth"})})}
                disabled={postsByTagPage === 1}
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
                onClick={() => {setPostsByTagPage(page), window.scroll({top: 0, behavior:"smooth"})}}
                className={`px-3 py-1 rounded-md hover:cursor-pointer ${
                postsByTagPage === page
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}>
            {page}
          </button>
        )
      )}
        <button
          onClick={() => setPostsByTagPage((p) => {Math.min(p + 1, totalPages), window.scroll({top: 0, behavior:"smooth"})})}
          disabled={postsByTagPage === totalPages}
          className="px-3 py-1 bg-gray-200 hover:cursor-pointer rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
        </div>}
        </>
    )
}
export default PostByTag