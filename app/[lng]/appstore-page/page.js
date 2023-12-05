"use client"

import React from "react"
import { BACKEND_URL } from "@/server"
import { FolderSpecial } from "@mui/icons-material"
import { useQuery } from "@tanstack/react-query"
import { IoChatbubbleSharp } from "react-icons/io5"
import { PiGraph, PiRocketLaunch,PiUser } from "react-icons/pi"

import Sidebar from "@/app/[lng]/components/Sidebar"

import { UseTranslation } from "../../i18n/client"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import axiosRequest from "../hooks/axiosRequest"
import fetchApps from "../hooks/fetchApps"
import getAccessToken from "../hooks/getAccessToken"
import Loader from "../myapps-page/loader"
import App from "./components/App"

export default function AppStore(params) {
  const { t } = UseTranslation(params.lng, "appstore-page")

  const [apps, setApps] = React.useState([])
  const { RoleName } = getAccessToken()
  const [loading, setLoading] = React.useState(true)
  const { data } = useQuery({
    queryKey: ["apps"],
    queryFn: fetchApps,
    suspense: true,
    refreshInterval: 10000 * 5 * 60,
    cacheTime: Infinity,
    refetchOnMount: false,
  })

  // const userApps = useQuery({
  //   queryKey: ["user-apps"],
  //   queryFn: fetchUserApps,
  //   suspense: true,
  //   refreshInterval: 10000 * 5 * 60,
  //   cacheTime: Infinity,
  //   refetchOnMount: false,
  // })
  const selectedApps = React.useMemo(() =>
    apps
      .filter(
        (app) =>
          app.AppID === 2 || (app.AppID === 1 && RoleName.includes("SYS"))
      )
      ?.map((app, index) => <App key={index} {...app} />)
  )
  React.useEffect(() => {
    async function getApps() {
      let userAppsResponse
      try {
        userAppsResponse = await axiosRequest(BACKEND_URL + "app/user/")
      } catch (e) {
        console.log(e)
      }
      let appsResponse
      try {
        appsResponse = data
        if (!appsResponse.error) {
          setApps(
            appsResponse.apps.map((appData) => ({
              logo: logoApps2[appData.AppName],
              name: <div className="dark:text-white">{appData.AppName}</div>,
              description: appData.AppDescription,
              installation: userAppsResponse?.data?.apps,
              AppID: appData.AppID,
            }))
          )
        }
      } catch (e) {
        console.log(e)
      }
    }
    setTimeout(() => {
      setLoading(false)
      getApps()
      setLoading(true)
    }, 100)
  }, [])

  const logoApps2 = {
    "Accelerate System": (
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gainsboro-100">
        <PiRocketLaunch className="w-8 h-8 text-lightskyblue" />
      </div>
    ),
    Powerflow: (
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gainsboro-100">
        <IoChatbubbleSharp className="w-8 h-8 text-lightskyblue" />
      </div>
    ),
    "My Files": (
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gainsboro-100">
        <FolderSpecial className="w-8 h-8 text-lightskyblue" />
      </div>
    ),
    "Knowledge Graph": (
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gainsboro-100">
        <PiGraph className="w-8 h-8 text-lightskyblue" />
      </div>
    ),
    "Tenants App": (
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gainsboro-100">
        <PiUser className="w-8 h-8 text-lightskyblue" />
      </div>
    ),
  }

  // const apps = [
  //   {
  //     logo: (
  //      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gainsboro-100">
  //        <IoChatbubbleSharp className="w-8 h-8 text-lightskyblue" />
  //      </div>
  //     ),
  //     name: <div className="dark:text-white">Powerflow</div>,
  //     description: t("An advanced AI assistant"),
  //   },
  // ]

  return (
    <>
      <Navbar />
      <div className="flex flex-wrap w-auto h-[86%] overflow-x-hidden dark:bg-darkslategray-100 3xl:h-[100%]">
        <Sidebar
          topNavigation={
            [
              // {
              //   name: "Add New Widget",
              //   href: `#`,
              //   icon: <BsWindowPlus size={30} />,
              // },
              // {
              //   name: "Add New App",
              //   href: `#`,
              //   icon: <MdOutlineDashboardCustomize size={30} />,
              // },
              // {
              //   name: "Edit Dashboard",
              //   href: `#`,
              //   icon: <MdOutlineDashboard size={30} />,
              // },
            ]
          }
        >
          <main className="w-[75vw] h-[96%] 3xl:w-[80vw] overflow-hidden flex flex-col ml-6 3xl:h-[100%]">
            <h2 className="top-0 flex-wrap block row-auto p-0 m-0 mt-2 font-sans text-dimgray-200 text-7xl dark:text-white">
              {t("Available Apps")}
            </h2>
            {loading ? (
              <div className="mt-5">
                {process.env.NEXT_PUBLIC_APP_ENV === "PROD" ? (
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {selectedApps}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {apps.map((app, index) => (
                      <App key={index} {...app} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Loader />
            )}
          </main>
          <div className="fixed flex content-center w-[95vw] md:w-[78vw] my-5 text-center align-start self-center bottom-0">
            <Footer />
          </div>
        </Sidebar>
      </div>
    </>
  )
}
