import { useMemo } from "react";

export const DOTS = "...";

interface UsePaginationProps{
    totalCount : number;
    pageSize : number;
    siblingCount : number;
    currentPage : number;


}

type PaginationRange = (number | string)[];

export const usePagination = ({
    totalCount,
    pageSize,
    siblingCount = 1,
    currentPage,
    

}: UsePaginationProps): PaginationRange => {
    
   

    function range(start: number, end: number){
        return Array.from({ length: end - start +1 }, (_, i) => i+start);
    }
    
    const PaginationRange = useMemo<PaginationRange>(() => {

        const totalPageCount =  Math.ceil(totalCount / pageSize);

        const totalPageNumber = siblingCount + 5;

        if(totalPageNumber >= totalPageCount){
            return range(1, totalPageCount);
        }
        
        const leftSiblingIndex = Math.max(currentPage - siblingCount,1);
        const rightSiblingIndex = Math.min(
            currentPage + siblingCount, totalPageCount
        );

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPageCount;

        if(!shouldShowLeftDots && shouldShowRightDots){
            let leftItemCount = 3+2*siblingCount;
            let leftRange = range(1, leftItemCount);

            return [...leftRange, DOTS,totalPageCount];
        }

        if(shouldShowLeftDots && !shouldShowRightDots){
            let rightItemCount = 3+2*siblingCount;
            let rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);

            return [firstPageIndex,DOTS,...rightRange];
        }
        if(shouldShowLeftDots && shouldShowRightDots){
            let middleRange = range(leftSiblingIndex , rightSiblingIndex);

            return [firstPageIndex, DOTS, ...middleRange, DOTS,lastPageIndex];
        }

        return [];
    }, [totalCount,pageSize,siblingCount,currentPage]);

    return PaginationRange;
}