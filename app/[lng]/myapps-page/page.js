"use client"

import React from "react"
import Link from "next/link"
import { BACKEND_URL } from "@/server"
import { FolderSpecial } from "@mui/icons-material"
import WidgetsIcon from "@mui/icons-material/Widgets"
import { IoChatbubbleSharp } from "react-icons/io5"
import { PiGraph, PiRocketLaunch, PiUser } from "react-icons/pi"

import Sidebar from "@/app/[lng]/components/Sidebar"

import { UseTranslation } from "../../i18n/client"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import axiosRequest from "../hooks/axiosRequest"
import getAccessToken from "../hooks/getAccessToken"
import Loading from "./loader"

export default function MyApps({ params }) {
  const { t } = UseTranslation(params.lng, "myapps-page")
  const [apps, setApps] = React.useState([])
  const { UserID, RoleName } = getAccessToken()
  const [loading, setLoading] = React.useState(false)
  // const { data } = useQuery({
  //   queryKey: ["user-apps"],
  //   queryFn: fetchApps,
  //   suspense: true,
  //   refreshInterval: 10000 * 5 * 60,

  // })
  let array1 = []
  React.useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 500)
    if (RoleName.includes("Admin")) {
      array1 = [2]
    } else {
      array1 = [1, 2]
    }

    async function getApps() {
      let response
      try {
        //Make a dummy call to the health end-point
        const url = `${BACKEND_URL}health`
        await axiosRequest(url, "get")

        // Get the apps installed for the User
        const userAppsResponse = await axiosRequest(BACKEND_URL + "app/user/")
        const installedApps = userAppsResponse.data.apps || []

        // Filter apps from allApps that are installed for the user
        if (installedApps) {
          setApps(
            installedApps?.map((appData) => ({
              logo: logoApps2[appData.AppName],
              name: <div className="dark:text-white">{appData.AppName}</div>,
              description: t(appData.Description),
              hidden:
                process.env.NEXT_PUBLIC_APP_ENV === "PROD" &&
                !array1.includes(appData.AppID),
            })) || []
          )
        }
      } catch (e) {
        console.log(e)
      }
    } //end getApps()
    setTimeout(() => {
      getApps()
    }, 100)
  }, [])

  const logoApps2 = {
    "Accelerate System": (
      <div className="flex flex-col items-center w-24 mt-4 ml-4">
        <Link
          href={`/${params.lng}/system-app`}
          style={{ textDecoration: "none" }}
        >
          <div className="flex items-center justify-center w-24 h-24 border rounded-md bg-gainsboro-100">
            <PiRocketLaunch className="w-12 h-12 text-lightskyblue" />
          </div>
        </Link>
      </div>
    ),
    Powerflow: (
      <div className="flex flex-col items-center w-24 ml-4">
        <Link
          href={`/${params.lng}/powerflow`}
          style={{ textDecoration: "none" }}
        >
          <div className="flex items-center justify-center w-24 h-24 border rounded-md bg-gainsboro-100">
            <IoChatbubbleSharp className="w-12 h-12 text-lightskyblue" />
          </div>
        </Link>
      </div>
    ),
    "My Files": (
      <div className="flex flex-col items-center w-24 ml-4">
        <Link
          href={`/${params.lng}/myfiles`}
          style={{ textDecoration: "none" }}
        >
          <div className="flex items-center justify-center w-24 h-24 border rounded-md bg-gainsboro-100">
            <FolderSpecial className="w-12 h-12 text-lightskyblue" />
          </div>
        </Link>
      </div>
    ),
    "Knowledge Graph": (
      <div className="flex flex-col items-center w-24 mt-4 ml-4">
        <Link
          href={`/${params.lng}/knowledge-graph`}
          style={{ textDecoration: "none" }}
        >
          <div className="flex items-center justify-center w-24 h-24 border rounded-md bg-gainsboro-100">
            <PiGraph className="w-12 h-12 text-lightskyblue" />
          </div>
        </Link>
      </div>
    ),
    "Tenants App": (
      <div className="flex flex-col items-center w-24 ml-4">
        <Link
          href={`/${params.lng}/tenants-app`}
          style={{ textDecoration: "none" }}
        >
          <div className="flex items-center justify-center w-24 h-24 border rounded-md bg-gainsboro-100">
            <PiUser className="w-12 h-12 text-lightskyblue" />
          </div>
        </Link>
      </div>
    ),
  }
  return (
    <>
      <Navbar />
      <div className="flex flex-wrap w-auto h-[86%] 3xl:h-[100%] overflow-hidden dark:bg-darkslategray-100">
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
          <main className="w-[75vw] 3xl:w-[80vw] overflow-hidden ml-6 mt-2  h-[96%] 3xl:h-[100%]">
            <h2 className="top-0 flex-wrap block row-auto p-0 m-0 font-sans text-dimgray-200 text-7xl dark:text-white">
              {t("Available Apps")}
            </h2>
            <div className="grid w-full grid-flow-col mt-6 overflow-auto overflow-x-auto items-left self-left justify-left auto-cols-max gap-x-3">
              {loading ? (
                <Loading />
              ) : (
                <div className="flex items-center space-x-7 w-fit">
                  {apps && apps != [] && apps.length > 0 ? (
                    apps.map(
                      (app, index) =>
                        // Conditionally render the app if it's not hidden
                        !app.hidden && (
                          <div
                            className="flex flex-col items-center w-24 ml-4"
                            key={index}
                          >
                            <div>
                              {app.logo}
                              <h3 className="mt-2 font-bold text-center text-dimgray-200 dark:text-gainsboro-100">
                                {app.name}
                              </h3>
                            </div>
                          </div>
                        )
                    )
                  ) : (
                    <div className="absolute flex-wrap mt-[20vh] items-center ml-[20vw] self-center right-25 justify-center text-center h-[20vh] py-10 px-10 w-[40vw] dark:text-white top-50 bottom-50">
                      <WidgetsIcon
                        fontSize="large"
                        className="w-12 h-12 text-unicred-400 "
                      />
                      <br></br>
                      <h1 className="m-auto font-bold text-center text-dimgray-200 self-justify dark:text-gray-100 text-9xl">
                        {" "}
                        {t("No Applications to display")}
                      </h1>
                      <br></br>
                      <div>
                        {" "}
                        {t("Please navigate to")}
                        <Link className="underline" href={`./appstore-page`}>
                          {" "}
                          App Store
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
          <div className="fixed flex content-center w-[95vw] md:w-[78vw] my-5 text-center align-start self-center bottom-0">
            <Footer className=" bottom-1 3xl:bottom-0" />
          </div>
        </Sidebar>
      </div>
    </>
  )
}
