"use client"

import Tabs from "@/app/[lng]/powerflow/components/Tabs";
import Tab from "@/app/[lng]/powerflow/components/Tab";
import { useState } from "react";
import Link from "next/link";
import { UseTranslation } from "@/app/i18n/client";
import Search from "../../components/Search";

export default function Page({params}) {
    const [activeTab, setActiveTab] = useState("latest");

    const { t } = UseTranslation(params.lng, "knowledge-graph");

    return (
        <>
        <div className="ml-2 flex flex-col gap-4 h-full">
        {/* <h2 className="font-sans text-dimgray-200 text-7xl dark:text-white">
            Knowledge Graph
        </h2> */}
        <div className="flex gap-2 mb-2 items-center">
            <Search />
            <div className="hidden h-10 mx-1 border-r border-gray-300 dark:border-gray-500 md:block"></div>
            <button className="primary-button text-white w-32 rounded-lg p-1 py-2 font-regular">{t("Add Entry")}</button>
        </div>
        <div>
        <Tabs>
            <Tab label={t("Latest")} active={activeTab === "latest"} onClick={() => setActiveTab("latest")} />
            <Tab label={t("Most Connected")} active={activeTab === "connected"} onClick={() => setActiveTab("connected")} />
            <Tab label={t("Most Visited")} active={activeTab === "visited"} onClick={() => setActiveTab("visited")} />
        </Tabs>
        <div className="flex-1 max-w-[80%] min-h-[40vh] border border-gray-200 dark:border-gray-600 rounded-md p-4">
            <p><Link href={`/${params.lng}/knowledge-graph/entry`} className="underline hover:text-unicred-300">Entry name</Link> {t("added by")} @anon</p>
        </div>
        </div>
        </div>
        </>
    )
}