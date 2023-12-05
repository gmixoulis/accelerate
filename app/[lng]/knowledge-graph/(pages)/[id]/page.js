"use client"

import Tabs from "@/app/[lng]/powerflow/components/Tabs";
import Tab from "@/app/[lng]/powerflow/components/Tab";
import { useState } from "react";
import { Card, CardBody, CardHeader } from "@material-tailwind/react";
import Link from "next/link";
import { UseTranslation } from "@/app/i18n/client";
import Search from "../../components/Search";


export default function Page({params}) {
    const [activeTab, setActiveTab] = useState("live feed");

    const { t } = UseTranslation(params.lng, "knowledge-graph");

    return (
        <>
        <Card shadow={false} className="flex-1 rounded-md ml-2 overflow-x-auto 2xl:overflow-visible dark:bg-darkslategray-100">
        <div className="flex gap-4 items-center mb-6">
        <Link href={`/${params.lng}/knowledge-graph`} className="dark:text-white ml-1 hover:underline">
            <span>{"< "}</span>
            <span>{t("Back")}</span>
        </Link>
        <Search />
        </div>
        <CardHeader shadow={false} floated={false} className="shadow-md mt-1 p-2 flex flex-col gap-2 2xl:max-w-[50%] bg-gray-100 dark:bg-gray-700">
        <h2 className="font-sans text-dimgray-200 text-7xl dark:text-white font-bold">
            Entry name
        </h2>
        <p className="text-md text-gray-600 dark:text-gray-400">{t("Record Owner")}: @anon</p>
        </CardHeader>
        <CardBody>
        <Tabs>
            <Tab label={t("Live Feed")} active={activeTab === "live feed"} onClick={() => setActiveTab("live feed")} />
            <Tab label={t("Overview")} active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
            <Tab label={t("Chronology")} active={activeTab === "chronology"} onClick={() => setActiveTab("chronology")} />
            <Tab label={t("Relationships")} active={activeTab === "relationships"} onClick={() => setActiveTab("relationships")} />
            <Tab label={t("Media")} active={activeTab === "media"} onClick={() => setActiveTab("media")} />
            {/* <Tab label={t("Forks")} active={activeTab === "forks"} onClick={() => setActiveTab("forks")} />
            <Tab label={t("Used In")} active={activeTab === "used in"} onClick={() => setActiveTab("used in")} /> */}
        </Tabs>
        <div className="flex-1 min-h-[30vh] border border-gray-200 dark:border-gray-600 rounded-md">

        </div>
        </CardBody>
        </Card>
        </>
    )
}