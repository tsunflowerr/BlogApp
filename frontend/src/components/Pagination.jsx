import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        let pages = [];
        
        // First 3 pages
        for(let i = 1; i <= Math.min(3, totalPages); i++) {
            pages.push(i);
        }
        
        // Ellipsis after first 3
        if(currentPage > 5) {
            pages.push("...");
        }
        
        // Middle pages around current page
        let start = Math.max(4, currentPage - 1);
        let end = Math.min(totalPages - 3, currentPage + 1);
        
        for(let i = start; i <= end; i++) {
            if(i > 3 && i < totalPages - 2) {
                pages.push(i);
            }
        }
        
        // Ellipsis before last 3
        if(currentPage < totalPages - 4) {
            pages.push("...");
        }
        
        // Last 3 pages
        for(let i = Math.max(totalPages - 2, 4); i <= totalPages; i++) {
            if(i > 3) {
                pages.push(i);
            }
        }
        
        return pages;
    };

    const handlePageChange = (page) => {
        onPageChange(page);
        window.scroll({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="flex justify-center items-center gap-2 mt-5">
            <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
            >
                Prev
            </button>

            {getPageNumbers().map((page, index) =>
                page === "..." ? (
                    <span key={index} className="px-2">
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-md hover:cursor-pointer ${
                            currentPage === page
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                        }`}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 hover:cursor-pointer rounded-md disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;