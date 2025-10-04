import React from "react";
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";

const BookmarkButton = ({ isBookmarked, onClick, disabled = false }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isBookmarked ? (
                <FaBookmark className="w-5 h-5 text-yellow-500 hover:text-yellow-600 hover:scale-110 transition-all cursor-pointer" />
            ) : (
                <CiBookmark className="w-5 h-5 text-gray-500 hover:bg-gray-200 hover:border hover:border-gray-200 hover:rounded-md hover:cursor-pointer hover:text-yellow-600 transition-all" />
            )}
        </button>
    );
};

export default BookmarkButton;