import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const URL_API = "http://localhost:4000/api";

export const useBookmark = (onSuccessCallback) => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ postId, token }) => {
            const { data } = await axios.post(
                `${URL_API}/users/bookmarks`,
                { postId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return data;
        },
        onSuccess: (data, variables) => {
            if (data.type === "Add") {
                toast.success("Added to bookmarks");
            } else {
                toast.success("Removed from bookmarks");
            }
            
            queryClient.invalidateQueries(['userBookmarks']);
            
            if (onSuccessCallback) {
                onSuccessCallback(data, variables.postId);
            }
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update bookmark");
        }
    });
};