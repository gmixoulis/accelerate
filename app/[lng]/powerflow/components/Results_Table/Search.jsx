import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams, usePathname, useSearchParams } from "next/navigation";
import { UseTranslation } from "@/app/i18n/client";
import { useDebounce } from "use-debounce";
import SearchIcon from '@mui/icons-material/Search';
import { IconSearch } from "@tabler/icons-react";

const Search = () => {
    const { lng } = useParams();
    const { t } = UseTranslation(lng, "powerflow");
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [search, setSearch] = useState("");
    const [query] = useDebounce(search, 500);

    const updateSearchParams = useCallback((search) => {
        const currentSearchParams = new URLSearchParams(Array.from(searchParams.entries()));

        // Update or delete 'search' parameter based on search value
        if (search) {
            currentSearchParams.set("search", search);
        } else {
            currentSearchParams.delete("search");
        }

        const newPathname = `${pathname}?${currentSearchParams.toString()}`;
        router.push(newPathname);
        router.refresh();
    }, [pathname, router, searchParams]);

    useEffect(() => {
        updateSearchParams(query);
    }, [query, updateSearchParams]);


    return (
        <div className="relative flex-1 max-w-sm">
                        <label htmlFor="hs-table-with-pagination-search" className="sr-only">{t("search")}</label>
                        <input type="text" name="hs-table-with-pagination-search" id="hs-table-with-pagination-search" className="p-2 pl-10 pr-10 block w-full border-gray-200 rounded-md text-sm custom-box" 
                            placeholder={t("placeholders.search")}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}/>
                            {search && 
                            <button
                            onClick={() => {
                                setSearch("");
                                updateSearchParams("");
                            }}
                            className="absolute inset-y-0 right-0 flex items-center pr-4"
                            >
                            <svg
                                className="h-4 w-4 text-gray-500 hover:text-gray-600 cursor-pointer"
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
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4 mr-1 my-0.5 mb-1.5">
                        <IconSearch className="text-gray-500 dark:text-gray-300 h-4 w-4"/>
                        </div>
                    </div>
    )
}

export default Search