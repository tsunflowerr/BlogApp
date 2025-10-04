import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const URL_API = "http://localhost:4000/api";

export const useUserBookmarks = (token) => {
    return useQuery({
        queryKey: ['userBookmarks', token],
        queryFn: async () => {
            if (!token) return [];
            
            const { data } = await axios.get(
                `${URL_API}/users/bookmarks`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            // Ensure we return the full post objects, not just IDs
            return data.bookmarks || [];
        },
        enabled: !!token, // Only run query if token exists
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
};