import { useState, useMemo } from 'react';

interface UsePaginationProps {
    totalItems: number;
    itemsPerPage: number;
    initialPage?: number;
}

export function usePagination({ totalItems, itemsPerPage, initialPage = 1 }: UsePaginationProps) {
    const [currentPage, setCurrentPage] = useState(initialPage);

    const paginationInfo = useMemo(() => {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

        return {
            currentPage,
            totalPages,
            totalItems,
            itemsPerPage,
            startIndex,
            endIndex,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1,
        };
    }, [currentPage, totalItems, itemsPerPage]);

    const goToPage = (page: number) => {
        const clampedPage = Math.max(1, Math.min(page, paginationInfo.totalPages));
        setCurrentPage(clampedPage);
    };

    const nextPage = () => {
        if (paginationInfo.hasNextPage) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const prevPage = () => {
        if (paginationInfo.hasPrevPage) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const reset = () => {
        setCurrentPage(1);
    };

    return {
        ...paginationInfo,
        goToPage,
        nextPage,
        prevPage,
        reset,
    };
}