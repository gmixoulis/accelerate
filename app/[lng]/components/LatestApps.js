"use client"

import React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { FolderSpecial } from "@mui/icons-material"
import { useQuery } from "@tanstack/react-query"
import { IoChatbubbleSharp } from "react-icons/io5"
import { PiGraph, PiRocketLaunch } from "react-icons/pi"

import { UseTranslation } from "../../i18n/client"
import fetchApps from "../hooks/fetchApps"
import getAccessToken from "../hooks/getAccessToken"

const LatestApps = () => {
  const { lng } = useParams()
  const { t } = UseTranslation(lng, "latest-apps")

  const [apps, setApps] = React.useState([])
  const { RoleName } = getAccessToken()

  let array1 = []
  const { data } = useQuery({
    queryKey: ["apps"],
    queryFn: fetchApps,
    suspense: true,
    refreshInterval: 10000 * 5 * 60,
    cacheTime: Infinity,
    refetchOnMount: false,
  })
  React.useEffect(() => {
    if (RoleName.includes("SYS")) {
      array1 = [1, 2]
    } else {
      array1 = [1]
    }
    setApps(
      data?.apps.map((appData, index) => ({
        logo: logoApps2[appData.AppName],
        name: <div className="dark:text-white">{appData.AppName}</div>,
        description: t(appData.Description),
        // Conditionally hide the last two apps in PROD
        hidden:
          process.env.NEXT_PUBLIC_APP_ENV === "PROD" &&
          !array1.includes(appData.AppID),
      }))
    )
  }, [])

  const logoApps2 = {
    "Accelerate System": (
      <div className="flex flex-col items-center w-24 mt-4 ml-4">
        <Link href={`/${lng}/system-app`} style={{ textDecoration: "none" }}>
          <div className="flex items-center justify-center w-24 h-24 border rounded-md bg-gainsboro-100">
            <PiRocketLaunch className="w-12 h-12 text-lightskyblue" />
          </div>
        </Link>
      </div>
    ),
    Powerflow: (
      <div className="flex flex-col items-center w-24 ml-4">
        <Link href={`/${lng}/powerflow`} style={{ textDecoration: "none" }}>
          <div className="flex items-center justify-center w-24 h-24 border rounded-md bg-gainsboro-100">
            <IoChatbubbleSharp className="w-12 h-12 text-lightskyblue" />
          </div>
        </Link>
      </div>
    ),
    "My Files": (
      <div className="flex flex-col items-center w-24 ml-4">
        <Link href={`/${lng}/myfiles`} style={{ textDecoration: "none" }}>
          <div className="flex items-center justify-center w-24 h-24 border rounded-md bg-gainsboro-100">
            <FolderSpecial className="w-12 h-12 !text-lightskyblue dark:!text-lightskyblue" />
          </div>
        </Link>
      </div>
    ),
    "Knowledge Graph": (
      <div className="flex flex-col items-center w-24 mt-4 ml-4">
        <Link
          href={`/${lng}/knowledge-graph`}
          style={{ textDecoration: "none" }}
        >
          <div className="flex items-center justify-center w-24 h-24 border rounded-md bg-gainsboro-100">
            <PiGraph className="w-12 h-12 text-lightskyblue" />
          </div>
        </Link>
      </div>
    ),
  }
  return (
    <section className="flex flex-wrap w-full text-center flex-start">
      <h2 className="top-0 flex-wrap block row-auto p-0 m-0 ml-3 font-sans text-dimgray-200 text-7xl dark:text-white">
        {t("Frequently Used Apps")}
      </h2>
      <div className="grid w-full grid-flow-col mt-6 overflow-auto overflow-x-auto items-left self-left justify-left auto-cols-max gap-x-3">
        <div className="flex items-center space-x-7 w-fit">
          <div className="flex flex-col items-center w-24 ml-4">
            <Link href={`/${lng}/powerflow`} style={{ textDecoration: "none" }}>
              <div className="flex items-center justify-center w-24 h-24 border rounded-md bg-gainsboro-100">
                <IoChatbubbleSharp className="w-12 h-12 text-lightskyblue" />
              </div>
              <h3 className="mt-2 mr-2 font-bold text-left text-dimgray-200 dark:text-gainsboro-100">
                Powerflow
              </h3>
            </Link>
          </div>
          {process.env.NEXT_PUBLIC_APP_ENV !== "PROD" && (
            <>
              <div className="flex flex-col items-center w-24 mt-4 ml-4">
                <Link
                  href={`/${lng}/system-app`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="flex items-center justify-center w-24 h-24 border rounded-md bg-gainsboro-100">
                    <PiRocketLaunch className="w-12 h-12 text-blue-500" />
                  </div>
                  <h3 className="mt-2 font-bold text-left text-dimgray-200 dark:text-gainsboro-100">
                    Accelerate System
                  </h3>
                </Link>
              </div>
              <div className="flex flex-col items-center w-24 mt-4 ml-4">
                <Link
                  href={`/${lng}/knowledge-graph`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="flex items-center justify-center w-24 h-24 border rounded-md bg-gainsboro-100">
                    <PiGraph className="w-12 h-12 text-blue-500" />
                  </div>
                  <h3 className="mt-2 font-bold text-left text-dimgray-200 dark:text-gainsboro-100">
                    Knowledge Graph
                  </h3>
                </Link>
              </div>
              <div className="flex flex-col items-center w-24 ml-4">
                <Link
                  href={`/${lng}/myfiles`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="flex items-center justify-center w-24 h-24 border rounded-md bg-gainsboro-100">
                    <FolderSpecial className="w-12 h-12 text-blue-500" />
                  </div>
                  <h3 className="mt-2 mr-2 font-bold text-left text-dimgray-200 dark:text-gainsboro-100">
                    My Files
                  </h3>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default LatestApps
