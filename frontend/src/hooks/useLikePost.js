import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLike } from "../services/postService";

export const useLikePost = (setPosts) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, token }) => toggleLike(postId, token),
        onSuccess: (data, variables) => {
            setPosts((prev) => {
                if (Array.isArray(prev)) {
                    return prev.map((p) =>
                        p._id === variables.postId
                            ? { ...p, likes: data.likes, likeCount: data.likeCount }
                            : p
                    );
                } else if (prev && typeof prev === "object") {
                    return {
                        ...prev,
                        likes: data.likes,
                        likeCount: data.likeCount,
                    };
                }
                return prev;
            });
        },
    });
};
