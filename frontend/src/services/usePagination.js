import { useMemo } from "react";

export const usePagination = (items, currentPage, itemsPerPage = 5) => {
    const paginatedData = useMemo(() => {
        const lastIndex = itemsPerPage * currentPage;
        const firstIndex = lastIndex - itemsPerPage;
        const currentItems = items.slice(firstIndex, lastIndex);
        const totalPages = Math.ceil(items.length / itemsPerPage);

        return {
            currentItems,
            totalPages,
            firstIndex,
            lastIndex
        };
    }, [items, currentPage, itemsPerPage]);

    return paginatedData;
};