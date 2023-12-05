"use client"
import { UseTranslation } from "@/app/i18n/client"
import { IconSearch } from "@tabler/icons-react"
import { useParams } from "next/navigation"
import { useState } from "react"

export default function Search() {
    const { lng } = useParams()
    const { t } = UseTranslation(lng, "knowledge-graph")
    const [search, setSearch] = useState("")

    return (
        <div className="relative flex-1 max-w-sm">
        <label htmlFor="hs-table-with-pagination-search" className="sr-only">search</label>
        <input type="text" name="kg-search" id="kg-search" className="p-2 pl-10 pr-10 block w-full border-gray-200 rounded-md text-sm custom-box text-gray-800" 
            placeholder={t("Search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}/>
            {search && 
            <button
            onClick={() => {setSearch("")}}
            className="absolute inset-y-0 right-0 flex items-center pr-4"
            >
            <svg
                className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
                />
            </svg>
                </button>
            }
        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4">
        {/* <svg className="h-3.5 w-3.5 text-gray-800 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
        </svg> */}
        <IconSearch className="h-4 w-4 text-gray-800 dark:text-gray-300" />
        </div>
    </div>
    )
}