"use client"
import { UseTranslation } from "@/app/i18n/client";
import { MdSearchOff } from "react-icons/md";
import { useState, useEffect } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { IconFilter } from "@tabler/icons-react";
import { Typography, Tooltip, Card, CardHeader, CardBody, CardFooter } from "@material-tailwind/react";
import { deleteSearchParams, formatDate, getStatusBadge } from "../../utils";
import Checkbox from "./Checkbox";
import Search from "./Search";
import AutoRefresh from "./AutoRefresh";
import ActionsButton from "./ActionsButton";
import Filter from "./Filter";
import Pagination from "../Pagination";
import { useRouter, useParams, useSearchParams, usePathname } from "next/navigation";
import RefreshBtn from "./RefreshBtn";
import { ParallelModal } from "./ParallelModal";
import { Checkbox as MuiCheckbox } from '@mui/material';
import { useMemo } from "react";

const Table = ({ tasks, total }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { lng } = useParams();
    const { t } = UseTranslation(lng, "powerflow");

    const [checkedItems, setCheckedItems] = useState(() => Array(tasks.length).fill(false));
    const [showFilter, setShowFilter] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const [statusFilter, setStatusFilter] = useState("");
    const [modeFilter, setModeFilter] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [showParallelModal, setShowParallelModal] = useState(false);
    const [parallelPrompt, setParallelPrompt] = useState(null);

    const anyFilterActive = statusFilter !== "" || modeFilter !== "" || startDate !== null || endDate !== null;

    const TABLE_HEAD = useMemo(() => [
        { id: t("title"), sort: "" },
        { id: t("mode"), sort: "" },
        { id: t("status"), sort: "" },
        { id: t("created at"), sort: "" },
        { id: t("updated at"), sort: "desc" },
    ], [t]);



    const handleTitleClick = (id) => {
        router.push(`/${lng}/powerflow/my-results/${id}`);
    };

    const handleCheckAllChange = (event) => {
        setCheckedItems(Array(tasks.length).fill(event.target.checked));
    };

    const handleCheckboxChange = (index) => {
        const updatedCheckedItems = [...checkedItems];
        updatedCheckedItems[index] = !updatedCheckedItems[index];
        setCheckedItems(updatedCheckedItems);
    };

    const handleDeleteParams = (title) => {
        const newPathName = deleteSearchParams(title, searchParams, pathname);
        router.push(newPathName);
        router.refresh();
    };

    const handleDeleteDateParams = () => {
        const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
        currentParams.delete("startDate");
        currentParams.delete("endDate");

        const newPathName = `${pathname}?${currentParams.toString()}`;

        router.push(newPathName);
        router.refresh();
    };

    //Filter tasks based on checked items
    const filteredTasks = tasks.filter((prompt, index) => checkedItems[index]);

    //Get chat ids of filtered tasks
    const chatIds = filteredTasks.map((prompt) => {
        // if (prompt.mode !== "parallel") {
        //     return prompt.chat_id;
        // } else {
        //     return prompt.batch.map((prompt) => prompt.chat_id);
        // }
        return prompt.chat_id;
    }).flat();


    return (
        <Card shadow={false} className="rounded-md flex max-w-[80vw] md:max-w-[89%] bg-white dark:bg-darkslategray-100">
            <div className="sticky 2xl:top-20 z-30 bg-gray-100 dark:bg-gray-800 rounded-t-md border-b-2 border-b-white dark:border-b-gray-700 pt-6 px-3 w-full">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="bg-gray-100 dark:bg-gray-800 flex flex-wrap justify-between gap-4">
                        <Search />
                        <div className="flex flex-wrap gap-4 items-center">
                            <AutoRefresh setIsFetching={setIsFetching} />
                            <ActionsButton
                                isHeader={true}
                                disabled={checkedItems.every(item => item === false)}
                                chatIds={chatIds}
                                refresh={() => router.refresh()}
                                reset={() => {
                                    setCheckedItems((prevCheckedItems) =>
                                        prevCheckedItems.map(() => false));
                                }} />

                            < RefreshBtn isFetching={isFetching} setIsFetching={setIsFetching} />
                            <button className="flex items-center gap-3 text-md font-normal rounded-md tracking-normal px-2 py-2 text-gray-800 shadow-sm custom-box"
                                onClick={() => setShowFilter(!showFilter)}>
                                <IconFilter className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </CardHeader>
                {showFilter &&
                    <div className="flex flex-wrap my-10">
                        < Filter
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            modeFilter={modeFilter}
                            setModeFilter={setModeFilter}
                            startDate={startDate}
                            setStartDate={setStartDate}
                            endDate={endDate}
                            setEndDate={setEndDate}
                        />
                    </div>
                }
                <div className="flex flex-wrap gap-4 mb-6 mt-4 ml-4">
                    {statusFilter === "done" &&
                        <span id="badge-dismiss-green" className="inline-flex items-center px-2 py-1 mr-2 mb-2 text-md font-medium text-green-900 bg-green-50 rounded dark:bg-green-800 dark:text-white">
                            {t("done")}
                            <button type="button" className="inline-flex items-center p-0.5 ml-2 text-md text-green-600 bg-transparent rounded-sm hover:scale-125 hover:text-green-900 dark:text-green-50 dark:hover:text-white" aria-label="Remove"
                                onClick={() => {
                                    setStatusFilter("")
                                    handleDeleteParams("status")
                                }}>
                                <svg aria-hidden="true" className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Remove badge</span>
                            </button>
                        </span>
                    }
                    {statusFilter === "in progress" &&
                        <span id="badge-dismiss-yellow" className="inline-flex items-center px-2 py-1 mr-2 mb-2 text-md font-medium text-brown-800 bg-yellow-100 rounded dark:bg-yellow-500 dark:!text-brown-900">
                            {t("in progress")}
                            <button type="button" className="inline-flex items-center p-0.5 ml-2 text-md text-brown-700 bg-transparent rounded-sm hover:scale-125 hover:text-brown-900 dark:!text-brown-800 dark:hover:text-brown-900" aria-label="Remove"
                                onClick={() => {
                                    setStatusFilter("")
                                    handleDeleteParams("status")
                                }}>
                                <svg aria-hidden="true" className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Remove badge</span>
                            </button>
                        </span>
                    }
                    {statusFilter === "failed" &&
                        <span id="badge-dismiss-red" className="inline-flex items-center px-2 py-1 mr-2 mb-2 text-md font-medium text-red-800 bg-red-50 rounded dark:bg-red-900 dark:text-white">
                            {t("failed")}
                            <button type="button" className="inline-flex items-center p-0.5 ml-2 text-md text-red-400 dark:text-red-50 bg-transparent rounded-sm hover:scale-125 hover:text-red-900 dark:hover:text-white" aria-label="Remove"
                                onClick={() => {
                                    setStatusFilter("")
                                    handleDeleteParams("status")
                                }}>
                                <svg aria-hidden="true" className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Remove badge</span>
                            </button>
                        </span>
                    }
                    {statusFilter === "retrying" &&
                        <span id="badge-dismiss-indigo" className="inline-flex items-center px-2 py-1 mr-2 mb-2 text-md font-medium rounded text-deep-orange-900 bg-orange-50 dark:bg-orange-900 dark:text-white">
                            {t("retrying")}
                            <button type="button" className="inline-flex items-center p-0.5 ml-2 text-md text-orange-800 bg-transparent rounded-sm hover:scale-125 hover:text-deep-orange-900 dark:text-orange-50 dark:hover:text-white" aria-label="Remove"
                                onClick={() => {
                                    setStatusFilter("")
                                    handleDeleteParams("status")
                                }}>
                                <svg aria-hidden="true" className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Remove badge</span>
                            </button>
                        </span>
                    }
                    {modeFilter !== "" &&
                        <span id="badge-dismiss-purple" className="inline-flex items-center px-2 py-1 mr-2 mb-2 text-md font-medium text-purple-900 bg-purple-50 rounded dark:bg-purple-900 dark:text-purple-50 capitalize">
                            {modeFilter}
                            <button type="button" className="inline-flex items-center p-0.5 ml-2 text-md text-purple-800 bg-transparent rounded-sm hover:scale-125 hover:text-purple-900 dark:text-purple-50 dark:hover:text-white" aria-label="Remove" onClick={() => {
                                setModeFilter("")
                                handleDeleteParams("mode")
                            }}>
                                <svg aria-hidden="true" className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Remove badge</span>
                            </button>
                        </span>
                    }


                    {startDate !== null && endDate !== null &&
                        <span id="badge-dismiss-default" className="inline-flex items-center px-2 py-1 mr-2 mb-2 text-md font-medium text-blue-900 bg-blue-50 rounded dark:bg-blue-900 dark:text-blue-50">
                            {`${formatDate(startDate, false)} - ${formatDate(endDate, false)}`}
                            <button type="button" className="inline-flex items-center p-0.5 ml-2 text-md text-blue-800 bg-transparent rounded-sm hover:scale-125 hover:text-blue-900 dark:text-blue-50 dark:hover:text-white" aria-label="Remove"
                                onClick={() => {
                                    setStartDate(null)
                                    setEndDate(null)
                                    handleDeleteDateParams()
                                }}>
                                <svg aria-hidden="true" className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Remove badge</span>
                            </button>
                        </span>
                    }
                </div>
            </div>
            <CardBody className="px-0 py-0 bg-white dark:bg-darkslategray-100 rounded-b-md shadow-md overflow-x-auto md:overflow-x-visible">
                <table className="w-full table-auto text-left">
                    <thead className={`bg-gray-200 dark:bg-gray-900 sticky z-20
            ${showFilter && anyFilterActive ? "2xl:top-2/4 3xl:top-[350px]" :
                            showFilter ? "2xl:top-80" :
                                anyFilterActive ? "2xl:top-56" :
                                    "2xl:top-48"
                        }`}>
                        <tr className="rounded-t-md">
                            <th scope="col" className="p-4">
                                <div className="flex items-center justify-center h-5">
                                    <MuiCheckbox id="hs-table-pagination-checkbox-all" size='small' checked={checkedItems.filter((item) => item === true).length === checkedItems.length && checkedItems.length > 1} onChange={handleCheckAllChange}
                                        disableRipple className='mui-checkbox'
                                    />
                                    <label htmlFor="hs-table-pagination-checkbox-all" className="sr-only">Checkbox</label>
                                </div>
                            </th>
                            {TABLE_HEAD.map((head) => (
                                <th
                                    key={head.id}
                                    className="p-4" //hover:cursor-pointer hover:bg-gainsboro-100 dark:hover:bg-gray-600
                                    onClick={head.click}
                                >
                                    <div className="flex items-center gap-2 leading-none font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider text-sm" lang={lng}>
                                        {head.id}{" "}
                                        <span className="flex flex-col">
                                            <ChevronUpIcon strokeWidth={3} className={`h-2.5 w-2.5 ${head.sort === "desc" ? "text-gray-900 dark:text-white" : "dark:text-gray-400"}`} />
                                            <ChevronDownIcon strokeWidth={3} className={`h-2.5 w-2.5 -mt-1 ${head.sort === "desc" ? "text-gray-900 dark:text-white" : "dark:text-gray-400"}`} />
                                        </span>
                                    </div>
                                </th>
                            ))}
                            <th
                                className="p-4"
                            >
                                <div
                                    className="flex items-center gap-2 leading-none font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider text-sm"
                                    lang={lng}
                                >
                                    {t("actions")}{" "}
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-gray-200 dark:divide-gray-700">
                        {tasks.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center p-36">
                                    <div className="flex justify-center items-center gap-2">
                                        <MdSearchOff className="h-12 w-12 text-gray-800 dark:text-gray-200" />
                                        <Typography as="h2" className="text-2xl font-medium text-gray-800 dark:text-gray-200">
                                            {t("no records")}
                                        </Typography>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            tasks.map((prompt, index) => {
                                return (
                                    <tr key={prompt.chat_id} className="odd:bg-white bg-gray-100 dark:bg-gray-800 dark:even:bg-gray-700">
                                        <td className="px-4 py-2 ">
                                            <Checkbox
                                                id={`hs-table-pagination-checkbox-${prompt.chat_id}`}
                                                checked={checkedItems[index] || false}
                                                onChange={() => handleCheckboxChange(index)}
                                                htmlFor={`hs-table-pagination-checkbox-${prompt.chat_id}`}
                                            />
                                        </td>
                                        <td onClick={() => {
                                            // if (prompt.mode !== "parallel") {
                                            //     handleTitleClick(prompt.chat_id);
                                            // } else {
                                            //     setParallelPrompt(prompt);
                                            //     setShowParallelModal(true);
                                            // }
                                            handleTitleClick(prompt.chat_id);
                                        }} className="max-w-[15rem] min-w-[15rem] px-4 py-2 text-md text-justify font-medium text-gray-800 hover:text-red-100 dark:text-gray-200 dark:hover:text-white hover:cursor-pointer">
                                            <div className="w-full whitespace-nowrap overflow-ellipsis overflow-hidden">
                                                <Tooltip placement="bottom-start" className="max-w-2xl md:max-w-4xl bg-white shadow-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200 border border-gray-500 dark:border-gray-600 z-30 rounded-md p-1.5" content={prompt.title}>
                                                    {prompt.title}
                                                </Tooltip>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-md text-gray-800 dark:text-gray-200 min-w-0 capitalize">{t(prompt.mode)}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-md text-gray-800 dark:text-gray-200 min-w-0">
                                            {getStatusBadge(prompt.status, t(prompt.status))}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-md text-gray-800 dark:text-gray-200 min-w-0">{formatDate(prompt.created_at)}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-md text-gray-800 dark:text-gray-200 min-w-0">{formatDate(prompt.updated_at)}</td>
                                        <td className={`px-4 py-2 text-md text-gray-800 dark:text-gray-200 min-w-0 `} >
                                            <div className="flex items-center">
                                                <ActionsButton disabled={false}
                                                    chatIds={
                                                        // (prompt.mode !== "parallel") ? [prompt.chat_id] : prompt.batch.map((prompt) => prompt.chat_id)
                                                        [prompt.chat_id]
                                                    }
                                                    reset={() => {
                                                        setCheckedItems((prevCheckedItems) =>
                                                            prevCheckedItems.map(() => false)
                                                        );
                                                    }}
                                                    refresh={() => router.refresh()}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </CardBody>
            {tasks.length > 0 &&
                <CardFooter divider={true} className="flex items-center justify-between p-4 sticky bottom-0 bg-white dark:bg-darkslategray-100">
                    <Pagination total={total} />
                </CardFooter>
            }
            {/* <ParallelModal open={showParallelModal} setOpen={setShowParallelModal} prompt={parallelPrompt} /> */}
        </Card>
    )
}

export default Table;

