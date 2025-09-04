import axios from "axios";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const url = "http://localhost:4000"
const Profile = ({currentUser}) => {
    const [posts, setPosts] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [profile, setProfile] = React.useState({name:"", email:"", avatar:""})
    const {userId} = useParams()

    useEffect(() => {
        const fetchPosts = async () => {
        try {
            setLoading(true);
            const {data} = await axios.get(`${url}/api/posts/user/${userId}`)
            setPosts(data.posts || [])
        }
        catch(error) {
            console.log("Fail to fetch posts", error)
            toast.error("Fail to load posts")
        }
        finally {
            setLoading(false)
        }
    }
        fetchPosts();
},[userId])

    console.log(posts)
    return (
       <div>
            {loading && <p>Loading...</p>}
            {posts.map((post) => (
                <div key={post._id}>{post.title}</div>
            ))}
        </div>
    )
}
export default Profile;