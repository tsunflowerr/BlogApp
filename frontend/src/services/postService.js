import axios from "axios";

const API_URL = "http://localhost:4000/api/posts"

export const toggleLike = async (postId, token) => {
    const res = await axios.post(`${API_URL}/${postId}/like`, {} , {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}