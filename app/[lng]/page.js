import React from "react"

import "./global.css"
import Sidebar from "app/[lng]/components/Sidebar.jsx"

import Footer from "./components/Footer"
import LatestApps from "./components/LatestApps"
//import { useTranslation } from "next-i18next"
//import { fallbackLng, languages } from "../i18n/settings"
import Navbar from "./components/Navbar"

export default async function Page({ params: { lng } }) {
  //if (languages.indexOf(lng) < 0) lng = fallbackLng
  //const { t } = await useTranslation(lng)

  return (
    <>
      <Navbar />
      <div className="flex flex-wrap w-auto h-[86%] overflow-x-hidden dark:bg-darkslategray-100">
        <Sidebar
          topNavigation={
            [
              // {
              //   name: "Add New Widget",
              //   href: `/`,
              //   icon: <BsWindowPlus size={30} />,
              // },
              // {
              //   name: "Add New App",
              //   href: `/`,
              //   icon: <MdOutlineDashboardCustomize size={30} />,
              // },
              // {
              //   name: "Edit Dashboard",
              //   href: `/`,
              //   icon: <MdOutlineDashboard size={30} />,
              // },
            ]
          }
        >
          <main className="flex flex-col h-[96%] justify-between w-[75vw] 3xl:w-[80vw] overflow-hidden text-left ml-4 mt-2">
            {/* <div className="grid grid-cols-4 gap-1 p-2 ">
            <div className="col-span-1 text-bold p-4 aspect-w-1 aspect-h-1  h-[30vh] dark:bg-darkslategray-200 bg-whitesmoke  ">
              <h1 className="text-2xl font-bold text-dimgray-200 dark:text-whitesmoke">
                {t("New Leads")}
              </h1>
              <p className="text-53xl text-dimgray-200">{t("XX")}</p>
            </div>
            <div className="col-span-1 text-bold p-4 aspect-w-1 aspect-h-1 h-[30vh] dark:bg-darkslategray-200 bg-whitesmoke  ">
              <h1 className="text-2xl font-bold text-dimgray-200 dark:text-whitesmoke">
                {t("OKRs")}
              </h1>
              <p className="text-53xl text-dimgray-200">{t("XX")}</p>
            </div>
            <div className="col-span-1 text-bold p-4 aspect-w-1 aspect-h-1 h-[30vh] dark:bg-darkslategray-200 bg-whitesmoke  ">
              <h1 className="text-2xl font-bold text-dimgray-200 dark:text-whitesmoke">
                {t("Campus Air Quality")}
              </h1>
              <p className="text-53xl text-dimgray-200">{t("XX")}</p>
            </div>
            <div className="col-span-1 row-span-2 p-4 border-4 border-none text-bold bg-whitesmoke aspect-w-2 aspect-h-1 dark:bg-darkslategray-200">
              <h1 className="font-bold text-7xl text-dimgray-200 dark:text-whitesmoke">
                {t("Latest Alerts")}
              </h1>
              <p className="text-53xl text-dimgray-200">{t("XX")}</p>
            </div>
            <div className="col-span-1 text-bold p-4 aspect-w-1 aspect-h-1 h-[30vh] dark:bg-darkslategray-200 bg-whitesmoke  ">
              <h1 className="text-2xl font-bold text-dimgray-200 dark:text-whitesmoke">
                {t("New Courses")}
              </h1>
              <p className="text-53xl text-dimgray-200">{t("XX")}</p>
            </div>
            <div className="col-span-1 text-bold p-4 aspect-w-1 aspect-h-1 h-[30vh] dark:bg-darkslategray-200 bg-whitesmoke  ">
              <h1 className="text-2xl font-bold text-dimgray-200 dark:text-whitesmoke">
                {t("Daily Revenue")}
              </h1>
              <p className="text-53xl text-dimgray-200">{t("XX")}</p>
            </div>
            <div className="col-span-1 text-bold p-4 aspect-w-1 aspect-h-1 h-[30vh] dark:bg-darkslategray-200 bg-whitesmoke  ">
              <h1 className="text-2xl font-bold text-dimgray-200 dark:text-whitesmoke">
                {t("BLOC-511")}
              </h1>
              <p className="text-53xl text-dimgray-200">{t("XX")}</p>
            </div>
          </div>*/}

            <LatestApps />
          </main>
          <div className="fixed flex content-center w-[95vw] md:w-[78vw] my-5 text-center align-start self-center bottom-0">
            <Footer />
          </div>
        </Sidebar>
      </div>
    </>
  )
}
