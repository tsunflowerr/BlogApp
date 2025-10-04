import { useMutation } from "@tanstack/react-query";
import { toggleLike } from "../services/postService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useLikePost = (setPosts, { redirectTo = "/login" } = {}) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ postId, token }) => {
      if (!token) {
        return Promise.reject(new Error("Not authenticated"));
      }
      return toggleLike(postId, token);
    },
    onError: (error) => {
      if (error.message === "Not authenticated") {
        toast.warning("Vui lòng đăng nhập để like bài viết");
        setTimeout(() => {navigate(redirectTo);}, 2000);
      }
    },
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
