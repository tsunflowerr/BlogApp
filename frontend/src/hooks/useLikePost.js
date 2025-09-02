import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLike } from "../services/postService";

export const useLikePost = (setPosts) => {
    const querryClient = useQueryClient();

    return useMutation({
        mutationFn:({postId, token}) => toggleLike(postId, token),
        onSuccess: (data, variables) => {
            console.log("API response:", data);
            console.log(variables)
            setPosts((prev) => prev.map((p) => p._id === variables.postId ? {...p, likes: data.likes, likeCount: data.likeCount} : p))
        }
    })
}