import { useRouter, useSearchParams, usePathname  } from "next/navigation";
import { updateSearchParams } from "../utils";
import { useState } from "react";
import {ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Trans } from "react-i18next";


const Pagination = ({total}) => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
    const [itemsPerPage] = useState(50);
    const totalPages = Math.ceil(total / itemsPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);


    const handleUpdateParams = (page) => {
        const newPathName = updateSearchParams("page", page, searchParams, pathname);
        router.push(newPathName);
    };

    return (
        <>
        <div>
            <p className="text-md text-gray-700 dark:text-gray-300">
            <Trans 
            i18nKey="powerflow:showingResults" 
            values={{
                start: total === 0 ? 0 : 1 + (currentPage - 1) * itemsPerPage,
                end: Math.min(currentPage * itemsPerPage, total),
                total: total
            }}
            components={[
                <span key="start" className="font-semibold"/>, 
                <span key="end" className="font-semibold"/>, 
                <span key="total" className="font-semibold"/>,  
            ]}
            />
            </p>
        </div>
        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
            onClick={() => {
                if (currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                 }
                handleUpdateParams(currentPage - 1);
            }}
            className={`relative inline-flex items-center rounded-l-md px-2 py-2  text-gray-400 ring-1 ring-inset ring-gray-300  focus:outline-offset-0
             ${currentPage === 1 ? 'cursor-not-allowed opacity-50 hover:' : 'hover:bg-red-50 dark:hover:bg-red-200'}`}
            disabled={currentPage === 1}
            >
            <span className="sr-only">Previous</span>
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            {pages.map((index) => {
            const pageNumber = index;
            if ( 
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
                return ( 
                <button
                    key={pageNumber}
                    onClick={() => {
                    setCurrentPage(pageNumber);
                    handleUpdateParams(pageNumber);
                    }}
                    className={`relative inline-flex items-center px-4 py-2 text-md font-medium ring-1 ring-inset ring-gray-300 hover:bg-red-50 dark:hover:bg-red-200 focus:outline-offset-0 ${
                    pageNumber === currentPage
                        ? 'bg-unicred-400 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:bg-unicred-400 dark:hover:bg-red-100'
                        : 'text-gray-900 dark:text-gray-300'
                    }`}
                >
                    {pageNumber}
                </button>
                );
            } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === totalPages - 1
            ) {
                return (
                <span
                    key={pageNumber}
                    className="relative inline-flex items-center px-4 py-2 text-md font-medium ring-1 ring-inset ring-gray-300"
                >
                    ...
                </span>
                );
            } else {
                return null;
            }
            })}

            <button
            onClick={() => {
                if (currentPage < totalPages) {
                    setCurrentPage(currentPage + 1);
                 }
                handleUpdateParams(currentPage + 1);
            }}
            className={`relative inline-flex items-center rounded-r-md p-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:outline-offset-0
             ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'hover:bg-red-50 dark:hover:bg-red-200'}`}
            disabled={currentPage === totalPages}
            >
            <span className="sr-only">Next</span>
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
        </nav>
     </>
    )
}

export default Pagination