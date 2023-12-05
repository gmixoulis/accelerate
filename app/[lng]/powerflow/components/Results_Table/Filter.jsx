"use client"
import { updateSearchParams } from "../../utils";
import { useRouter, useParams, useSearchParams, usePathname } from "next/navigation";
import { UseTranslation } from "@/app/i18n/client";
import DateRangePicker from "./Datepicker";


const Filter = ({
    statusFilter, setStatusFilter,
    modeFilter, setModeFilter,
    startDate, setStartDate,
    endDate, setEndDate,
}) => {
    const { lng } = useParams();
    const { t } = UseTranslation(lng, "powerflow");
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

   

    const handleUpdateParams = (title, e) => {
        const newPathName = updateSearchParams(title, e.value.toLowerCase(), searchParams, pathname);
        router.push(newPathName);
        router.refresh();
    };
    

    return (
        <>
            <div className="flex gap-8 flex-wrap ml-4 items-center">
            <div className="flex flex-col gap-2">
                <label htmlFor="statusFilter" className="text-md font-medium text-gray-700 dark:text-gray-50">{t("status")}</label>
                <select id="statusFilter" className="custom-box p-2.5"
                 onChange={(e) => {
                    setStatusFilter(e.target.value)
                    handleUpdateParams("status", e.target)
                    }} value={statusFilter}>
                   {statusFilter === "" && <option value="" disabled hidden>{t("filterStatus")}</option>}
                   <option value="done">{t("done")}</option>
                   <option value="in progress">{t("in progress")}</option>
                   <option value="failed">{t("failed")}</option>
                   <option value="retrying">{t("retrying")}</option>
                </select>
            </div>  
            <div className="flex flex-col gap-2">
                <label htmlFor="modeFilter" className="text-md font-medium text-gray-700 dark:text-gray-50">{t("mode")}</label>
                <select id="modeFilter" className="custom-box p-2.5"
                 onChange={(e) => {
                    setModeFilter(e.target.value)
                    handleUpdateParams("mode", e.target)
                 }} value={modeFilter}>
                   {modeFilter === "" && <option value="" disabled hidden>{t("filterMode")}</option>}
                   <option value="parallel">{t("parallel")}</option>
                    <option value="sequential">{t("sequential")}</option>
                   <option value="stream">{t("stream")}</option>
                </select>
            </div>  
            <div className="bg-gray-100 dark:bg-gray-800 flex flex-col z-30">
            <label htmlFor="dateFilter" className="text-md font-medium text-gray-700 dark:text-gray-50">{t("created at")}</label>
                <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                />
            </div>
            </div>
        </>
    )
}

export default Filter;
