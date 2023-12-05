"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { BACKEND_URL } from "@/server"
import { QueryCache, QueryClient, useQuery } from "@tanstack/react-query"
import axios from "axios"

import { UseTranslation } from "../../../i18n/client"
import axiosRequest from "../../hooks/axiosRequest"
import fetchUserApps from "../../hooks/fetchUserApps"
import getAccessToken from "../../hooks/getAccessToken"

const App = ({ logo = null, name, description, installation, AppID }) => {
  const [installed, setInstalled] = useState(false)
  const { lng } = useParams()
  const { t } = UseTranslation(lng, "appstore-component")
  const queryClient = new QueryClient()


  useEffect(() => {
    if (installation === undefined || installation === null) return
    for (const app of installation) {
      if (app.AppID === AppID) {
        setInstalled(true)
      }
    }
  }, [installation])

  async function installApp(AppID) {
    //install app with axiosRequest
    let response
    try {
      response = axiosRequest(BACKEND_URL + `app/install/${AppID}`, "post")
 
    } catch (error) {
      console.log("Error", error)
    }

    setInstalled(true)
  }

  async function uninstallApp(AppID) {
    let response
    try {
      response = await axiosRequest(
        BACKEND_URL + `app/uninstall/${AppID}`,
        "patch"
      )
   
    } catch (error) {
      console.log("Error", error)
    }

    setInstalled(false)
  }
  return (
    <div className="flex items-center max-w-[500px] gap-4 pb-2 border-b border-gray-300">
      {logo}
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col">
          <div className="font-sans font-bold text-md text-dimgray-200">
            {name}
          </div>
          <div className="text-sm text-gray-500">{description}</div>
        </div>
        {!installed ? (
          <button
            className="bg-whitesmoke w-30 py-2 px-2 text-dimgray-100 rounded-lg font-bold border-[1px] border-gray-400 border-solid cursor-pointer hover:border-0"
            onClick={() => installApp(AppID)}
          >
            {t("Install")}
          </button>
        ) : (
          <button
            className="bg-whitesmoke w-30 py-2 px-2 text-dimgray-100 rounded-lg font-bold border-[1px] border-gray-400 border-solid cursor-pointer hover:border-0"
            onClick={() => uninstallApp(AppID)}
          >
            {t("Uninstall")}
          </button>
        )}
      </div>
    </div>
  )
}

export default App

export const useGithubUser = () => {
  return useQuery(["user-apps"], fetchUserApps)
}
