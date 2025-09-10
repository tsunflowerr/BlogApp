import axios from "axios";
import { View, ViewIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { GrLike, GrView } from "react-icons/gr";
import { FaComment } from "react-icons/fa6";
import { useLikePost } from "../hooks/useLikePost";
const URL_API = "http://localhost:4000/api";


const PostDetail = ({ user }) => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState({});
    const [loading, setLoading] = useState(false);
    const {mutate: likePost} = useLikePost(setPost)
    const [inputComment, setInputComment] = useState("")
    const [show, setShow] = useState(false)
    const {timeAgo} = useOutletContext()
    const [recommentPost, setRecommentPost] = useState([])
    const [visibleComments, setVisibleComments] = useState(5);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${URL_API}/posts/${postId}`);
            if (data.success) {
                setPost(data.post);
            }
        } catch (error) {
            console.log("Fail to fetch post", error);
            toast.error("Fail to load posts");
        } finally {
            setLoading(false);
        }
    };

    const fetchRecommentPost = async (slug) => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${URL_API}/posts/category/${slug}`);
            if (data.success) {
                setRecommentPost(data.posts.slice(0, 5))
            }
        } catch (error) {
            console.log("Fail to fetch recommend post", error);
            toast.error("Fail to load recommend posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [postId]);
    
    useEffect(() => {
    if (post?.category && post.category.length > 0) {
        const slug = post.category[0].slug;
        fetchRecommentPost(slug);
    }
    }, [post]);

    useEffect(() => {
    if (window.location.hash === "#comments") {
        const el = document.getElementById("comments");
        if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    }, [post]); 


    const handleShowAuth = () => {
        if(!user?._id) {
            setShow(true)
        }
    }

    const addComment = async() => {
        if(!inputComment.trim()){
            toast.warning("Comment canot be empty")
            return;
        }
        try {
            const token = user?.token
            const {data} = await axios.post(`${URL_API}/posts/${postId}/comments`, {content: inputComment}, {headers:{Authorization:`Bearer ${token}`}})
            if(data.success) {
                setInputComment("")
                toast.success("Comment added successfully")
                fetchPost()
            }
        }
        catch(err) {
            console.log(err.response?.data?.message || "Failed to add comment")
            toast.error("Failed to add comment")
        }
    }

    const handleNavigateProfile = () => {
        if (post.author?._id) {
            navigate(`/profile/${post.author._id}`);
        }
    };
    return (
        <>
        {loading && 
        <div className="items-center flex justify-center  h-full">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"/>
        </div>}
        {!loading && <div className="bg-white border-white justify-center flex border rounded-4xl w-full h-full">
            <div className="max-w-5xl w-full flex m-10 gap-4 flex-col">
                <header className="flex flex-col gap-5 border-b-2 border-gray-200">
                    <div className="flex gap-3 items-center">
                        <h1 className="font-sans text-4xl font-bold text-black">{post.title}</h1>
                        {post.category?.map((cat) => (
                            <div key={cat._id} onClick={() => navigate(`/category/${cat.slug}`)} className="text-sm hover:cursor-pointer font-sans font-semibold bg-blue-100 text-blue-600 hover:bg-blue-200 px-2 py-0.5 rounded-full mt-3">{cat.name}</div>
                        ))}
                    </div>
                    <div className="flex flex-row justify-between items-center mb-2">
                        <div
                            className="flex items-center justify-center gap-4 cursor-pointer"
                            onClick={handleNavigateProfile}
                        >
                            <img
                                src={post.author?.avatar}
                                className="w-11 h-11 rounded-full shadow-sm"
                                alt="avatar"
                            />
                            <span className="font-bold text-lg text-blue-700 hover:underline hover:text-blue-400">
                                {post.author?.username}
                            </span>
                        </div>
                        <div className="flex gap-5 justify-center items-center mt-2">
                            <div className="gap-1 flex font-semibold text-center">
                                <GrView className="w-5 h-5 m-0.5"/>{post.view}
                            </div>
                            <div className={`text-md flex font-semibold gap-1 hover:cursor-pointer hover:bg-gray-200 hover:scale-105 hover:rounded-md ${post.likes?.includes(user?._id) ? "text-blue-600 font-semibold" : "text-black"}`} onClick={() => likePost({postId: post._id, token: user.token})}>
                                <GrLike className="w-5 h-5 m-0.5"/>{post.likeCount}
                            </div>
                            <div className="gap-1 flex font-semibold text-center">
                                <FaComment className="w-5 h-5 m-0.5"/>{post.comments?.length}
                            </div>
                            <div className="gap-1 flex text-sm text-center">
                                Updated at {post.updateAt ? new Date(post.updateAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }) : ""}
                            </div>
                        </div>
                    </div>
                </header>
                <div className="flex items-start gap-2">
                    {post.tags?.map((tag) => (
                        <span onClick={() => navigate(`/tag/${tag._id}`)} key={tag._id} className="text-sm font-semibold bg-gray-100 hover:cursor-pointer text-gray-700 hover:bg-gray-200 px-2 py-0.5 rounded-full">#{tag.name}</span>
                    ))}
                </div>

                <div className="font-sans text-[18px] leading-8 text-gray-800 text-justify border-b-blue-200 border-b pb-5">
                    {post.content}
                </div>

                <div id="comments" className="flex flex-col gap-3 border-b border-b-gray-300 pb-5">
                    <span className="font-bold text-xl text-start text-blue-600">Comment {' '} {`(${post.comments?.length})`}</span>
                    <div className="relative max-w-2xl">
                        <textarea onClick={() => handleShowAuth()} value={inputComment} onChange={(e) => setInputComment(e.target.value)} rows={4} className="p-3 w-full border border-blue-200 focus:outline-blue-400 rounded-md bg-blue-100" placeholder="Share your opinion..."/>
                        {show && (
                            <div className="absolute inset-0 flex gap-2 flex-col items-center justify-center rounded-md bg-blue-300">
                                <span className="font-sans font-semibold text-lg text-blue-500 text-center">Please log in to comment</span>
                                <div className="flex gap-5">
                                    <button onClick={() => navigate('/login')} className="px-4 py-2 bg-white text-sm cursor-pointer font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                                        Login
                                    </button>
                                    <button onClick={() => navigate('/signup')} className="px-4 py-2 text-sm cursor-pointer font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                                        Sign Up
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <button onClick={() => addComment()} className="border justify-start max-w-36 text-white bg-blue-600 rounded-lg px-4 py-2 font-medium cursor-pointer hover:bg-blue-700 transition-colors">Comment</button>
                </div>
                <div className="flex flex-col gap-3">
                    {post?.comments?.slice(0, visibleComments).map((cmt) => (
                        <div key={cmt._id} className="flex flex-col border-b border-gray-200">
                            <div className="flex gap-3 items-center">
                                <img className="w-10 h-10 rounded-full" src={cmt.author?.avatar}></img>
                                <span className="font-sans font-semibold cursor-pointer hover:underline hover:text-blue-500 text-[16px] text-gray-800" onClick ={() => navigate(`/profile/${cmt.author?._id}`)}>{cmt.author?.username}</span>
                                <div className="font-sans text-xs font-semibold text-gray-400">{timeAgo(cmt.createAt)}</div>
                            </div>
                            <h2 className="font-sans px-12 pb-2 text-gray-600 text-justify leading-8">
                                {cmt.content}
                            </h2>
                        </div> 
                    ))}
                    {visibleComments < post.comments?.length && (
                        <button
                        onClick={() => setVisibleComments((prev) => prev + 5)}
                        className="max-w-32 cursor-pointer bg-blue-500 text-white rounded-lg border border-white hover:underline font-medium mt-2">
                        More
                        </button>
                    )}
                </div>
                <span className="font-semibold text-3xl font-sans ">You may also like</span>
                <div className="flex flex-col gap-6">
                    {recommentPost?.map((post) => (
                        post._id !== postId && (
                        <div key={post._id} 
                            onClick={() => navigate(`/posts/${post._id}`)}
                            className="flex gap-4 cursor-pointer hover:bg-gray-50 rounded-xl p-3 transition">
                            <img src={post.thumbnail} alt={post.title} className="w-50 h-36 object-cover rounded-lg"/>
                            <div className="flex flex-col gap-1">
                                <span className="text-xl font-semibold text-gray-800">
                                    {post.title}
                                </span>
                                <p className="text-gray-600 font-sans text-sm line-clamp-3">
                                    {post.content.length > 120 ? post.content.slice(0, 120) + "..." : post.content}
                                </p>
                            </div>
                        </div>)
                    ))}
                </div>
            </div>
        </div>}
        </>
    );
};

export default PostDetail;
